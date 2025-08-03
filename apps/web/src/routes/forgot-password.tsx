import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { ModeToggle } from "@/components/mode-toggle";
export const Route = createFileRoute("/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
