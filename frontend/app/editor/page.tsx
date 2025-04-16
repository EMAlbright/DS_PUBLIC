import { SaveJSONButton } from "../components/buttons/JSONfiles/saveJSON";
import { JSONOptionsContainer } from "../components/jsonOptions/container";
import Editor from "../components/monaco/editor";

const EditorHome = () => {
    return (
        <div className="flex flex-row mt-20 bg-gray-900 min-h-screen">
            <div className="w-1/6 min-w-[250px]">
                <JSONOptionsContainer />
            </div>
            <div className="flex-1">
                <Editor />
            </div>
        </div>
    );
};

export default EditorHome;
