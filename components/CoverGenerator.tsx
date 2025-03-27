"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { generateCover } from "@/lib/api";
import { generatePrompt } from "@/lib/prompt";
import { styles } from "@/lib/styles";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

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
    platform: "xiaohongshu" as "xiaohongshu" | "wechat",
    apiKey: "",
  });

  const [showSource, setShowSource] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

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

        const cssContent = parsedResponse.css || `
          .cover-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: system-ui, -apple-system, sans-serif;
          }
        `;
        
        setPreview({
          html: parsedResponse.html,
          css: cssContent
        });
        
        // Save to history
        const history = JSON.parse(localStorage.getItem("coverHistory") || "[]");
        history.unshift({
          ...formData,
          apiKey: undefined,
          timestamp: new Date().toISOString(),
          preview: { html: parsedResponse.html, css: cssContent },
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

  const downloadCover = async () => {
    if (!preview) return;
    if (isDownloading) {
      toast.error("正在下载中，请稍候...");
      return;
    }

    const element = document.getElementById("cover-preview");
    if (!element) {
      toast.error("预览内容不存在");
      return;
    }

    setIsDownloading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      await toast.promise(
        (async () => {
          // 等待一小段时间确保内容完全渲染
          await new Promise(resolve => setTimeout(resolve, 500));

          // 获取实际内容的尺寸
          const contentElement = element.querySelector('div > div:last-child');
          if (!contentElement) {
            throw new Error("无法找到内容元素");
          }

          const rect = contentElement.getBoundingClientRect();
          const canvas = await html2canvas(element, {
            width: rect.width || element.offsetWidth,
            height: rect.height || element.offsetHeight,
            scale: 2, // 提高图片质量
            useCORS: true, // 允许加载跨域图片
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: rect.width || element.offsetWidth,
            windowHeight: rect.height || element.offsetHeight,
            x: 0,
            y: 0,
            onclone: (clonedDoc) => {
              const clonedElement = clonedDoc.getElementById('cover-preview');
              if (clonedElement) {
                // 设置克隆元素的样式
                clonedElement.style.width = `${rect.width}px`;
                clonedElement.style.height = `${rect.height}px`;
                clonedElement.style.position = 'relative';
                clonedElement.style.transform = 'none';
                clonedElement.style.overflow = 'visible';
                
                // 确保内容容器样式正确
                const contentContainer = clonedElement.querySelector('div > div:last-child') as HTMLElement;
                if (contentContainer) {
                  contentContainer.style.transform = 'none';
                  contentContainer.style.width = '100%';
                  contentContainer.style.height = '100%';
                }
              }
            }
          });
          
          // 使用更高质量的PNG格式
          const link = document.createElement("a");
          link.download = `cover-${new Date().getTime()}.png`;
          link.href = canvas.toDataURL('image/png', 1.0);
          link.click();
        })(),
        {
          loading: "正在准备下载...",
          success: "封面下载成功！",
          error: "下载失败，请重试",
        }
      );
    } catch (error: unknown) {
      console.error("Download error:", error);
      toast.error(`下载失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const selectedStyle = styles.find(s => s.id === formData.style);

  return (
    <>
      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>确认提示词</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <pre className="whitespace-pre-wrap bg-zinc-100 p-4 rounded-lg text-sm">
              {generatedPrompt}
            </pre>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowPrompt(false)}>取消</Button>
            <Button onClick={handleGenerateCover}>确认生成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>平台 *</Label>
                <RadioGroup
                  value={formData.platform}
                  onValueChange={(value: "xiaohongshu" | "wechat") => setFormData({ ...formData, platform: value })}
                  className="flex gap-4"
                  disabled={isGenerating}
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

              {formData.platform === "wechat" && (
                <div>
                  <Label htmlFor="title">公众号标题 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="请输入公众号标题"
                    required
                    disabled={isGenerating}
                  />
                </div>
              )}

              {formData.platform === "xiaohongshu" && (
                <div>
                  <Label htmlFor="content">封面文案 *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="请输入封面文案"
                    className="min-h-[100px]"
                    required
                    disabled={isGenerating}
                  />
                </div>
              )}

              {formData.platform === "xiaohongshu" && (
                <>
                  <div>
                    <Label htmlFor="account">账号名称 *</Label>
                    <Input
                      id="account"
                      value={formData.account}
                      onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                      placeholder="请输入账号名称"
                      required
                      disabled={isGenerating}
                    />
                  </div>

                  <div>
                    <Label htmlFor="slogan">标语（可选）</Label>
                    <Input
                      id="slogan"
                      value={formData.slogan}
                      onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                      placeholder="请输入标语"
                      disabled={isGenerating}
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="backgroundUrl">{formData.platform === "xiaohongshu" ? "背景图片链接" : "emoji图片链接"}（可选）</Label>
                <Input
                  id="backgroundUrl"
                  value={formData.backgroundUrl}
                  onChange={(e) => setFormData({ ...formData, backgroundUrl: e.target.value })}
                  placeholder={formData.platform === "xiaohongshu" ? "请输入背景图片链接" : "请输入emoji图片链接"}
                  disabled={isGenerating}
                />
              </div>

              <div>
                <Label>风格 *</Label>
                <Select
                  value={formData.style}
                  onValueChange={(value) => setFormData({ ...formData, style: value })}
                  required
                  disabled={isGenerating}
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
                <Label htmlFor="apiKey">API 密钥 *</Label>
                <div className="flex gap-2">
                  <Input
                    id="apiKey"
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="请输入 API 密钥"
                    required
                    disabled={isGenerating}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      localStorage.removeItem("openrouter_api_key");
                      setFormData(prev => ({ ...prev, apiKey: "" }));
                      toast.success("API 密钥已清除");
                    }}
                    disabled={isGenerating || !formData.apiKey}
                  >
                    清除
                  </Button>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  API 密钥已保存在浏览器中，刷新页面后会自动填充
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isGenerating}
                aria-label={isGenerating ? "正在生成封面..." : "生成封面"}
              >
                {isGenerating ? "正在生成..." : "生成封面"}
              </Button>
            </form>
          </div>

          <div>
            <Card className="p-4">
              {preview && (
                <div className="flex justify-end mb-4">
                  <div className="inline-flex rounded-lg bg-zinc-900 p-0.5">
                    <button
                      className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                        !showSource 
                          ? 'bg-white text-zinc-900' 
                          : 'text-white hover:bg-zinc-800'
                      }`}
                      onClick={() => setShowSource(false)}
                    >
                      预览
                    </button>
                    <button
                      className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                        showSource 
                          ? 'bg-white text-zinc-900' 
                          : 'text-white hover:bg-zinc-800'
                      }`}
                      onClick={() => setShowSource(true)}
                    >
                      源码
                    </button>
                  </div>
                </div>
              )}

              {showSource && preview ? (
                <div className="w-full">
                  <Tabs defaultValue="html" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="html">HTML</TabsTrigger>
                      <TabsTrigger value="css">CSS</TabsTrigger>
                    </TabsList>
                    <TabsContent value="html">
                      <div className="relative">
                        <SyntaxHighlighter
                          language="html"
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            borderRadius: '0.5rem',
                            minHeight: '600px'
                          }}
                        >
                          {preview.html}
                        </SyntaxHighlighter>
                      </div>
                    </TabsContent>
                    <TabsContent value="css">
                      <div className="relative">
                        <SyntaxHighlighter
                          language="css"
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            borderRadius: '0.5rem',
                            minHeight: '600px'
                          }}
                        >
                          {preview.css}
                        </SyntaxHighlighter>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div 
                  id="cover-preview" 
                  className="w-full bg-white relative"
                  style={{ 
                    minHeight: '600px',
                    maxHeight: '800px',
                    overflow: 'auto'
                  }}
                >
                  {preview ? (
                    <div className="w-full">
                      <style dangerouslySetInnerHTML={{ __html: preview.css }} />
                      <div 
                        dangerouslySetInnerHTML={{ __html: preview.html }}
                        className="preview-content"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      预览将在此处显示
                    </div>
                  )}
                </div>
              )}
              
              {preview && !showSource && (
                <Button 
                  onClick={downloadCover} 
                  className="mt-4 w-full"
                  disabled={isDownloading}
                  aria-label={isDownloading ? "正在下载..." : "下载封面"}
                >
                  {isDownloading ? "正在下载..." : "下载封面"}
                </Button>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}