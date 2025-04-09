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
  onDownload: () => void;
  isCopying: boolean;
  isDownloading: boolean;
}

export default function PreviewSection({
  preview,
  onCopy,
  onPasteHtml,
  onDownload,
  isCopying,
  isDownloading
}: PreviewSectionProps) {
  const [showPreview, setShowPreview] = useState(true);

  return (
    <Card className="p-5 h-full shadow-sm">
      {preview && (
        <div className="flex justify-end mb-4">
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
        </div>
      )}

      {preview ? (
        <div
          className="w-full bg-white relative border rounded-md shadow-sm"
          style={{
            height: '650px',
            maxHeight: '800px',
            overflow: 'hidden'
          }}
        >
          {showPreview ? (
            <SafePreview html={preview.html} />
          ) : (
            <SourceCodeView html={preview.html} />
          )}
        </div>
      ) : (
        <div
          className="w-full bg-white relative border rounded-md shadow-sm"
          style={{
            height: '650px',
            maxHeight: '800px',
            overflow: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            预览将在此处显示
          </div>
        </div>
      )}

      <div className="mt-4">
        <ActionButtons
          onCopy={onCopy}
          onPasteHtml={onPasteHtml}
          onDownload={onDownload}
          isCopying={isCopying}
          isDownloading={isDownloading}
          hasPreview={!!preview}
        />
      </div>
    </Card>
  );
}
