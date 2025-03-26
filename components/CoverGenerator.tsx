"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { generateCover } from "@/lib/api";
import { generatePrompt } from "@/lib/prompt";
import { styles } from "@/lib/styles";

interface PreviewData {
  html: string;
  css: string;
}

export default function CoverGenerator() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    account: "",
    slogan: "",
    backgroundUrl: "",
    style: "",
    platform: "xiaohongshu",
    apiKey: "",
  });

  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.apiKey) {
      toast.error("请输入 API 密钥");
      return;
    }

    if (!formData.title || !formData.content || !formData.account || !formData.style) {
      toast.error("请填写所有必填字段");
      return;
    }

    setIsGenerating(true);
    toast.info("正在生成封面...");

    try {
      const prompt = generatePrompt(formData);
      const response = await generateCover(prompt, formData.apiKey);
      
      setPreview(response);
      toast.success("封面生成成功！");
      
      // Save to history
      const history = JSON.parse(localStorage.getItem("coverHistory") || "[]");
      history.unshift({
        ...formData,
        apiKey: undefined,
        timestamp: new Date().toISOString(),
        preview: response,
      });
      localStorage.setItem("coverHistory", JSON.stringify(history.slice(0, 10)));
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("生成封面失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCover = async () => {
    if (!preview) return;

    const element = document.getElementById("cover-preview");
    if (!element) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(element);
      
      const link = document.createElement("a");
      link.download = `cover-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success("封面下载成功！");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("下载封面失败");
    }
  };

  const selectedStyle = styles.find(s => s.id === formData.style);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">封面标题 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="请输入封面标题"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">封面内容 *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="请输入封面内容"
              className="min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="account">账号名称 *</Label>
            <Input
              id="account"
              value={formData.account}
              onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              placeholder="请输入账号名称"
              required
            />
          </div>

          <div>
            <Label htmlFor="slogan">标语（可选）</Label>
            <Input
              id="slogan"
              value={formData.slogan}
              onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
              placeholder="请输入标语"
            />
          </div>

          <div>
            <Label htmlFor="backgroundUrl">背景图片链接（可选）</Label>
            <Input
              id="backgroundUrl"
              value={formData.backgroundUrl}
              onChange={(e) => setFormData({ ...formData, backgroundUrl: e.target.value })}
              placeholder="请输入背景图片链接"
            />
          </div>

          <div>
            <Label>风格 *</Label>
            <Select
              value={formData.style}
              onValueChange={(value) => setFormData({ ...formData, style: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择风格" />
              </SelectTrigger>
              <SelectContent>
                {styles.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedStyle && (
              <p className="mt-2 text-sm text-muted-foreground">
                {selectedStyle.description}
              </p>
            )}
          </div>

          <div>
            <Label>平台 *</Label>
            <RadioGroup
              value={formData.platform}
              onValueChange={(value: "xiaohongshu" | "wechat") => setFormData({ ...formData, platform: value })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="xiaohongshu" id="xiaohongshu" />
                <Label htmlFor="xiaohongshu">小红书</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wechat" id="wechat" />
                <Label htmlFor="wechat">微信公众号</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="apiKey">OpenRouter API 密钥 *</Label>
            <Input
              id="apiKey"
              type="password"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              placeholder="请输入 API 密钥"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isGenerating}>
            {isGenerating ? "正在生成..." : "生成封面"}
          </Button>
        </form>
      </div>

      <div>
        <Card className="p-4 h-full">
          <div id="cover-preview" className="w-full h-full flex items-center justify-center">
            {preview ? (
              <div className="w-full">
                <style dangerouslySetInnerHTML={{ __html: preview.css }} />
                <div dangerouslySetInnerHTML={{ __html: preview.html }} />
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                预览将在此处显示
              </div>
            )}
          </div>
          {preview && (
            <Button onClick={downloadCover} className="mt-4 w-full">
              下载封面
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}