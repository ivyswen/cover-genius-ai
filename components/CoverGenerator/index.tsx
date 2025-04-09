"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { generateCover } from "@/lib/api";
import { generatePrompt } from "@/lib/prompt";
import FormSection from "./FormSection";
import PreviewSection from "./PreviewSection";
import PromptDialog from "./PromptDialog";
import PasteHtmlDialog from "./PasteHtmlDialog";

interface PreviewData {
  html: string;
}

interface FormData {
  title: string;
  content: string;
  account: string;
  slogan: string;
  backgroundUrl: string;
  style: string;
  platform: "xiaohongshu" | "wechat";
  providerId: string;
  modelId: string;
  apiKey: string;
}

export default function CoverGenerator() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    account: "",
    slogan: "",
    backgroundUrl: "",
    style: "",
    platform: "xiaohongshu",
    providerId: "deepseek",
    modelId: "deepseek-chat",
    apiKey: "",
  });


  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [showPrompt, setShowPrompt] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [showPasteDialog, setShowPasteDialog] = useState(false);

  // 在组件挂载时从 localStorage 读取 API 密钥
  useEffect(() => {
    // 根据当前选择的提供商读取对应的API密钥
    const storageKey = `${formData.providerId}_api_key`;
    const savedApiKey = localStorage.getItem(storageKey);
    if (savedApiKey) {
      setFormData(prev => ({ ...prev, apiKey: savedApiKey }));
    }
  }, [formData.providerId]);

  // 保存 API 密钥到 localStorage
  useEffect(() => {
    if (formData.apiKey) {
      const storageKey = `${formData.providerId}_api_key`;
      localStorage.setItem(storageKey, formData.apiKey);
    }
  }, [formData.apiKey, formData.providerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.apiKey) {
      toast.error("请输入 API 密钥");
      return;
    }

    if (formData.platform === "xiaohongshu") {
      if (!formData.content || !formData.account || !formData.style) {
        toast.error("请填写所有必填字段");
        return;
      }
    } else {
      if (!formData.title || !formData.style) {
        toast.error("请填写所有必填字段");
        return;
      }
    }

    if (isGenerating) {
      toast.error("封面正在生成中，请稍候...");
      return;
    }

    // 生成提示词并显示对话框
    const prompt = generatePrompt(formData);
    setGeneratedPrompt(prompt);
    setShowPrompt(true);
  };

  const handleGenerateCover = async () => {
    setShowPrompt(false);
    // 清空预览窗口
    setPreview(null);
    setIsGenerating(true);

    try {
      const loadingToast = toast.loading("正在生成封面...");
      setIsGenerating(true);

      const response = await generateCover(generatedPrompt, formData.apiKey, formData.providerId, formData.modelId);
      // console.log("API Response:", response);

      try {
        const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;

        if (!parsedResponse || typeof parsedResponse !== 'object') {
          throw new Error("Invalid response format: Response is not an object");
        }

        if (!parsedResponse.html) {
          throw new Error("Invalid response format: Missing HTML content");
        }

        setPreview({
          html: parsedResponse.html
        });

        // Save to history
        const history = JSON.parse(localStorage.getItem("coverHistory") || "[]");
        history.unshift({
          ...formData,
          apiKey: undefined,
          timestamp: new Date().toISOString(),
          preview: { html: parsedResponse.html },
        });
        localStorage.setItem("coverHistory", JSON.stringify(history.slice(0, 10)));

        toast.dismiss(loadingToast);
        toast.success("封面生成成功！");
      } catch (parseError: unknown) {
        console.error("Response parsing error:", parseError);
        console.error("Raw response:", response);
        toast.dismiss(loadingToast);
        toast.error(`解析响应失败: ${parseError instanceof Error ? parseError.message : '未知错误'}`);
        throw parseError;
      }
    } catch (error: unknown) {
      console.error("Generation error:", error);
      toast.error(`生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // 复制源码
  const copySourceCode = async () => {
    if (!preview) return;

    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(preview.html);
      toast.success("HTML代码已复制到剪贴板");
    } catch (error) {
      console.error("复制失败:", error);
      toast.error("复制失败，请重试");
    } finally {
      setIsCopying(false);
    }
  };





  // 处理粘贴HTML
  const handlePasteHtml = (html: string) => {
    setPreview({
      html
    });
  };

  return (
    <>
      <PromptDialog
        open={showPrompt}
        onOpenChange={setShowPrompt}
        prompt={generatedPrompt}
        onConfirm={handleGenerateCover}
      />

      <PasteHtmlDialog
        open={showPasteDialog}
        onOpenChange={setShowPasteDialog}
        onApply={handlePasteHtml}
      />

      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">开始创作</h1>
          <a
            href="https://github.com/ivyswen/cover-genius-ai/blob/main/docs/tutorial.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            查看教程
          </a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="space-y-4 lg:col-span-4">
            <FormSection
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isGenerating={isGenerating}
            />
          </div>

          <div className="lg:col-span-6">
            <PreviewSection
              preview={preview}
              onCopy={copySourceCode}
              onPasteHtml={() => setShowPasteDialog(true)}
              isCopying={isCopying}
              platform={formData.platform}
            />
          </div>
        </div>
      </div>
    </>
  );
}
