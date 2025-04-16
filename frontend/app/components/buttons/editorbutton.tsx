"use client"
import { useParams, useRouter } from "next/navigation";

export const EditorButton = () => {
    const router = useRouter();
    const params = useParams();
    const projectName = params.project as string;
    const toEditor = () =>{
        router.push(`/projects/${projectName}/editorPlayground`)
    }

    return (
        <div>
            <button className="bg-white text-gray-800 px-6 py-3 rounded-lg text-lg" onClick={toEditor}>
                Editor Playground
            </button>
        </div>
    )
}