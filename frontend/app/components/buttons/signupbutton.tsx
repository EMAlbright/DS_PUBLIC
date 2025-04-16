"use client"
import { useRouter } from "next/navigation";

export const SignUpButton = () => {
    const router = useRouter();

    const toSignUp = () => {
        router.push('/auth/signup');
    }

    return (
        <button 
          onClick={toSignUp}
          className="text-lg transition-all duration-200" 
        >
          Sign Up
        </button>
      );
}