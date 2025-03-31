interface Style {
  id: string;
  name: string;
  description: string;
  design: string;
  typography: string;
  visual: string;
  previewImage?: string;
}

export const styles: Style[] = [
  {
    id: "tech-soft",
    name: "柔和科技卡片风",
    description: "现代简约的设计风格，搭配柔和渐变和极简字体，适合科技、数码类内容。",
    previewImage: "/images/styles/tech-soft.jpg",
    design: "background: linear-gradient(to bottom, #f3e7ff, #fff); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);",
    typography: "font-family: 'Roboto', sans-serif; font-size: 24px; font-weight: 700; color: #333;",
    visual: "display: flex; align-items: center; justify-content: center;"
  },
  {
    id: "business-modern",
    name: "现代商务资讯卡片风",
    description: "专业大气的设计风格，配合强烈的字体和企业元素，适合商业和营销内容。",
    previewImage: "/images/styles/business-modern.jpg",
    design: "background: #1a3c34; border-radius: 8px; color: #fff;",
    typography: "font-family: 'Roboto', sans-serif; font-size: 28px; font-weight: 600; text-align: left;",
    visual: "padding: 20px;"
  },
  {
    id: "tech-flow-blue",
    name: "流动科技蓝风格",
    description: "现代简约科技风，以蓝色系为主体色调，营造轻盈通透感。",
    design: "- 现代简约科技风：采用简洁明快的设计语言，突出科技感\n- 蓝色系主体色调：以蓝色为主要色彩，营造科技感和专业性\n- 蓝白渐变应用：大量使用蓝白渐变效果，增添层次感\n- 极简背景：背景以白色或浅色调为主，保持清爽\n- 流线型曲线：运用流畅的曲线设计，创造动态视觉效果\n- 通透感营造：通过颜色和形状设计，打造轻盈通透的视觉感受\n- 动态元素：适当加入动态效果，增强界面的生动性",
    typography: "- 简洁标题：使用力度感强的标题设计\n- 字体选择：主要使用黑体或无衬线字体，确保清晰度\n- 层级对比：创造显著的标题层级视觉差异\n- 中英混排：灵活运用中英文排版，增加国际化感\n- 关键信息：对重要信息进行放大处理，突出重点\n- 字重变化：通过字体粗细变化增加层次感\n- 排版节奏：注重整体排版的韵律感",
    visual: "- 流动曲线装饰：使用流畅的曲线作为主要装饰元素\n- 半透明效果：运用蓝色波纹或螺旋形状贯穿设计\n- 几何抽象：使用抽象几何形状作为视觉点缀\n- 轻量级设计：图标和按钮采用简约轻盈的设计风格\n- 动效点缀：适当加入细微的动态效果\n- 层次感：通过视觉元素的叠加创造空间层次\n- 整体协调：确保所有视觉元素保持统一性"
  },
  {
    id: "minimal-grid",
    name: "极简格栅主义封面风格",
    description: "使用网格系统的清爽布局，装饰元素极简，适合教育和信息类内容。",
    previewImage: "/images/styles/minimal-grid.jpg",
    design: "background: #fff; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 24px;",
    typography: "font-family: 'Inter', sans-serif; font-size: 32px; font-weight: 800; line-height: 1.2;",
    visual: "border: 1px solid #eee;"
  },
  {
    id: "digital-ticket",
    name: "数字极简票券风",
    description: "模拟电子票据的现代设计，搭配醒目的数字元素，适合活动和优惠信息。",
    previewImage: "/images/styles/digital-ticket.jpg",
    design: "background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 12px; padding: 24px;",
    typography: "font-family: 'Space Mono', monospace; font-size: 24px; letter-spacing: -0.5px;",
    visual: "position: relative; overflow: hidden;"
  },
  {
    id: "constructivism-edu",
    name: "新构成主义教学风",
    description: "黑红白三色系统，网格化精准排版，学术实验美学，日式现代主义，教学图解风格。",
    previewImage: "/images/styles/constructivism-edu.jpg",
    design: "background: #fff; color: #000; border: 2px solid #000;",
    typography: "font-family: 'Helvetica Neue', sans-serif; font-size: 28px; font-weight: 700;",
    visual: "display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; background: #000;"
  },
  {
    id: "soft-knowledge",
    name: "软萌知识卡片风",
    description: "柔和色彩基调，圆角卡片结构，简约留白处理，渐变色背景，情感化设计。",
    previewImage: "/images/styles/soft-knowledge.jpg",
    design: "background: linear-gradient(to right, #ffecd2, #fcb69f); border-radius: 24px; padding: 20px;",
    typography: "font-family: 'Comic Sans MS', cursive; font-size: 24px; color: #4a4a4a;",
    visual: "box-shadow: 0 8px 32px rgba(0,0,0,0.1); border: 2px solid #fff;"
  },
  {
    id: "industrial-rebel",
    name: "新潮工业反叛风",
    description: "工业风格元素，反叛设计语言，高对比度色彩，粗犷质感表现，现代工业美学。",
    previewImage: "/images/styles/industrial-rebel.jpg",
    design: "background: #000; color: #fff; border: 2px solid #ff3e00;",
    typography: "font-family: 'Roboto Mono', monospace; font-size: 32px; text-transform: uppercase;",
    visual: "background-image: repeating-linear-gradient(45deg, #000 0, #000 10px, #ff3e00 10px, #ff3e00 20px);"
  },
  {
    id: "business-simple",
    name: "商务简约信息卡片风",
    description: "极简背景设计，高对比度呈现，方正几何布局，功能性优先，色块分区设计。",
    previewImage: "/images/styles/business-simple.jpg",
    design: "background: #f8f9fa; padding: 24px; border-radius: 8px;",
    typography: "font-family: 'SF Pro Display', sans-serif; font-size: 24px; line-height: 1.4;",
    visual: "border: 1px solid #e9ecef; box-shadow: 0 2px 8px rgba(0,0,0,0.05);"
  },
  {
    id: "tech-sharp",
    name: "新锐科技卡片风",
    description: "锐利几何造型，科技感色彩，动态视觉效果，空间层次丰富，未来感设计语言。",
    previewImage: "/images/styles/tech-sharp.jpg",
    design: "background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);",
    typography: "font-family: 'Orbitron', sans-serif; font-size: 28px; letter-spacing: 1px;",
    visual: "clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);"
  }
];