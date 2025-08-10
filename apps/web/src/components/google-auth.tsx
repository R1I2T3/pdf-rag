import React from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
const GoogleAuth = () => {
  const signIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${import.meta.env.VITE_CLIENT_URL}/`,
    });
  };
  return (
    <Button className="w-full my-2" onClick={signIn} variant="outline">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="#4285F4"
          d="M22.56 12.06c0-.62-.05-1.22-.16-1.79H12v3.63h6.39c-.29 1.54-1.18 2.82-2.52 3.67v2.81h3.62c2.11-1.95 3.33-4.8 3.33-8.72z"
        />
        <path
          fill="#34A853"
          d="M12 23c3.27 0 6-1.08 8-2.92l-3.62-2.81c-1.02.68-2.31 1.08-4.38 1.08-3.37 0-6.22-2.27-7.24-5.32H.64v2.81A11.96 11.96 0 0 0 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M4.76 14.92c-.3-.88-.47-1.8-.47-2.92s.17-2.04.47-2.92V6.2H.64a11.96 11.96 0 0 0 0 11.6l4.12-2.88z"
        />
        <path
          fill="#EA4335"
          d="M12 4.1c1.8 0 3.35.61 4.59 1.79l3.22-3.22C18.06 1.25 15.27 0 12 0A11.96 11.96 0 0 0 .64 6.2l4.12 2.92C5.78 6.37 8.63 4.1 12 4.1z"
        />
      </svg>
    </Button>
  );
};

export default GoogleAuth;
