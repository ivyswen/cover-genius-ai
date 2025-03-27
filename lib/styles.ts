interface Style {
  id: string;
  name: string;
  description: string;
  design: string;
  typography: string;
  visual: string;
}

export const styles: Style[] = [
  {
    id: "tech-soft",
    name: "柔和科技卡片风",
    description: "现代简约的设计风格，搭配柔和渐变和极简字体，适合科技、数码类内容。",
    design: "background: linear-gradient(to bottom, #f3e7ff, #fff); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);",
    typography: "font-family: 'Roboto', sans-serif; font-size: 24px; font-weight: 700; color: #333;",
    visual: "display: flex; align-items: center; justify-content: center;"
  },
  {
    id: "business-modern",
    name: "现代商务资讯卡片风",
    description: "专业大气的设计风格，配合强烈的字体和企业元素，适合商业和营销内容。",
    design: "background: #1a3c34; border-radius: 8px; color: #fff;",
    typography: "font-family: 'Roboto', sans-serif; font-size: 28px; font-weight: 600; text-align: left;",
    visual: "padding: 20px;"
  },
  {
    id: "minimal-grid",
    name: "极简格栅主义封面风格",
    description: "使用网格系统的清爽布局，装饰元素极简，适合教育和信息类内容。",
    design: "background: #fff; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 24px;",
    typography: "font-family: 'Inter', sans-serif; font-size: 32px; font-weight: 800; line-height: 1.2;",
    visual: "border: 1px solid #eee;"
  },
  {
    id: "digital-ticket",
    name: "数字极简票券风",
    description: "模拟电子票据的现代设计，搭配醒目的数字元素，适合活动和优惠信息。",
    design: "background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 12px; padding: 24px;",
    typography: "font-family: 'Space Mono', monospace; font-size: 24px; letter-spacing: -0.5px;",
    visual: "position: relative; overflow: hidden;"
  },
  {
    id: "nature-luxury",
    name: "奢华自然意境风",
    description: "优雅的设计风格，配合自然元素和精致字体，适合生活方式和奢侈品内容。",
    design: "background: linear-gradient(135deg, #d5b59c, #f8f4f0); padding: 32px;",
    typography: "font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700;",
    visual: "border: 1px solid rgba(0,0,0,0.1);"
  }
];