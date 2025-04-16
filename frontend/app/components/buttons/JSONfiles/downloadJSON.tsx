"use client"
import { useJSON } from "@/src/context/JSONContext"

export const DownloadJSONButton = () => {
    const {jsonData, fileName, setFileName, setJsonData} = useJSON();

    const downloadJSON = async() => {
        if (!jsonData){
            alert("No JSON data")
            return;
        }

        const blob = new Blob([JSON.stringify(jsonData, null, 2)], {type: "application/json"});
    
        // url temp
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        // later, pass the original filename into this
        a.download = `${fileName}.json`;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    
    }
    return (
        <div>
            <button onClick={downloadJSON}
            className="bg-blue-500 text-white px-4 py-2 mt-8 ml-16 rounded hover:bg-blue-600 transition"
            >
                Download JSON
            </button>
        </div>
    )
}