import { useRouter } from "next/navigation"

export const ProjectPageButton = () => {
    const router = useRouter();

    const toProjects = () => {
        router.push("/projects")
    }

    return (
        <div className="text-white-400 text-md">
            <button onClick={toProjects}>
                Projects
            </button>
        </div>
    )
}