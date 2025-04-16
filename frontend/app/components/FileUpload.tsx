"use client"
import axios from "axios";
import { FormEvent, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { useJSON } from "@/src/context/JSONContext";
import { useProject } from "@/src/context/projectContext";

interface jsonData {
    message: string;
    structured_data: any;
    filename: string;
}

export const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [responseData, setResponseData] = useState<jsonData | null>(null);
    const {accessToken, setAccessToken} = useAuth();
    const {project, setProject} = useProject();
    const { jsonData, fileName, setJsonData, setFileName } = useJSON();
    
    const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            setFile(e.target.files[0]);
        }
    }

    const handleUpload = async(e: FormEvent) => {
        e.preventDefault();

        if (!file) {
            setError("Please select a file to upload");
            return;
        }
      
        const form = new FormData();
        form.append("file", file);
        setLoading(true);
        setError('');

        try{
            const response = await axios.post('http://localhost:8080/api/upload', form, {
                headers: {
                    'Content-Type': "multipart/form-data",
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            console.log("Received By Front: ", response.data);
            console.log(typeof response.data.structured_data);
            setResponseData(response.data);
            setFileName(response.data.filename);
            setJsonData(response.data.structured_data);
            setSuccess("File uploaded successfully! Go to editor playground to view json.");
        }
        catch(e: any) {
            console.log(e);
            setError(e.response?.data?.error || "File upload failed. Please try again.");
        }
        finally{
            setLoading(false);
            setTimeout(() => setSuccess(''), 3000);
        }

    }

    return (
    <div>
        <h1 style={{ color: 'white' }}>Upload a file</h1>
        <form onSubmit={handleUpload}>
          <input type="file" onChange={fileChange} />
          <button style={{ color: 'white' }} type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        {error && 
            <p style={{ color: 'red' }}>
                {error}
            </p>
        }

        {success && 
            <p style={{color: 'green', transition: 'opacity 1s ease-out', opacity: success ? 1 : 0 }}>
                {success}
            </p>
        }
    </div>   
    )
}