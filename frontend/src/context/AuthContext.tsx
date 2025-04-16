"use client"
import axios from "axios";
import React, {createContext, useContext, useState, ReactNode, useEffect} from "react";

interface AuthContextT {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextT | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // TODO: way around having to do it on refresh?

    // refresh access token (short lived for credentials)
    const refreshToken = async() => {
        try {
            // when user signs out (or is not signed out) they dont have access token, dont attempt to call
            const response = await axios.post('http://localhost:8080/api/refresh', null,{
                // send with refresher token to verify
                withCredentials: true,
            });
            setAccessToken(response.data.access_token);
            console.log("New access token: ", response.data.access_token);
        } catch(error: any) {
            console.error("Failed to refresh token: " ,error);
            if (error.response && error.response.status === 401) {
                setAccessToken(null); 
                // also redirect to login page here
            }
        }
    };

    // refresh on page reload
    useEffect(() => {
        refreshToken();
    }, [])

    // auto refresh every 12 minutes (access expires every 15)
    useEffect(() => {
        const interval = setInterval(refreshToken, 12 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextT => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used in AuthProvider');
    }
    return context;
};