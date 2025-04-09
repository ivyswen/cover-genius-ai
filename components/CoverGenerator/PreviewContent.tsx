"use client";
import SafePreview from "./SafePreview";

interface PreviewContentProps {
  html: string;
}

export default function PreviewContent({ html }: PreviewContentProps) {
  return <SafePreview html={html} />;
}
