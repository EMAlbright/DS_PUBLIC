"use client"
import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface JSONContextT { 
    fileName: string | null;
    jsonData: string | null;
    setJsonData: (data: string | null) => void;
    setFileName: (data: string | null) => void;
}

const JSONContext = createContext<JSONContextT | undefined>(undefined);

export const JSONProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [jsonData, setJsonData] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const {accessToken, setAccessToken} = useAuth();

    useEffect(() => {
        if (!jsonData || !fileName){
            return;
        }
        // save 10 sec after inactivity
        const timeout = setTimeout(() => {
            saveToRedis(jsonData, fileName);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [jsonData]);

    // TODO: Send filename along with json data
    const saveToRedis = async(jsonData: string, fileName: string) => {
        try{

            const response = await axios.post("http://localhost:8080/api/post_redis_json_cache", 
            {"jsonData": JSON.stringify(jsonData), "fileName": fileName}, 
            {
                headers: { 
                    'Authorization': `Bearer ${accessToken}`
                },
            });
        console.log("Response from posting to redis cache: ", response);
        }
        catch(error: any){
            console.log("error sending json data to redis cache: ", error);
        }
    }

    // on page refresh we fetch the cached json
    useEffect(() => {
        const getCached = async() => {
            if (!accessToken) {
                console.log("Access token is not yet available, delaying Redis cache fetch...");
                return;
            }

            try{
                console.log("Access token when fetching redis cache: ", accessToken)
                const response = await axios.get("http://localhost:8080/api/get_redis_json_cache", 
                {
                    headers: { 'Authorization': `Bearer ${accessToken}`},
                });
            console.log("response from fetching redis cache: ", response);
            if(response.data.jsonData && response.data.fileName){
                const parsedData = typeof response.data.jsonData === "string" 
                ? JSON.parse(response.data.jsonData) 
                : response.data.jsonData;

                setJsonData(parsedData);
                setFileName(response.data.fileName)
            }
            }
            catch(error: any){
                console.log("error sending json data to redis cache: ", error);
            }
        }
        getCached();
    }, [accessToken]);
    

    return (
        <JSONContext.Provider value={{fileName, setFileName, jsonData, setJsonData}}>
            {children}
        </JSONContext.Provider>
    );

};

export const useJSON = (): JSONContextT => {
    const context = useContext(JSONContext);
    if (!context) {
        throw new Error('useJSON must be used in JSONProvider');
    }
    return context;
};