"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { styles } from "@/lib/styles";
import StylePreview from "./StylePreview";

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

interface FormSectionProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
}

export default function FormSection({ formData, setFormData, onSubmit, isGenerating }: FormSectionProps) {
  const selectedStyle = styles.find(s => s.id === formData.style);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label>平台 *</Label>
        <RadioGroup
          value={formData.platform}
          onValueChange={(value: "xiaohongshu" | "wechat") => setFormData({ ...formData, platform: value })}
          className="flex gap-6"
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
        <div className="space-y-2">
          <Label htmlFor="title">公众号标题 *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="请输入公众号标题"
            required
            disabled={isGenerating}
            className="h-10"
          />
        </div>
      )}

      {formData.platform === "xiaohongshu" && (
        <div className="space-y-2">
          <Label htmlFor="content">封面文案 *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="请输入封面文案"
            className="min-h-[120px] resize-y"
            required
            disabled={isGenerating}
          />
        </div>
      )}

      {formData.platform === "xiaohongshu" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="account">账号名称 *</Label>
            <Input
              id="account"
              value={formData.account}
              onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              placeholder="请输入账号名称"
              required
              disabled={isGenerating}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slogan">标语（可选）</Label>
            <Input
              id="slogan"
              value={formData.slogan}
              onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
              placeholder="请输入标语"
              disabled={isGenerating}
              className="h-10"
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="backgroundUrl">{formData.platform === "xiaohongshu" ? "背景图片链接" : "emoji图片链接"}（可选）</Label>
        <Input
          id="backgroundUrl"
          value={formData.backgroundUrl}
          onChange={(e) => setFormData({ ...formData, backgroundUrl: e.target.value })}
          placeholder={formData.platform === "xiaohongshu" ? "请输入背景图片链接" : "请输入emoji图片链接"}
          disabled={isGenerating}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
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
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {styles.map((style) => (
              <SelectItem key={style.id} value={style.id} className="py-1">
                <div className="font-medium">{style.name}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedStyle && (
          <div className="mt-3">
            <StylePreview
              name={selectedStyle.name}
              imageUrl={selectedStyle.previewImage}
              className="border shadow-sm"
            />
          </div>
        )}
        {selectedStyle && (
          <p className="mt-2 text-sm text-muted-foreground border-t pt-2">
            <span className="font-medium">风格描述：</span>{selectedStyle.description}
          </p>
        )}
      </div>

      <div className="space-y-2">
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
            className="h-10"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              localStorage.removeItem("openrouter_api_key");
              setFormData({ ...formData, apiKey: "" });
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
        className="w-full mt-2"
        disabled={isGenerating}
        aria-label={isGenerating ? "正在生成封面..." : "生成封面"}
        size="lg"
      >
        {isGenerating ? "正在生成..." : "生成封面"}
      </Button>
    </form>
  );
}
