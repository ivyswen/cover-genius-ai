import { Card } from "@/components/ui/card";

export default function TutorialPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">使用教程</h1>
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">基本使用步骤</h2>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                <strong>选择平台</strong>
                <p className="text-gray-600 mt-1">
                  选择你需要生成的封面类型：小红书或微信公众号。每个平台都有其特定的尺寸和样式要求。
                </p>
              </li>
              <li>
                <strong>输入内容</strong>
                <p className="text-gray-600 mt-1">
                  填写封面标题、文案内容、账号名称等信息。这些内容将作为生成封面的核心元素。
                </p>
              </li>
              <li>
                <strong>选择风格</strong>
                <p className="text-gray-600 mt-1">
                  从预设的风格中选择一个，每种风格都有其独特的设计特点和视觉效果。
                </p>
              </li>
              <li>
                <strong>生成预览</strong>
                <p className="text-gray-600 mt-1">
                  点击生成按钮，AI 将根据你的输入创建封面。你可以实时预览效果。
                </p>
              </li>
              <li>
                <strong>下载使用</strong>
                <p className="text-gray-600 mt-1">
                  对生成的效果满意后，可以直接下载图片或复制代码。
                </p>
              </li>
            </ol>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">风格说明</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">柔和科技卡片风</h3>
                <p className="text-gray-600">现代简约的设计风格，适合科技、数码类内容。</p>
              </div>
              <div>
                <h3 className="font-medium">现代商务资讯卡片风</h3>
                <p className="text-gray-600">专业大气的设计风格，适合商业、财经类内容。</p>
              </div>
              <div>
                <h3 className="font-medium">更多风格</h3>
                <p className="text-gray-600">我们会持续增加更多风格选项，敬请期待！</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">常见问题</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">为什么我的封面生成失败？</h3>
                <p className="text-gray-600">
                  请检查你的网络连接和 API Key 是否正确。如果问题持续，请刷新页面重试。
                </p>
              </div>
              <div>
                <h3 className="font-medium">如何获得最好的生成效果？</h3>
                <p className="text-gray-600">
                  建议输入简洁明了的标题和文案，并选择与内容主题相符的风格。
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}