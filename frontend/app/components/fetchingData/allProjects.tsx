"use client"
import { useAuth } from "@/src/context/AuthContext";
import { useProject } from "@/src/context/projectContext";
import axios from "axios";    
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Project = {
    Id: number
    Name: string
    Description: string
    Created_at: string
}

export const AllProjects = () => {
    // when user clicks a project take them to their project page and set the project in context
    const {project, setProject} = useProject();
    const [projects, setProjects] = useState<Project[]>([]);
    const {accessToken, setAccessToken} = useAuth();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // get all projects when page mounts
    useEffect(() => {
        const getAllProjects = async() => {
            // fix error where fetches before hetting access token
            if (!accessToken){
                setLoading(true); 
                return;
            }
            try{
                const response = await axios.get("http://localhost:8080/api/get_all_projects", {
                    headers: { 'Authorization': `Bearer ${accessToken}`},
                })
                setProjects(response.data);
                setLoading(false);

            }

            catch(err: any){
                console.log(err); 
            }
        }
        getAllProjects();
        // TODO: this is what i do in json context also
        // depdency array is access token, so will re fetch when value chanfes
        // on page refresh OR every 12 minutes
        // have to have it because access token gets called after thse (on refresh) so need to wait
        // maybe figure out another way to do this
    }, [accessToken]);

    // click a project, go to p page
    const toProjectPage = (project: Project) => {
        setProject(project);
        const projectSlug = `${project.Name.replace(/\s+/g, "-")}`;
        router.push(`/projects/${projectSlug}`)
    }

    if(loading){
        return (<div>Loading...</div>)
    }

    return (
        <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-4">Projects</h2>
        {projects && projects.length > 0 ? (
            <div className="space-y-4">
                {projects.map((project) => (
                    <button
                        onClick={() => toProjectPage(project)}
                        key={project.Id} 
                        className="bg-gray-700 p-4 text-white w-1/3 text-left transition-all hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 block"
                    >
                        <p className="text-xl">{project.Name}</p>
                        <p className="text-md">{project.Description || 'No description'}</p>
                        <p className="text-sm">{project.Created_at}</p>
                    </button>
                ))}
            </div>
        ) : (
            <p className="text-gray-400">No projects found.</p>
        )}
    </div>
    );
}