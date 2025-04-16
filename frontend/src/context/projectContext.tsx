"use client"

import { ReactNode, createContext, useContext, useState } from "react"

type Project = {
    Id: number
    Name: string
    Description: string
    Created_at: string
}
interface ProjectContextT {
    project: Project | null
    setProject: (project: Project | null) => void;
}

const ProjectContext = createContext<ProjectContextT | undefined>(undefined);

export const ProjectProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [project, setProject] = useState<Project | null>(null);
    return (
        <ProjectContext.Provider value={{ project, setProject}}>
            {children}
        </ProjectContext.Provider>
    );
}
// somewhere in here when we do setproject we should fetch everythign related to the project
// json data, APIs, management, etc...

// TODO:: Cache in redis
export const useProject = (): ProjectContextT => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useAuth must be used in AuthProvider');
    }
    return context;
};