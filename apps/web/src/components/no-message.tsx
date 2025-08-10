import React from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
const NoMessage = ({
  setInput,
}: {
  setInput: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <FileText className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">No messages yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Upload a file document and start asking questions about its content.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 max-w-md">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInput("What is this document about?")}
          className="text-xs"
        >
          What is this document about?
        </Button>
      </div>
    </div>
  );
};

export default NoMessage;
