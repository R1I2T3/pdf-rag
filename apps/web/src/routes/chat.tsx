import LogoutButton from "@/components/logout-button";
import { ModeToggle } from "@/components/mode-toggle";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";
import FileUploadComponent from "@/components/file-upload";
import ChatComponent from "@/components/chat";
import { FileText, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/chat")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (!data?.session) {
      return redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex h-16 items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Knowledge Base</span>
            </div>

            <div className="flex items-center space-x-2 right-5 absolute">
              <LogoutButton />
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - File Upload */}
        <div className="w-80 border-r border-border/40 bg-muted/30 flex flex-col">
          <div className="p-6 border-b border-border/40">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Documents</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a File to start chatting
            </p>
          </div>

          <div className="flex-1 p-6 flex items-center justify-center">
            <FileUploadComponent />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-border/40 bg-background">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Chat with your File</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Ask questions about your file and get instant answers
            </p>
          </div>

          <div className="flex-1">
            <ChatComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
