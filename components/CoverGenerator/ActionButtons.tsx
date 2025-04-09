"use client";

import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onCopy: () => void;
  onPasteHtml: () => void;
  onDownload: () => void;
  isCopying: boolean;
  isDownloading: boolean;
  hasPreview?: boolean;
}

export default function ActionButtons({
  onCopy,
  onPasteHtml,
  onDownload,
  isCopying,
  isDownloading,
  hasPreview = false
}: ActionButtonsProps) {
  return (
    <div className="space-y-3 mt-5">
      <div className="grid grid-cols-2 gap-3">
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
          onClick={onPasteHtml}
          variant="outline"
          aria-label="粘贴HTML"
          className="flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          粘贴HTML
        </Button>
      </div>
      <Button
        onClick={onDownload}
        className="w-full flex items-center justify-center gap-2"
        disabled={isDownloading || !hasPreview}
        aria-label={isDownloading ? "正在下载..." : "下载封面"}
        size="lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        {isDownloading ? "正在下载..." : "下载封面"}
      </Button>
    </div>
  );
}
