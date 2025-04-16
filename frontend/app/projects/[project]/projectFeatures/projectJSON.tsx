"use client"

import { useAuth } from "@/src/context/AuthContext";
import { useJSON } from "@/src/context/JSONContext";
import { useProject } from "@/src/context/projectContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProjectJSON = {
    Id: number
    Version_name: string
	File_name: string
	JsonData: any
	Created_at: string
}

export const ProjectJSON = () => {
    const {project, setProject} = useProject();
    const {jsonData, fileName, setFileName, setJsonData} = useJSON();
    const {accessToken, setAccessToken} = useAuth();
    const router = useRouter();

    const fetchProjectJSONData = async() => {
        if(!project?.Id){
            return [];
        }
        try{
            const response = await axios.get(`http://localhost:8080/api/get_project_json?project_id=${project.Id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}`},
            });
            console.log(`JSON for project ${project.Id}: `, response.data);
            return response.data || [];
        }
        catch(e: any){
            console.log("Error fetching json data from project: ", e);
        }
    }
    const {data: projectJSON, error, isLoading} = useQuery({
        queryKey: ['projectJSON', project?.Id], 
        queryFn: fetchProjectJSONData,
        // only run if project id is available
        enabled: !!project?.Id,
        // time until data becomes 'stale', refetches
        staleTime: 300000,
        // re fetch when component mounts
        refetchOnMount: true,
    })

    const clickVersion = (cProject: ProjectJSON) => {
        setJsonData(cProject.JsonData)
        setFileName(cProject.File_name)
        router.push(`/projects/${cProject.Version_name}/editorPlayground`)
    }
    return (
        <div className="mt-10 p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">Project JSON Versions</h2>

            {isLoading && <p className="text-gray-400">Loading JSON data...</p>}
            {error && <p className="text-red-500">Error fetching data.</p>}

            <div className="space-y-4">
                {projectJSON && projectJSON.length > 0 ? (
                    projectJSON.map((project: ProjectJSON, index: number) => (
                        <div 
                            key={index} 
                            className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700"
                        >
                            <p className="text-sm text-gray-400">Created: {new Date(project.Created_at).toLocaleString()}</p>
                            <button onClick={() => clickVersion(project)}>
                                <p className="text-lg text-blue-400 font-medium">{project.Version_name}</p>
                            </button>
                            <p className="text-white">{project.File_name}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No JSON data available for this project.</p>
                )}
            </div>
        </div>
    )


}