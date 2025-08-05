import { authClient } from "@/lib/auth-client";
import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await authClient.signOut();
    navigate({ to: "/" });
  };
  return (
    <div>
      <Button onClick={handleLogout}>
        <LogOut />
      </Button>
    </div>
  );
};

export default LogoutButton;
