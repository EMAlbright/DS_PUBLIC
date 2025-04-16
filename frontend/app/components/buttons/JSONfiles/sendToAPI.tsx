"use client"

import { useAuth } from "@/src/context/AuthContext";
import { useJSON } from "@/src/context/JSONContext"
import axios from "axios";

export const DataToAPIButton = () => {
    const {jsonData, setJsonData} = useJSON();
    const {accessToken, setAccessToken} = useAuth();

    const sendJSON = async() => {

        try{
            const response = await axios.post("http://localhost:8080/api/json_to_api", {"jsonData": JSON.stringify(jsonData)},
                {
                    headers: { 'Authorization': `Bearer ${accessToken}`},
                }
            )
            console.log(response.data);
        }
        catch(e: any){
            console.log("Error Creating EPs: ", e);
        }
    }
    return (
        <div>
            <button onClick={sendJSON}
            className="bg-blue-500 text-white px-9 py-2 mt-8 ml-16 rounded hover:bg-blue-600 transition"
            >
                Create API
            </button>
        </div>
    )
}