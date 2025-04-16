"use client"
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

const Login = () => {
    const [error, setError] = useState(null);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const auth = useAuth();
    
    const router = useRouter();
    
    const login = async() => {

        try{
            const response = await axios.post("http://localhost:8080/api/login", {
                username,
                password,
            }, {
                withCredentials: true
            });

            if (response.status == 200) {
                console.log(response.data);
                auth.setAccessToken(response.data.access_token)
                setMessage("Login Successful");
                setError(null);
                router.push("/");
            }
        }
        catch(e: any){
            setError(e.response?.data?.error || "File upload failed. Please try again.");
        } 
    }



    return (
            <div className="flex flex-col pt-20 justify-center items-center">  
            <h1 className="text-2xl font-bold mb-12">Login Page</h1> 
            { message && <p style={{color: "green"}}> {message}</p>}
            {error && <p style={{color: "red"}}> {error} </p>}
            <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            />

            <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={login}>Login</button>
        </div>
    )
}

export default Login;