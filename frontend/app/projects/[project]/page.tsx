import { EditorButton } from "@/app/components/buttons/editorbutton";
import { ProjectJSON } from "./projectFeatures/projectJSON";
import { FileUpload } from "@/app/components/FileUpload";

export default function ProjectPage() {

    return (
        <div className="bg-gray-900 min-h-screen p-6 mt-20">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Project Dashboard</h1>
          <EditorButton />
        </header>
  
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Upload Files</h2>
            <FileUpload />
          </div>
  
          <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-auto">
            <ProjectJSON />
          </div>
        </div>
      </div>
    )
}