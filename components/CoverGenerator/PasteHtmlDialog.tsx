"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface PasteHtmlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (html: string) => void;
}

export default function PasteHtmlDialog({ open, onOpenChange, onApply }: PasteHtmlDialogProps) {
  const [html, setHtml] = useState("");

  const handleApply = () => {
    if (!html.trim()) {
      toast.error("请输入HTML代码");
      return;
    }

    // 清理HTML（如果包含完整的HTML结构）
    let htmlContent = html;

    onApply(htmlContent);
    setHtml("");
    onOpenChange(false);
    toast.success("HTML代码已应用");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>粘贴HTML代码</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="html-code">请粘贴HTML代码</Label>
            <Textarea
              id="html-code"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="<div id='cover'>...</div>"
              className="min-h-[300px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleApply}>应用</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
