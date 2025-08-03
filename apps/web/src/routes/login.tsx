import { ModeToggle } from "@/components/mode-toggle";
import LoginForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <LoginForm />
    </div>
  );
}
