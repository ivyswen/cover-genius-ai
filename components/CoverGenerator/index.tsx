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
    apiKey: "",
  });


  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [showPasteDialog, setShowPasteDialog] = useState(false);

  // 在组件挂载时从 localStorage 读取 API 密钥
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openrouter_api_key");
    if (savedApiKey) {
      setFormData(prev => ({ ...prev, apiKey: savedApiKey }));
    }
  }, []);

  // 保存 API 密钥到 localStorage
  useEffect(() => {
    if (formData.apiKey) {
      localStorage.setItem("openrouter_api_key", formData.apiKey);
    }
  }, [formData.apiKey]);

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

      const response = await generateCover(generatedPrompt, formData.apiKey);
      console.log("API Response:", response);

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



  const downloadCover = async () => {
    if (!preview) return;
    if (isDownloading) {
      toast.error("正在下载中，请稍候...");
      return;
    }

    setIsDownloading(true);

    try {
      // 使用在新窗口中打开的方式来截图
      // 创建一个完整的HTML文档
      let fullHtml = preview.html;
      console.log("Full HTML:", fullHtml);

      // 如果不是完整的HTML文档，则将其包裹在完整的HTML结构中
      // 但不添加额外的样式修改
      if (!fullHtml.includes('<!DOCTYPE html>') && !fullHtml.includes('<html')) {
        // 提取内嵌的CSS
        let extractedCss = '';
        if (fullHtml.includes('<style>') && fullHtml.includes('</style>')) {
          const styleMatches = fullHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
          if (styleMatches) {
            styleMatches.forEach(styleTag => {
              const styleContent = styleTag.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
              if (styleContent && styleContent[1]) {
                extractedCss += styleContent[1].trim() + '\n';
              }
            });
          }
        }

        // 构建完整的HTML
        fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>封面预览</title>
  ${extractedCss ? `<style>${extractedCss}</style>` : ''}
  <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
</head>
<body>
  ${fullHtml}
  <script>
    // 等待页面加载完成
    window.onload = function() {
      // 等待一些时间确保元素完全渲染
      setTimeout(function() {
        // 先尝试查找 id="cover" 的元素
        let coverElement = document.getElementById('cover');

        // 如果没有找到，则尝试查找 .cover-container 类的元素
        if (!coverElement) {
          coverElement = document.querySelector('.cover-container');
          console.log('尝试查找 .cover-container 元素:', coverElement);
        }

        // 如果仍然没有找到，则尝试查找第一个内容元素
        if (!coverElement) {
          // 尝试查找第一个内容元素
          const bodyElement = document.body;
          if (bodyElement && bodyElement.firstElementChild) {
            coverElement = bodyElement.firstElementChild as HTMLElement;
            console.log('使用第一个内容元素:', coverElement);
          }
        }

        if (!coverElement) {
          console.error('找不到可用的封面元素');
          return;
        }

        console.log('封面元素尺寸:', coverElement.offsetWidth, 'x', coverElement.offsetHeight);

        // 使用元素原始尺寸
        const width = coverElement.offsetWidth || 300;
        const height = coverElement.offsetHeight || 400;

        html2canvas(coverElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
          logging: true,
          allowTaint: true,
          foreignObjectRendering: true,
          width: width,
          height: height
        }).then(function(canvas) {
          // 将画布转换为数据 URL
          const dataUrl = canvas.toDataURL('image/png');

          // 将数据 URL 发送回原始窗口
          window.opener.postMessage({ type: 'DOWNLOAD_COVER', dataUrl: dataUrl }, '*');

          // 不自动关闭窗口，由主窗口控制
        }).catch(function(error) {
          console.error('截图错误:', error);
          window.opener.postMessage({ type: 'DOWNLOAD_ERROR', error: error.message }, '*');
        });
      }, 1000);
    };
  </script>
</body>
</html>`;
      }

      // 打开新窗口
      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        throw new Error('无法打开新窗口，请检查浏览器设置');
      }

      // 写入HTML
      newWindow.document.write(fullHtml);
      newWindow.document.close();

      // 设置消息监听器来接收截图结果
      const messageHandler = (event: MessageEvent) => {
        if (event.data && event.data.type === 'DOWNLOAD_COVER') {
          // 创建下载链接
          const link = document.createElement('a');
          link.download = `cover-${new Date().getTime()}.png`;
          link.href = event.data.dataUrl;
          link.click();

          // 重置下载状态
          setIsDownloading(false);

          // 移除消息监听器
          window.removeEventListener('message', messageHandler);

          // 关闭新窗口
          newWindow.close();

          toast.success('封面下载成功！');
        } else if (event.data && event.data.type === 'DOWNLOAD_ERROR') {
          // 重置下载状态
          setIsDownloading(false);

          toast.error(`下载失败: ${event.data.error || '未知错误'}`);

          // 移除消息监听器
          window.removeEventListener('message', messageHandler);

          // 关闭新窗口
          newWindow.close();
        }
      };

      window.addEventListener('message', messageHandler);

      // 设置超时处理
      setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        if (isDownloading) {
          setIsDownloading(false);
          toast.error('下载超时，请重试');
        }
      }, 15000); // 15秒超时

    } catch (error: unknown) {
      console.error("Download error:", error);
      toast.error(`下载失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setIsDownloading(false);
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
              onDownload={downloadCover}
              isCopying={isCopying}
              isDownloading={isDownloading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
