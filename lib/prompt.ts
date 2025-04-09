import { styles } from "./styles";

interface PromptInput {
  title: string;
  content: string;
  account: string;
  slogan?: string;
  backgroundUrl?: string;
  style: string;
  platform: "xiaohongshu" | "wechat";
}

export function generatePrompt(input: PromptInput): string {
  const selectedStyle = styles.find(s => s.id === input.style);
  if (!selectedStyle) {
    throw new Error("Invalid style selected");
  }

  const rolePrompt = `你是一位优秀的网页和营销视觉设计师，具有丰富的UI/UX设计经验，曾为众多知名品牌打造过引人注目的营销视觉，擅长将现代设计趋势与实用营销策略完美融合。
请使用HTML和CSS代码生成一个${input.platform === "xiaohongshu" ? "小红书封面" : "微信公众号封面图片组合布局"}。`;

  const basePrompt = input.platform === "xiaohongshu"
    ? `
## 基本要求
**尺寸与基础结构**
- 比例严格为3:4（宽:高）
- 设计一个边框为0的div作为画布，确保生成图片无边界
- 最外面的卡片需要为直角
- 将我提供的文案提炼为30-40字以内的中文精华内容
- 文字必须成为视觉主体，占据页面至少70%的空间
- 运用3-4种不同字号创造层次感，关键词使用最大字号
- 主标题字号需要比副标题和介绍大三倍以上
- 主标题提取2-3个关键词，使用特殊处理（如描边、高亮、不同颜色）

**技术实现**
- 使用现代CSS技术（如flex/grid布局、变量、渐变）
- 确保代码简洁高效，无冗余元素
- 使用Google Fonts或其他CDN加载适合的现代字体
- 可引用在线图标资源（如Font Awesome）

**专业排版技巧**
- 运用设计师常用的"反白空间"技巧创造焦点
- 文字与装饰元素间保持和谐的比例关系
- 确保视觉流向清晰，引导读者目光移动
- 使用微妙的阴影或光效增加层次感`
    : `
## 基本要求
**尺寸与比例**
- 整体比例严格保持为3.35:1
- 容器高度应随宽度变化自动调整，始终保持比例
- 左边区域放置2.35:1比例的主封面图
- 右边区域放置1:1比例的朋友圈分享封面

**布局结构**
- 朋友圈封面只需四个大字铺满整个区域（上面两个下面两个）
- 文字必须成为主封面图的视觉主体，占据页面至少70%的空间
- 两个封面共享相同的背景色和点缀装饰元素
- 最外层卡片需要是直角

**技术实现**
- 使用纯HTML和CSS编写
- 如果用户给了背景图片的链接需要结合背景图片排版
- 严格实现响应式设计，确保在任何浏览器宽度下都保持16:10的整体比例
- 在线 CDN 引用 Tailwind CSS 来优化比例和样式控制
- 内部元素应相对于容器进行缩放，确保整体设计和文字排版比例一致
- 使用Google Fonts或其他CDN加载适合的现代字体
- 可引用在线图标资源（如Font Awesome）
- 代码应可在现代浏览器中直接运行
- 提供完整HTML文档与所有必要的样式`;

  const stylePrompt = `
## 设计风格
**视觉设计** \n${selectedStyle.design}\n
**文字排版** \n${selectedStyle.typography}\n
**装饰元素** \n${selectedStyle.visual}`;

  const contentPrompt = input.platform === "xiaohongshu" 
    ? `
## 用户输入内容
- 封面文案：${input.content}
- 账号名称：${input.account}
${input.slogan ? `- 可选标语：${input.slogan}` : ""}
${input.backgroundUrl ? `- 背景图片：${input.backgroundUrl}` : ""}`
    : `
## 用户输入内容
- 公众号标题：${input.title}
${input.backgroundUrl ? `- emoji图片：${input.backgroundUrl}` : ""}`;

  const technicalPrompt = `
## 技术输出要求
- 返回格式必须是JSON，包含字段：html 
- html字段包含所有HTML代码
- 最外层的div要使用id="cover"，class="cover-container"
- 确保代码可以直接使用，不需要额外的依赖
- 代码需要简洁且有适当的注释`;

  return `${rolePrompt}

${basePrompt}

${stylePrompt}

${technicalPrompt}

${contentPrompt}`;
}