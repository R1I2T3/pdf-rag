import { createFileRoute } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";
import ResetPasswordForm from "@/components/reset-password-form";
export const Route = createFileRoute("/reset-password")({
  component: RouteComponent,
  validateSearch: (search: Record<string, string>) => {
    return {
      token: search.token || "",
    };
  },
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <ResetPasswordForm />
    </div>
  );
}
