import { DownloadJSONButton } from "../buttons/JSONfiles/downloadJSON";
import { SaveJSONButton } from "../buttons/JSONfiles/saveJSON";
import { DataToAPIButton } from "../buttons/JSONfiles/sendToAPI";

/**
 * In here we have the 3 buttons (currently right above the editor, below header)
 * 
 *   1 Save JSON   2 Download JSON   3 Create API 
 *   
 * 
 *   1 save the json to your workspace for that project (workspace tbd)
 *      * add somewhere where viewers can view their projects
 *      * one components of this project would be their saved json
 *      * other componetns TBD (API key management (for selling to others))
 *   2 just download the json that was made for them
 *   3 send to create REST apis
 *     TBD on storing the rest apis
 */

export const JSONOptionsContainer = () => {

    return (
        <div className="flex flex-col py-2">
            <SaveJSONButton />
            <DataToAPIButton />
            <DownloadJSONButton />
        </div>
    )
}