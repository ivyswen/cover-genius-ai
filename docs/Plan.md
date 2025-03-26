以下是将原始设计方案与补充方案综合后的完整方案，涵盖了从用户输入、风格选择、提示词拼接、AI 处理到生成封面设计（HTML 和 CSS）的全流程。方案基于 Next.js 开发，支持小红书和微信公众号封面生成，并提供预览、下载和历史记录功能。

---

**完整设计方案：AI 封面生成器**

**1. 功能需求**

**核心功能**

- **用户输入**：
    - 输入封面标题、文案、账号名称、可选标语。
    - 可选上传背景图片（通过 URL 输入）。
    - 输入 OpenRouter API Key（用于调用 DeepSeek V3）。
- **风格选择**：
    - 提供 10 种风格（如“柔和科技卡片风”、“现代商务资讯卡片风”等）供用户选择。
    - 支持自定义风格描述（通过文本输入，未来可扩展）。
- **平台选择**：
    - 小红书封面（3:4 比例）。
    - 微信公众号封面（3.35:1 主封面 + 1:1 朋友圈分享图）。
- **提示词生成与 AI 处理**：
    - 根据用户输入、风格和平台拼接提示词。
    - 通过 OpenRouter API 调用 DeepSeek V3，生成 HTML 和 CSS 代码。
- **生成结果**：
    - 实时预览生成的封面。
    - 输出 HTML 和 CSS 代码，供用户复制。
    - 提供一键下载图片功能（使用 html2canvas）。
- **历史记录**：
    - 保存生成记录（使用 localStorage），支持查看和删除。

**附加功能**

- **响应式设计**：支持桌面和移动端访问。
- **教程页面**：提供提示词使用教程，参考帖子内容。
- **用户体验**：
    - 使用 react-toastify 提供 API 调用状态提示。
    - 支持流式响应，减少等待时间。

---

**2. 技术选型**

- **框架**：Next.js（基于 React，支持 SSG 和 SSR，SEO 友好）。
- **样式**：
    - Tailwind CSS（快速样式开发，支持响应式设计）。
    - Google Fonts（加载现代字体）。
- **API 调用**：
    - OpenRouter API（调用 DeepSeek V3，支持流式响应）。
    - Axios（发送 HTTP 请求）。
- **图片生成**：html2canvas（将 DOM 转换为图片并支持下载）。
- **状态管理**：React Context（管理用户输入、风格选择和生成结果）。
- **存储**：localStorage（保存生成历史）。
- **用户反馈**：react-toastify（显示 API 调用状态）。
- **部署**：Vercel（Next.js 官方推荐，部署简单，支持 SSG）。

---

**3. 页面结构**

**页面划分**

1. **首页 (/)**
    - 简介：介绍网站功能（“一键生成小红书/公众号封面”）。
    - 输入表单：用户输入标题、文案、账号名称、标语、API Key 等。
    - 风格选择：下拉菜单展示 10 种风格。
    - 平台选择：单选按钮（小红书/微信公众号）。
    - 预览区域：实时显示生成的封面。
    - 操作按钮：生成封面、下载图片、保存记录。
2. **历史记录页 (/history)**
    - 展示用户保存的生成记录（标题、风格、生成的 HTML/CSS）。
    - 支持删除记录或重新编辑。
3. **教程页 (/tutorial)**
    - 展示提示词教程（角色设定、基本要求、风格要求等）。
    - 提供示例代码和风格描述。

**页面布局**

- **导航栏**：包含“首页”、“历史记录”、“教程”链接。
- **主内容**：
    - 左侧：输入表单、风格选择、平台选择。
    - 右侧：预览区域和操作按钮。
- **响应式设计**：
    - 桌面端：左右布局。
    - 移动端：上下布局（输入在上，预览在下）。

---

**4. 代码实现**

**项目结构**

```
cover-generator/
├── app/
│   ├── page.tsx              # 首页
│   ├── history/
│   │   └── page.tsx          # 历史记录页
│   ├── tutorial/
│   │   └── page.tsx          # 教程页
│   ├── layout.tsx            # 全局布局（导航栏）
│   ├── globals.css           # 全局样式
│   └── components/
│       ├── InputForm.tsx     # 输入表单组件
│       ├── StyleSelector.tsx # 风格选择组件
│       ├── PlatformSelector.tsx # 平台选择组件
│       ├── Preview.tsx       # 预览组件
│       └── CodeOutput.tsx    # 代码输出组件
├── public/                   # 静态资源
├── lib/
│   ├── styles.ts             # 风格定义
│   ├── prompt.ts             # 提示词拼接逻辑
│   └── api.ts                # API 调用逻辑
├── context/
│   └── AppContext.tsx        # 状态管理
├── package.json
└── tailwind.config.js
```

**4.1 状态管理 (context/AppContext.tsx)**

管理用户输入、风格选择、平台选择、API Key 和生成结果。

tsx

```tsx
import { createContext, useContext, useState } from 'react';

type Style = {
  name: string;
  design: string;
  typography: string;
  visual: string;
};

type AppState = {
  input: { title: string; content: string; account: string; slogan: string; background?: string };
  style: Style;
  platform: 'xiaohongshu' | 'wechat';
  generated: { html: string; css: string } | null;
  history: Array<{ input: AppState['input']; style: Style; generated: AppState['generated'] }>;
  apiKey: string;
  setInput: (input: AppState['input']) => void;
  setStyle: (style: Style) => void;
  setPlatform: (platform: AppState['platform']) => void;
  setGenerated: (generated: AppState['generated']) => void;
  setApiKey: (apiKey: string) => void;
  addToHistory: (entry: AppState['history'][0]) => void;
};

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [input, setInput] = useState({ title: '', content: '', account: '', slogan: '', background: '' });
  const [style, setStyle] = useState<Style>({ name: '柔和科技卡片风', design: '...', typography: '...', visual: '...' });
  const [platform, setPlatform] = useState<'xiaohongshu' | 'wechat'>('xiaohongshu');
  const [generated, setGenerated] = useState<{ html: string; css: string } | null>(null);
  const [history, setHistory] = useState<AppState['history']>([]);
  const [apiKey, setApiKey] = useState<string>('');

  const addToHistory = (entry: AppState['history'][0]) => {
    setHistory((prev) => [...prev, entry]);
    localStorage.setItem('history', JSON.stringify([...history, entry]));
  };

  return (
    <AppContext.Provider
      value={{
        input,
        setInput,
        style,
        setStyle,
        platform,
        setPlatform,
        generated,
        setGenerated,
        apiKey,
        setApiKey,
        history,
        addToHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
```

**4.2 风格定义 (lib/styles.ts)**

定义 10 种风格（基于帖子内容）。

ts

```
export const styles = [
  {
    name: '柔和科技卡片风',
    design: 'background: linear-gradient(to bottom, #f3e7ff, #fff); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);',
    typography: 'font-family: "Roboto", sans-serif; font-size: 24px; font-weight: 700; color: #333;',
    visual: 'display: flex; align-items: center; justify-content: center;'
  },
  {
    name: '现代商务资讯卡片风',
    design: 'background: #1a3c34; border-radius: 8px; color: #fff;',
    typography: 'font-family: "Roboto", sans-serif; font-size: 28px; font-weight: 600; text-align: left;',
    visual: 'padding: 20px;'
  },
  // 其他风格（简化为示例，实际可根据帖子内容补充）
  { name: '流动科技蓝风格', design: '...', typography: '...', visual: '...' },
  { name: '极简格栅主义封面风格', design: '...', typography: '...', visual: '...' },
  { name: '数字极简票券风', design: '...', typography: '...', visual: '...' },
  { name: '新构成主义教学风', design: '...', typography: '...', visual: '...' },
  { name: '奢华自然意境风', design: '...', typography: '...', visual: '...' },
  { name: '新潮工业反叛风', design: '...', typography: '...', visual: '...' },
  { name: '软萌知识卡片风', design: '...', typography: '...', visual: '...' },
  { name: '商务简约信息卡片风', design: '...', typography: '...', visual: '...' },
];
```

**4.3 提示词拼接 (lib/prompt.ts)**

拼接用户输入、风格和平台要求，生成完整的提示词。

ts

```
import { Style } from '../context/AppContext';

export const generatePrompt = (
  input: { title: string; content: string; account: string; slogan: string; background?: string },
  style: Style,
  platform: 'xiaohongshu' | 'wechat'
) => {
  const rolePrompt = `
你是一位优秀的网页和营销视觉设计师，具有丰富的UI/UX设计经验，曾为众多知名品牌打造过引人注目的营销视觉，擅长将现代设计趋势与实用营销策略完美融合。
请使用HTML和CSS代码生成一个${platform === 'xiaohongshu' ? '小红书封面' : '微信公众号封面图片组合布局'}。
`;

  const basePrompt =
    platform === 'xiaohongshu'
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
- 使用微妙的阴影或光效增加层次感
`
      : `
## 基本要求
- **尺寸与比例**：
  - 整体比例严格保持为3.35:1
  - 容器高度应随宽度变化自动调整，始终保持比例
  - 左边区域放置2.35:1比例的主封面图
  - 右边区域放置1:1比例的朋友圈分享封面
- **布局结构**：
  - 朋友圈封面只需四个大字铺满整个区域（上面两个下面两个）
  - 文字必须成为主封面图的视觉主体，占据页面至少70%的空间
  - 两个封面共享相同的背景色和点缀装饰元素
  - 最外层卡片需要是直角
- **技术实现**：
  - 使用纯HTML和CSS编写
  - 如果用户给了背景图片的链接需要结合背景图片排版
  - 严格实现响应式设计，确保在任何浏览器宽度下都保持16:10的整体比例
  - 在线 CDN 引用 Tailwind CSS 来优化比例和样式控制
  - 内部元素应相对于容器进行缩放，确保整体设计和文字排版比例一致
  - 使用Google Fonts或其他CDN加载适合的现代字体
  - 可引用在线图标资源（如Font Awesome）
  - 代码应可在现代浏览器中直接运行
  - 提供完整HTML文档与所有必要的样式
`;

  const stylePrompt = `
## 风格要求
- **设计风格**：${style.design}
- **文字排版风格**：${style.typography}
- **视觉元素风格**：${style.visual}
`;

  const userInputPrompt = `
## 用户输入内容
- 封面标题为：${input.title}
- 封面文案：${input.content}
- 账号名称：${input.account}
${input.slogan ? `- 可选标语：${input.slogan}` : ''}
${input.background ? `- 背景图片链接：${input.background}` : ''}
`;

  return `${rolePrompt}${basePrompt}${stylePrompt}${userInputPrompt}`;
};
```

**4.4 API 调用 (lib/api.ts)**

通过 OpenRouter 调用 DeepSeek V3 API，获取生成的 HTML 和 CSS。

ts

```
import axios from 'axios';
import { toast } from 'react-toastify';

export const callDeepSeekAPI = async (prompt: string, apiKey: string) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek-v3',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let result = '';
    const reader = response.data.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value);
    }

    // 假设 AI 返回 JSON 格式 { html: "...", css: "..." }
    const parsedResult = JSON.parse(result);
    return { html: parsedResult.html, css: parsedResult.css };
  } catch (error) {
    toast.error('API 调用失败，请检查 API Key 或网络连接');
    throw error;
  }
};
```

**4.5 输入表单 (components/InputForm.tsx)**

用户输入标题、文案等信息。

tsx

```tsx
import { useAppContext } from '../context/AppContext';

export default function InputForm() {
  const { input, setInput } = useAppContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        name="title"
        value={input.title}
        onChange={handleChange}
        placeholder="封面标题"
        className="w-full p-2 border rounded"
      />
      <textarea
        name="content"
        value={input.content}
        onChange={handleChange}
        placeholder="封面文案"
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="account"
        value={input.account}
        onChange={handleChange}
        placeholder="账号名称"
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="slogan"
        value={input.slogan}
        onChange={handleChange}
        placeholder="可选标语"
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="background"
        value={input.background}
        onChange={handleChange}
        placeholder="背景图片 URL（可选）"
        className="w-full p-2 border rounded"
      />
    </div>
  );
}
```

**4.6 风格选择 (components/StyleSelector.tsx)**

用户选择风格。

tsx

```tsx
import { useAppContext } from '../context/AppContext';
import { styles } from '../lib/styles';

export default function StyleSelector() {
  const { style, setStyle } = useAppContext();

  return (
    <select
      value={style.name}
      onChange={(e) => {
        const selected = styles.find((s) => s.name === e.target.value);
        if (selected) setStyle(selected);
      }}
      className="w-full p-2 border rounded mt-4"
    >
      {styles.map((s) => (
        <option key={s.name} value={s.name}>
          {s.name}
        </option>
      ))}
    </select>
  );
}
```

**4.7 平台选择 (components/PlatformSelector.tsx)**

用户选择生成平台。

tsx

```tsx
import { useAppContext } from '../context/AppContext';

export default function PlatformSelector() {
  const { platform, setPlatform } = useAppContext();

  return (
    <div className="mt-4">
      <label className="mr-4">
        <input
          type="radio"
          value="xiaohongshu"
          checked={platform === 'xiaohongshu'}
          onChange={() => setPlatform('xiaohongshu')}
        />
        小红书
      </label>
      <label>
        <input
          type="radio"
          value="wechat"
          checked={platform === 'wechat'}
          onChange={() => setPlatform('wechat')}
        />
        微信公众号
      </label>
    </div>
  );
}
```

**4.8 预览组件 (components/Preview.tsx)**

处理提示词拼接、API 调用、预览和下载。

tsx

```tsx
import { useAppContext } from '../context/AppContext';
import { generatePrompt } from '../lib/prompt';
import { callDeepSeekAPI } from '../lib/api';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Preview() {
  const { input, style, platform, apiKey, setApiKey, generated, setGenerated, addToHistory } = useAppContext();

  const handleGenerate = async () => {
    if (!apiKey) {
      toast.error('请先输入 API Key');
      return;
    }

    const prompt = generatePrompt(input, style, platform);

    try {
      const result = await callDeepSeekAPI(prompt, apiKey);
      setGenerated(result);
      addToHistory({ input, style, generated: result });
      toast.success('封面生成成功！');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = () => {
    const element = document.querySelector('.cover-container') as HTMLElement;
    html2canvas(element).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'cover.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="输入 OpenRouter API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
      </div>
      <div className="cover-container">
        {generated ? (
          <>
            <div dangerouslySetInnerHTML={{ __html: generated.html }} />
            <style>{generated.css}</style>
          </>
        ) : (
          <>
            <h1 className="title">{input.title || '预览标题'}</h1>
            <p className="content">{input.content || '预览文案'}</p>
            <p>{input.account || '预览账号'}</p>
            {input.slogan && <p>{input.slogan}</p>}
          </>
        )}
      </div>
      <button onClick={handleGenerate} className="mt-4 p-2 bg-blue-500 text-white rounded">
        生成封面
      </button>
      {generated && (
        <button onClick={handleDownload} className="mt-4 p-2 bg-green-500 text-white rounded">
          下载图片
        </button>
      )}
      <ToastContainer />
    </div>
  );
}
```

**4.9 代码输出组件 (components/CodeOutput.tsx)**

显示生成的 HTML 和 CSS，供用户复制。

tsx

```tsx
import { useAppContext } from '../context/AppContext';

export default function CodeOutput() {
  const { generated } = useAppContext();

  if (!generated) return null;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">生成的代码</h2>
      <div className="mt-2">
        <h3>HTML</h3>
        <pre className="p-2 bg-gray-100 rounded">{generated.html}</pre>
      </div>
      <div className="mt-2">
        <h3>CSS</h3>
        <pre className="p-2 bg-gray-100 rounded">{generated.css}</pre>
      </div>
    </div>
  );
}
```

**4.10 首页 (app/page.tsx)**

整合所有组件。

tsx

```tsx
import InputForm from '../components/InputForm';
import StyleSelector from '../components/StyleSelector';
import PlatformSelector from '../components/PlatformSelector';
import Preview from '../components/Preview';
import CodeOutput from '../components/CodeOutput';
import { ToastContainer } from 'react-toastify';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI 封面生成器</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InputForm />
          <StyleSelector />
          <PlatformSelector />
        </div>
        <div>
          <Preview />
          <CodeOutput />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
```

**4.11 历史记录页 (app/history/page.tsx)**

展示生成历史。

tsx

```tsx
import { useAppContext } from '../../context/AppContext';

export default function History() {
  const { history, setHistory } = useAppContext();

  const handleDelete = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem('history', JSON.stringify(newHistory));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">生成历史</h1>
      {history.length === 0 ? (
        <p>暂无历史记录</p>
      ) : (
        <div className="space-y-4">
          {history.map((entry, index) => (
            <div key={index} className="p-4 border rounded">
              <h2 className="text-xl font-bold">{entry.input.title}</h2>
              <p>风格：{entry.style.name}</p>
              <p>平台：{entry.platform === 'xiaohongshu' ? '小红书' : '微信公众号'}</p>
              <button
                onClick={() => handleDelete(index)}
                className="mt-2 p-2 bg-red-500 text-white rounded"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**4.12 教程页 (app/tutorial/page.tsx)**

展示提示词教程。

tsx

```tsx
export default function Tutorial() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">提示词使用教程</h1>
      <p>本教程基于歸藏(guizang.ai)分享的提示词方案，帮助你快速生成小红书和微信公众号封面。</p>
      <h2 className="text-2xl font-bold mt-4">提示词结构</h2>
      <ul className="list-disc pl-5">
        <li><strong>角色设定</strong>：定义 AI 为优秀的视觉设计师。</li>
        <li><strong>基本要求</strong>：约束画面比例和排版规则。</li>
        <li><strong>风格要求</strong>：描述设计、排版和视觉元素风格。</li>
        <li><strong>用户输入内容</strong>：包含标题、文案等用户提供的信息。</li>
      </ul>
      <p>更多详情请参考原始帖子内容。</p>
    </div>
  );
}
```

**4.13 全局布局 (app/layout.tsx)**

添加导航栏。

tsx

```tsx
import { AppProvider } from '../context/AppContext';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <AppProvider>
          <nav className="bg-gray-800 text-white p-4">
            <ul className="flex space-x-4">
              <li><Link href="/">首页</Link></li>
              <li><Link href="/history">历史记录</Link></li>
              <li><Link href="/tutorial">教程</Link></li>
            </ul>
          </nav>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
```

**4.14 全局样式 (app/globals.css)**

css

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Roboto', sans-serif;
}
```

**4.15 Tailwind 配置 (tailwind.config.js)**

js

```
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      aspectRatio: {
        '3/4': '3 / 4',
        '3.35/1': '3.35 / 1',
      },
    },
  },
  plugins: [],
};
```

**4.16 依赖安装**

bash

```bash
npm install next react react-dom axios react-toastify html2canvas tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

**5. 部署建议**

- **Vercel 部署**：
    1. 将项目推送到 GitHub。
    2. 在 Vercel 平台导入项目，自动检测 Next.js 配置。
    3. 部署后，Vercel 会生成静态文件（SSG），提升性能。
- **性能优化**：
    - 使用 Next.js 的 getStaticProps 预渲染风格数据。
    - 启用 Tailwind CSS 的 JIT 模式，减少未使用的 CSS。
    - 压缩图片和代码，减少加载时间。

---

**6. 完整流程**

1. 用户访问首页，输入标题、文案、账号名称、标语、背景图片 URL 和 OpenRouter API Key。
2. 选择风格（例如“柔和科技卡片风”）和平台（小红书或微信公众号）。
3. 点击“生成封面”按钮，触发提示词拼接（generatePrompt）。
4. 通过 OpenRouter API 调用 DeepSeek V3（callDeepSeekAPI），获取生成的 HTML 和 CSS。
5. 渲染生成的封面到预览区域，显示代码供用户复制。
6. 用户可下载图片（html2canvas）或保存记录到历史。
7. 用户可访问历史记录页查看过往生成，或访问教程页学习提示词使用。

---

**7. 扩展可能性**

- **支持更多 AI 模型**：通过 OpenRouter 接入 Claude 或其他模型。
- **提示词优化**：允许用户编辑生成的提示词，发送给 AI 进行二次优化。
- **批量生成**：支持一次性生成多个风格的封面，供用户对比。
- **多语言支持**：添加中英文切换，适应国际化需求。

---

**8. 总结**

这个完整方案实现了从用户输入到 AI 生成封面的全流程，支持小红书和微信公众号封面生成。Next.js 和 Tailwind CSS 提供了高效的开发体验，DeepSeek V3 的流式响应提升了用户体验，react-toastify 提供了友好的交互反馈。代码结构清晰，易于维护和扩展，部署到 Vercel 后可快速上线。如果需要进一步优化或添加功能，可以继续讨论！