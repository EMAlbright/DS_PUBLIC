"use client";
import { useAuth } from "@/src/context/AuthContext";
import { useJSON } from "@/src/context/JSONContext";
import { useProject } from "@/src/context/projectContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export const SaveJSONButton = () => {
    const { jsonData, fileName, setJsonData, setFileName } = useJSON();
    const { project } = useProject();
    const { accessToken } = useAuth();
    const [versionName, setVersionName] = useState("");
    const [selectedVersion, setSelectedVersion] = useState("");

    // Fetch existing versions for this file within the project
    const fetchVersions = async () => {
        if (!project?.Id || !fileName) return [];
        try {
            const response = await axios.get(`http://localhost:8080/api/get_versions?project_id=${project.Id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return response.data; 
        } catch (error: any) {
            console.error("Error fetching versions: ", error.response?.data);
            return [];
        }
    };

    const { data: versions = [], isLoading } = useQuery({
        queryKey: ["jsonVersions", project?.Id, fileName],
        queryFn: fetchVersions,
        enabled: !!project?.Id && !!fileName,
    });

    const saveJSON = async () => {
        if (!versionName && !selectedVersion) {
            alert("Please enter a new version name or select an existing version.");
            return;
        }

        const versionToSave = versionName || selectedVersion;
        try {
            const data = {
                jsonData: JSON.stringify(jsonData),
                fileName: fileName,
                projectId: project?.Id,
                versionName: versionToSave,
            };

            console.log("Saving JSON with version:", versionToSave);
            await axios.post("http://localhost:8080/api/add_json", data, {
                headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
            });

            alert(`JSON saved as version: ${versionToSave}`);
        } catch (error: any) {
            console.error("Error saving JSON to DB:", error.response?.data);
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-12 mx-12 bg-gray-800 p-6 rounded-lg text-white w-2/3">
            <h3 className="text-lg font-semibold">Save JSON Version</h3>

            {/* Select Existing Version */}
            <label className="text-sm">Select an existing version:</label>
            <select
                value={selectedVersion}
                onChange={(e) => {
                    setSelectedVersion(e.target.value);
                    setVersionName("");
                }}
                className="bg-gray-700 p-2 rounded text-white"
            >
                <option value="">-- Select a version --</option>
                {isLoading ? (
                    <option>Loading...</option>
                ) : (
                    versions?.map((ver: string, index: number) => (
                        <option key={index} value={ver}>
                            {ver}
                        </option>
                    ))
                )}
            </select>

            {/* Or Enter New Version */}
            <label className="text-sm mt-2">Or enter a new version name:</label>
            <input
                type="text"
                value={versionName}
                onChange={(e) => {
                    setVersionName(e.target.value);
                    setSelectedVersion(""); 
                }}
                placeholder="Enter version name..."
                className="bg-gray-700 p-2 rounded text-white"
            />

            {/* Save Button */}
            <button
                onClick={saveJSON}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
                Save JSON
            </button>
        </div>
    );
};
