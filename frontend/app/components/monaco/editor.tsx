"use client"
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useJSON } from "@/src/context/JSONContext";

// disable ssr - monaco client sid
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const Editor = () => {
    const { jsonData, setJsonData } = useJSON();
    const [editorContent, setEditorContent] = useState("");
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);

    // get screen height of user
    useEffect(() => {
      const handleResize = () => {
        setScreenHeight(window.innerHeight);
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    // TODO: Implement redis caching w/ postgres so json not lost on refresh
    
    // update editor on any change to data
    useEffect(() => {
        if (jsonData) {

            try {
                // turn updated json state to json string for editor
                const formattedJson = JSON.stringify(jsonData, null, 2);
                setEditorContent(formattedJson);
            } catch (e) {
                console.error("Error stringifying JSON data:", e);
                setEditorContent("{}");
            }
        }
    }, [jsonData]);
    
    const handleEditorChange = (value: any) => {
        // update new val
        setEditorContent(value || "");
        
        if (value) {
            try {
                // update global json state if valid json
                const parsedJson = JSON.parse(value);
                setJsonData(parsedJson);
            } catch (e) {
                // no update to global jsonData if invalid json
                console.warn("Invalid JSON entered, not updating context");
            }
        }
    };
    
    return (
        <div style={{ height: screenHeight }} className="mt-12 justify-center">
            <MonacoEditor
                height="80%"
                width="95%"
                language="json"
                value={editorContent}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                    selectOnLineNumbers: true,
                    scrollBeyondLastLine: false,
                    minimap: { enabled: false },
                    automaticLayout: true,
                }}
            />
        </div>
    );
};

export default Editor;