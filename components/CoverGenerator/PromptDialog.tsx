"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface PromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: string;
  onConfirm: () => void;
}

export default function PromptDialog({ open, onOpenChange, prompt, onConfirm }: PromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>确认提示词</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <pre className="whitespace-pre-wrap bg-zinc-100 p-4 rounded-lg text-sm">
            {prompt}
          </pre>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={onConfirm}>确认生成</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
