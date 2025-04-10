"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

import SourceCodeView from "./SourceCodeView";
import ActionButtons from "./ActionButtons";
import SafePreview from "./SafePreview";

interface PreviewData {
  html: string;
}

interface PreviewSectionProps {
  preview: PreviewData | null;
  onCopy: () => void;
  onPasteHtml: () => void;
  isCopying: boolean;
  platform: "xiaohongshu" | "wechat";
}

export default function PreviewSection({
  preview,
  onCopy,
  onPasteHtml,
  isCopying,
  platform
}: PreviewSectionProps) {
  // 在新窗口打开预览
  const openInNewWindow = () => {
    if (!preview) return;

    // 创建一个新窗口
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      alert('无法打开新窗口，请检查您的浏览器是否阻止了弹出窗口');
      return;
    }

    // 写入HTML内容
    // @ts-ignore - document.write 在新窗口中使用是可以接受的
    newWindow.document.write(preview.html);
    newWindow.document.close();
  };
  const [showPreview, setShowPreview] = useState(true);

  return (
    <Card className="p-5 h-full shadow-sm relative flex flex-col">
      <div className="flex justify-end mb-4">
        {preview && (
          <div className="inline-flex rounded-lg bg-zinc-900 p-0.5 shadow-md">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors mx-0.5 ${
                !showPreview
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-white hover:bg-zinc-800'
              }`}
              onClick={() => setShowPreview(false)}
            >
              源码
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors mx-0.5 ${
                showPreview
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-white hover:bg-zinc-800'
              }`}
              onClick={() => setShowPreview(true)}
            >
              预览
            </button>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-hidden mb-4">
        {preview ? (
          <div
            className="w-full h-full bg-white relative border rounded-md shadow-sm"
            style={{
              minHeight: '700px',
              overflow: 'hidden'
            }}
          >
            {typeof window !== 'undefined' && (
              showPreview ? (
                <SafePreview html={preview.html} platform={platform} />
              ) : (
                <SourceCodeView html={preview.html} />
              )
            )}
          </div>
        ) : (
          <div
            className="w-full h-full bg-white relative border rounded-md shadow-sm flex items-center justify-center"
            style={{
              minHeight: '700px'
            }}
          >
            <div className="text-muted-foreground">
              预览将在此处显示
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto">
        <ActionButtons
          onCopy={onCopy}
          onPasteHtml={onPasteHtml}
          onOpenInNewWindow={openInNewWindow}
          isCopying={isCopying}
          hasPreview={!!preview}
        />
      </div>
    </Card>
  );
}
