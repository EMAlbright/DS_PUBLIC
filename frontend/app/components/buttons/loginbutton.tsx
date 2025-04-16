"use client"
import { useRouter } from "next/navigation";

export const LoginButton = () => {
    const router = useRouter();

    const toLogin = () => {
        router.push('/auth/login');
    }

    return (
        <button 
          onClick={toLogin}
          className="text-lg transition-all duration-200" 
        >
          Login
        </button>
      );
}