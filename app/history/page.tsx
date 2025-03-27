"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

interface HistoryEntry {
  title: string;
  content: string;
  account: string;
  slogan?: string;
  backgroundUrl?: string;
  style: string;
  platform: "xiaohongshu" | "wechat";
  timestamp: string;
  preview: {
    html: string;
    css: string;
  };
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("coverHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleDelete = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem("coverHistory", JSON.stringify(newHistory));
    toast.success("记录已删除");
  };

  const handleDownload = async (entry: HistoryEntry) => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const container = document.getElementById(`preview-${entry.timestamp}`);
      if (!container) return;

      const canvas = await html2canvas(container);
      const link = document.createElement("a");
      link.download = `cover-${format(new Date(entry.timestamp), "yyyy-MM-dd-HH-mm-ss")}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success("封面下载成功！");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("下载封面失败");
    }
  };

  if (history.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">生成历史</h1>
          <Card className="p-6">
            <div className="text-center text-gray-500 py-8">
              即将推出 - 这里将显示你生成的封面历史记录
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">生成历史</h1>
      <div className="grid gap-6">
        {history.map((entry, index) => (
          <Card key={entry.timestamp} className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{entry.title}</h2>
                <p className="text-muted-foreground mb-4">{format(new Date(entry.timestamp), "PPpp")}</p>
                <div className="space-y-2">
                  <p><strong>平台：</strong> {entry.platform === "xiaohongshu" ? "小红书" : "微信公众号"}</p>
                  <p><strong>风格：</strong> {entry.style}</p>
                  <p><strong>账号：</strong> {entry.account}</p>
                  {entry.slogan && <p><strong>标语：</strong> {entry.slogan}</p>}
                </div>
                <div className="mt-4 space-x-2">
                  <Button onClick={() => handleDownload(entry)}>下载</Button>
                  <Button variant="destructive" onClick={() => handleDelete(index)}>删除</Button>
                </div>
              </div>
              <div>
                <div id={`preview-${entry.timestamp}`} className="w-full">
                  <style dangerouslySetInnerHTML={{ __html: entry.preview.css }} />
                  <div dangerouslySetInnerHTML={{ __html: entry.preview.html }} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}