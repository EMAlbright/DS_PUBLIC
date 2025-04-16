"use client"
import { useAuth } from "@/src/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LogoutButton = () => {
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const auth = useAuth();

    const signout = async() => {
        try{
            const response = await axios.post("http://localhost:8080/api/logout", {}, {
                withCredentials: true,
            });

            if (response.status == 200){
                auth.setAccessToken(null);
                setMessage(response.data.message);
                router.push("/");
            }
        }
        catch(error: any){
            console.error("Error signing out: ", error);
        }
    }

    return (
        <div>
            { message && <p style={{color: "green"}}> {message}</p>}
            {error && <p style={{color: "red"}}> {error} </p>}
        <button 
          onClick={signout}
          className="text-lg transition-all duration-200">
          Signout
        </button>
        </div>
      );
}