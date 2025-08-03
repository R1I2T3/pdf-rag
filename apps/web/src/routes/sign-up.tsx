import { createFileRoute } from "@tanstack/react-router";
import SignUpForm from "@/components/sign-up-form";
import { ModeToggle } from "@/components/mode-toggle";
export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <SignUpForm />
    </div>
  );
}
