"use client";

import { useAuth } from "@/src/context/AuthContext";
import axios from "axios";
import { useState } from "react";

export const CreateProjectButton = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const {accessToken, setAccessToken} = useAuth();
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Project name is required");
      return;
    }

    const projectData = {
      projectName: name,
      projectDescription: description || null,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/add_project", JSON.stringify(projectData), {
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${accessToken}`},
      });

      console.log("Project created:", response);
      alert("Project created successfully!");

      // Clear form after submission
      setName("");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("Error creating project");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
       <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
         <h2 className="text-xl font-bold text-white">Create a New Project</h2>

         <input
           type="text"
           value={name}
           onChange={(e) => setName(e.target.value)}
           placeholder="Project Name"
           className="p-2 rounded bg-gray-700 text-white border border-gray-600"
           required
         />

         <textarea
           value={description}
           onChange={(e) => setDescription(e.target.value)}
           placeholder="Project Description (Optional)"
           className="p-2 rounded bg-gray-700 text-white border border-gray-600"
         />

         <button 
           type="submit" 
           className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
         >
           Create Project
         </button>
       </form>
     </div>
  );
};
