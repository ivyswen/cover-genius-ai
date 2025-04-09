"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SafePreview from "./SafePreview";

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  html: string;
}

export default function PreviewDialog({ open, onOpenChange, html }: PreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>封面预览</DialogTitle>
        </DialogHeader>

        <SafePreview html={html} />
      </DialogContent>
    </Dialog>
  );
}
