"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { generateCover } from "@/lib/api";
import { generatePrompt } from "@/lib/prompt";
import { aiProviders } from "@/lib/aiProviders";
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
  // 使用客户端状态跟踪是否已加载客户端数据
  const [clientLoaded, setClientLoaded] = useState(false);

  // 使用函数初始化状态，确保只运行一次
  const [formData, setFormData] = useState<FormData>(() => {
    // 默认值 - 始终使用相同的默认值进行服务器和客户端渲染
    const initialProviderId = "deepseek";
    const initialModelId = "deepseek-chat";
    const savedApiKey = "";

    return {
      title: "",
      content: "",
      account: "",
      slogan: "",
      backgroundUrl: "",
      style: "",
      platform: "xiaohongshu",
      providerId: initialProviderId,
      modelId: initialModelId,
      apiKey: savedApiKey,
    };
  });

  // 在客户端加载完成后加载本地存储的数据
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 尝试从 localStorage 读取上次使用的提供商
      const savedProviderId = localStorage.getItem("last_provider_id");

      if (savedProviderId) {
        const provider = aiProviders.find(p => p.id === savedProviderId);
        if (provider) {
          console.log("Client-side: Using saved provider:", savedProviderId);

          // 尝试读取对应的 API 密钥
          const apiKeyStorageKey = `${savedProviderId}_api_key`;
          const savedApiKey = localStorage.getItem(apiKeyStorageKey) || "";

          setFormData(prevData => ({
            ...prevData,
            providerId: savedProviderId,
            modelId: provider.defaultModel,
            apiKey: savedApiKey
          }));
        }
      }

      setClientLoaded(true);
    }

  }, []);




  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [showPrompt, setShowPrompt] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [showPasteDialog, setShowPasteDialog] = useState(false);

  // 定义一个函数来处理提供商变化
  const handleProviderChange = (newProviderId: string) => {
    // 如果提供商没有变化，则不做任何处理
    if (formData.providerId === newProviderId) {
      return;
    }

    // 找到新的提供商
    const provider = aiProviders.find(p => p.id === newProviderId);
    if (!provider) {
      return;
    }

    // 检查是否在浏览器环境中
    let savedApiKey = "";
    if (typeof window !== 'undefined') {
      // 读取新提供商的 API 密钥
      const storageKey = `${newProviderId}_api_key`;
      savedApiKey = localStorage.getItem(storageKey) || "";

      // 保存到 localStorage
      localStorage.setItem("last_provider_id", newProviderId);
    }

    // 更新状态
    setFormData({
      ...formData,
      providerId: newProviderId,
      modelId: provider.defaultModel,
      apiKey: savedApiKey
    });
  };

  // 保存 API 密钥到 localStorage
  useEffect(() => {
    // 检查是否在浏览器环境中
    if (typeof window !== 'undefined' && formData.apiKey) {
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

      // 在调用 API 前保存当前的提供商和模型
      const currentProviderId = formData.providerId;
      const currentModelId = formData.modelId;
      const currentApiKey = formData.apiKey;

      const response = await generateCover(generatedPrompt, currentApiKey, currentProviderId, currentModelId);
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

        // History functionality removed

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
              onProviderChange={handleProviderChange}
              clientLoaded={clientLoaded}
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
