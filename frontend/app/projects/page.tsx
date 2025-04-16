/**
 * show projects, click on project see json files, APIs, api management, analytics, usage
 */
import { CreateProjectButton } from "../components/buttons/Project/createProjectButton";
import { AllProjects } from "../components/fetchingData/allProjects";

const ProjectsHome = () => {
    return(
        <div className="p-6 pt-28 bg-gray-900 min-h-screen">
            <div className="flex space-x-6">
                <div className="w-1/3">
                    <CreateProjectButton />
                </div>
                <div className="w-2/3">
                    <AllProjects />
                </div>
            </div>
        </div>
    )
}

export default ProjectsHome;