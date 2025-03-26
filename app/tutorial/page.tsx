import { Card } from "@/components/ui/card";

export default function TutorialPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">封面设计教程</h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">开始使用</h2>
          <p className="text-muted-foreground mb-4">
            学习如何使用我们的 AI 驱动的生成器创建精美的社交媒体封面。
            本指南将帮助您了解关键组件和最佳实践。
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">平台指南</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">小红书</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>宽高比：3:4</li>
              <li>文字清晰易读</li>
              <li>使用吸引眼球的标题</li>
              <li>包含账号名称以增强品牌认知</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">微信公众号</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>宽高比：3.35:1</li>
              <li>专业整洁的设计</li>
              <li>保持一致的品牌元素</li>
              <li>清晰的文字层次结构</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">设计风格</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">柔和科技卡片风格</h3>
              <p className="text-muted-foreground">
                现代、简洁的设计，搭配柔和渐变和极简字体。
                适合科技相关内容和专业服务。
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">现代商务风格</h3>
              <p className="text-muted-foreground">
                专业的布局，配合强烈的字体和企业元素。
                适合商业和营销内容。
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">极简网格风格</h3>
              <p className="text-muted-foreground">
                使用网格系统的清爽布局，装饰元素极简。
                适合教育和信息类内容。
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">奢华自然风格</h3>
              <p className="text-muted-foreground">
                优雅的设计，配合自然元素和精致字体。
                适合生活方式和奢侈品内容。
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">最佳实践</h2>
          <ul className="space-y-4">
            <li>
              <strong>清晰的层次：</strong>
              <p className="text-muted-foreground">
                使用不同字体大小创建清晰的视觉层次。主标题应该最大，
                其次是副标题和正文。
              </p>
            </li>
            <li>
              <strong>对比度：</strong>
              <p className="text-muted-foreground">
                确保文字与背景之间有良好的对比度，便于阅读。
                使用互补色增加视觉趣味。
              </p>
            </li>
            <li>
              <strong>品牌化：</strong>
              <p className="text-muted-foreground">
                包含您的账号名称，并在所有封面中保持一致的品牌元素。
              </p>
            </li>
            <li>
              <strong>留白：</strong>
              <p className="text-muted-foreground">
                不要让设计过于拥挤。有效利用留白使您的内容更易读、
                更具视觉吸引力。
              </p>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}