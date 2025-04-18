"use client";

import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onCopy: () => void;
  onPasteHtml: () => void;
  onOpenInNewWindow?: () => void;
  isCopying: boolean;
  hasPreview?: boolean;
}

export default function ActionButtons({
  onCopy,
  onPasteHtml,
  onOpenInNewWindow,
  isCopying,
  hasPreview = false
}: ActionButtonsProps) {
  return (
    <div className="space-y-3 mt-5">
      <div className="grid grid-cols-3 gap-3">
        <Button
          onClick={onCopy}
          variant="outline"
          disabled={isCopying || !hasPreview}
          aria-label={isCopying ? "正在复制..." : "复制源码"}
          className="flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
          {isCopying ? "正在复制..." : "复制源码"}
        </Button>
        <Button
          onClick={onOpenInNewWindow}
          variant="outline"
          disabled={!hasPreview}
          aria-label="新窗口打开"
          className="flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          新窗口打开
        </Button>
        <Button
          onClick={onPasteHtml}
          variant="outline"
          aria-label="粘贴HTML"
          className="flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          粘贴HTML
        </Button>
      </div>

    </div>
  );
}
