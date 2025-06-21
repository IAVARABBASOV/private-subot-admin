import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

interface ConfirmationDialogProps {
  isOpen: boolean;
  question: string;
  onYes: () => void;
  onNo: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  question,
  onYes,
  onNo,
}) => {
  if (!isOpen) return null; // Hide the dialog when not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">{question}</h2>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onNo}>
            No
          </Button>
          <Button onClick={onYes}>
            Yes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmationDialog;
