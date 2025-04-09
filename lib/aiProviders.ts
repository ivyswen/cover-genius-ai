export interface AIProvider {
  id: string;
  name: string;
  description: string;
  apiKeyUrl: string;
  apiEndpoint: string;
  defaultModel: string;
  models: {
    id: string;
    name: string;
  }[];
  headers: (apiKey: string) => Record<string, string>;
  parseResponse: (response: any) => { html: string };
}

export const aiProviders: AIProvider[] = [
  {
    id: "deepseek",
    name: "DeepSeek",
    description: "DeepSeek AI提供高质量的文本和代码生成能力",
    apiKeyUrl: "https://platform.deepseek.com/api_keys",
    apiEndpoint: "https://api.deepseek.com/chat/completions",
    defaultModel: "deepseek-chat",
    models: [
      { id: "deepseek-chat", name: "DeepSeek Chat" }
    ],
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://cover-genius-ai.vercel.app',
      'X-Title': 'Cover Genius AI'
    }),
    parseResponse: (response: any) => {
      const result = response.data.choices[0].message.content;
      const parsed = JSON.parse(result);
      return { html: parsed.html };
    }
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    description: "Claude是Anthropic开发的AI助手，擅长生成高质量文本和代码",
    apiKeyUrl: "https://console.anthropic.com/settings/keys",
    apiEndpoint: "https://api.anthropic.com/v1/messages",
    defaultModel: "claude-3-opus-20240229",
    models: [
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
      { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet" },
      { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" }
    ],
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    }),
    parseResponse: (response: any) => {
      const content = response.data.content[0].text;
      // 尝试从内容中提取HTML代码块
      const htmlMatch = content.match(/```html\n([\s\S]*?)\n```/) || 
                        content.match(/<html[\s\S]*?<\/html>/) ||
                        content.match(/<body[\s\S]*?<\/body>/);
      
      if (htmlMatch) {
        return { html: htmlMatch[1] || htmlMatch[0] };
      }
      
      // 如果没有找到HTML代码块，尝试解析为JSON
      try {
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          const jsonStr = content.substring(jsonStart, jsonEnd + 1);
          const parsed = JSON.parse(jsonStr);
          if (parsed.html) {
            return { html: parsed.html };
          }
        }
      } catch (e) {
        console.error("Failed to parse JSON from Claude response", e);
      }
      
      // 如果都失败了，直接返回内容
      return { html: content };
    }
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Google的Gemini AI模型，提供强大的文本和代码生成能力",
    apiKeyUrl: "https://aistudio.google.com/app/apikey",
    apiEndpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    defaultModel: "gemini-pro",
    models: [
      { id: "gemini-pro", name: "Gemini Pro" }
    ],
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json'
    }),
    parseResponse: (response: any) => {
      const content = response.data.candidates[0].content.parts[0].text;
      // 尝试从内容中提取HTML代码块
      const htmlMatch = content.match(/```html\n([\s\S]*?)\n```/) || 
                        content.match(/<html[\s\S]*?<\/html>/) ||
                        content.match(/<body[\s\S]*?<\/body>/);
      
      if (htmlMatch) {
        return { html: htmlMatch[1] || htmlMatch[0] };
      }
      
      // 如果没有找到HTML代码块，尝试解析为JSON
      try {
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          const jsonStr = content.substring(jsonStart, jsonEnd + 1);
          const parsed = JSON.parse(jsonStr);
          if (parsed.html) {
            return { html: parsed.html };
          }
        }
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response", e);
      }
      
      // 如果都失败了，直接返回内容
      return { html: content };
    }
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "OpenAI的GPT模型，提供强大的文本和代码生成能力",
    apiKeyUrl: "https://platform.openai.com/api-keys",
    apiEndpoint: "https://api.openai.com/v1/chat/completions",
    defaultModel: "gpt-4-turbo",
    models: [
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
      { id: "gpt-4", name: "GPT-4" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" }
    ],
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    parseResponse: (response: any) => {
      const content = response.data.choices[0].message.content;
      // 尝试从内容中提取HTML代码块
      const htmlMatch = content.match(/```html\n([\s\S]*?)\n```/) || 
                        content.match(/<html[\s\S]*?<\/html>/) ||
                        content.match(/<body[\s\S]*?<\/body>/);
      
      if (htmlMatch) {
        return { html: htmlMatch[1] || htmlMatch[0] };
      }
      
      // 如果没有找到HTML代码块，尝试解析为JSON
      try {
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
          const jsonStr = content.substring(jsonStart, jsonEnd + 1);
          const parsed = JSON.parse(jsonStr);
          if (parsed.html) {
            return { html: parsed.html };
          }
        }
      } catch (e) {
        console.error("Failed to parse JSON from OpenAI response", e);
      }
      
      // 如果都失败了，直接返回内容
      return { html: content };
    }
  }
];

export const getProviderById = (id: string): AIProvider | undefined => {
  return aiProviders.find(provider => provider.id === id);
};

export const getDefaultProvider = (): AIProvider => {
  return aiProviders[0];
};
