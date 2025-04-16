"use client"
import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";

interface User {
    email: string
    username: string
    password: string
}

const Signup = () => {
    const [error, setError] = useState(null);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('')
    const [message, setMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const router = useRouter();

    const signup = async() => {
        try{
            const userData: User = {email: email, username: username, password: password};
            const response = await axios.post("http://localhost:8080/api/signup", userData, {
                headers: {'Content-Type': 'application/json'},
            })

            if (response.status == 200) {
                setMessage("Signup Successful");
                setError(null);
                router.push("/login");
            }
        }
        catch(e: any){
            setError(e.response?.data?.error || "Signup Failed");
        } 
    }



    return (
            <div className="flex flex-col pt-20 justify-center items-center">     
            <h1 className="text-2xl font-bold mb-12">Sign Up Page</h1>                
            { message && <p style={{color: "green"}}> {message}</p>}
            {error && <p style={{color: "red"}}> {error} </p>}
            <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            />
            <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            />
            <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            />
            <span onClick={togglePasswordVisibility} style={{cursor: 'pointer'}}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
            <button onClick={signup}>Sign Up</button>
        </div>
    )
}

export default Signup;