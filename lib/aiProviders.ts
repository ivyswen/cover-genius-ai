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
    id: "siliconflow",
    name: "硅基流动",
    description: "硅基流动提供多种国产大模型，包括通义千问、书生、GLM等",
    apiKeyUrl: "https://cloud.siliconflow.cn/account/ak",
    apiEndpoint: "https://api.siliconflow.cn/v1/chat/completions",
    defaultModel: "Qwen/QwQ-32B",
    models: [
      { id: "Qwen/QwQ-32B", name: "通义千问 QwQ-32B" },
      { id: "Qwen/Qwen2.5-72B-Instruct", name: "通义千问 2.5-72B" },
      { id: "Qwen/Qwen2.5-32B-Instruct", name: "通义千问 2.5-32B" },
      { id: "Qwen/Qwen2.5-7B-Instruct", name: "通义千问 2.5-7B" },
      { id: "deepseek-ai/DeepSeek-V3", name: "DeepSeek-V3" },
      { id: "THUDM/glm-4-9b-chat", name: "智谱 GLM-4-9B" }
    ],
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    parseResponse: (response: any) => {
      const content = response.data.choices[0].message.content;
      return processAIResponse(content, '硅基流动');
    }
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    description: "OpenRouter提供多种AI模型的统一接口，包括Claude、GPT等",
    apiKeyUrl: "https://openrouter.ai/keys",
    apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
    defaultModel: "anthropic/claude-3-opus:beta",
    models: [
      { id: "anthropic/claude-3-opus:beta", name: "Claude 3 Opus" },
      { id: "anthropic/claude-3-sonnet:beta", name: "Claude 3 Sonnet" },
      { id: "anthropic/claude-3-haiku:beta", name: "Claude 3 Haiku" },
      { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo" },
      { id: "openai/gpt-4o", name: "GPT-4o" },
      { id: "meta-llama/llama-3-70b-instruct", name: "Llama 3 70B" },
      { id: "google/gemini-pro", name: "Gemini Pro" }
    ],
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://cover-genius-ai.vercel.app',
      'X-Title': 'Cover Genius AI'
    }),
    parseResponse: (response: any) => {
      try {
        const content = response.data.choices[0].message.content;
        return processAIResponse(content, 'OpenRouter');
      } catch (error: any) {
        console.error("Failed to parse response from OpenRouter", error);
        return { html: `<div>Error parsing OpenRouter response: ${error?.message || 'Unknown error'}</div>` };
      }
    }
  },
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
      try {
        const content = response.data.choices[0].message.content;
        return processAIResponse(content, 'DeepSeek');
      } catch (e) {
        // 兼容原来的处理方式
        try {
          const result = response.data.choices[0].message.content;
          const parsed = JSON.parse(result);
          return { html: parsed.html };
        } catch (error) {
          console.error("Failed to parse response from DeepSeek", error);
          return { html: `<div>Error parsing DeepSeek response</div>` };
        }
      }
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
      try {
        const content = response.data.content[0].text;
        return processAIResponse(content, 'Claude');
      } catch (error: any) {
        console.error("Failed to parse response from Claude", error);
        return { html: `<div>Error parsing Claude response: ${error?.message || 'Unknown error'}</div>` };
      }
    }
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Google的Gemini AI模型，提供强大的文本和代码生成能力",
    apiKeyUrl: "https://aistudio.google.com/app/apikey",
    apiEndpoint: "https://generativelanguage.googleapis.com/v1beta/models",
    defaultModel: "gemini-2.0-flash",
    models: [
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
      { id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash-Lite" },
      { id: "gemini-2.5-pro-exp-03-25", name: "Gemini 2.5 Pro Exp 03-25" }
    ],
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json'
    }),
    parseResponse: (response: any) => {
      try {
        const content = response.data.candidates[0].content.parts[0].text;
        return processAIResponse(content, 'Gemini');
      } catch (error: any) {
        return { html: `<div>Error parsing Gemini response: ${error?.message || 'Unknown error'}</div>` };
      }
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
      try {
        const content = response.data.choices[0].message.content;
        return processAIResponse(content, 'OpenAI');
      } catch (error: any) {
        console.error("Failed to parse response from OpenAI", error);
        return { html: `<div>Error parsing OpenAI response: ${error?.message || 'Unknown error'}</div>` };
      }
    }
  }
];

export const getProviderById = (id: string): AIProvider | undefined => {
  return aiProviders.find(provider => provider.id === id);
};

export const getDefaultProvider = (): AIProvider => {
  return aiProviders[0];
};

// 通用函数，用于处理AI提供商返回的内容
export function processAIResponse(content: string, providerName: string = 'AI'): { html: string } {
  try {
    // 如果是空响应，返回错误信息
    if (!content || content.trim() === '') {
      return { html: `<div>Error: Empty response from ${providerName}</div>` };
    }

    // 处理 Markdown 代码块标记
    let processedContent = content;
    if (processedContent.includes('```')) {
      // 如果包含多个代码块，只提取第一个
      const codeBlockMatch = processedContent.match(/```(?:html|json)?([\s\S]*?)```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        const extractedContent = codeBlockMatch[1].trim();

        // 如果提取的内容是JSON字符串，尝试解析它
        if (extractedContent.trim().startsWith('{') && extractedContent.trim().endsWith('}')) {
          try {
            const jsonContent = JSON.parse(extractedContent);
            if (jsonContent.html) {
              return { html: jsonContent.html };
            }
          } catch (e) {
            console.error(`Failed to parse JSON from ${providerName} code block`, e);
            // 解析失败，继续使用提取的内容
          }
        }

        // 如果提取的内容是HTML，直接返回
        if (extractedContent.includes('<') && extractedContent.includes('>')) {
          return { html: extractedContent };
        }

        processedContent = extractedContent;
      } else {
        // 如果没有匹配到完整的代码块，尝试移除所有 ``` 标记
        processedContent = processedContent.replace(/```(?:html|json)?/g, '').replace(/```/g, '').trim();
      }
    }

    // 尝试从内容中提取HTML代码
    const htmlMatch = processedContent.match(/<html[\s\S]*?<\/html>/) ||
                      processedContent.match(/<body[\s\S]*?<\/body>/) ||
                      processedContent.match(/<div[\s\S]*?<\/div>/);

    if (htmlMatch) {
      return { html: htmlMatch[0] };
    }

    // 尝试直接解析为 JSON
    try {
      const parsed = JSON.parse(processedContent);
      if (parsed.html) {
        return { html: parsed.html };
      }
      // 如果 JSON 中没有 html 字段，但有其他内容，尝试使用第一个字段
      const firstKey = Object.keys(parsed)[0];
      if (firstKey && typeof parsed[firstKey] === 'string') {
        return { html: parsed[firstKey] };
      }
    } catch (e) {
      // 不是有效的 JSON，继续尝试其他方法
    }

    // 尝试提取 JSON 对象
    const jsonMatch = processedContent.match(/{[\s\S]*?}/);
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        if (parsed.html) {
          return { html: parsed.html };
        }
        // 如果 JSON 中没有 html 字段，但有其他内容，尝试使用第一个字段
        const firstKey = Object.keys(parsed)[0];
        if (firstKey && typeof parsed[firstKey] === 'string') {
          return { html: parsed[firstKey] };
        }
      } catch (jsonError) {
        // 解析提取的 JSON 失败，继续尝试其他方法
      }
    }

    // 如果内容包含 HTML 标签，则可能是 HTML 片段
    if (processedContent.includes('<') && processedContent.includes('>') &&
        (processedContent.includes('</div>') || processedContent.includes('</p>') || processedContent.includes('</span>'))) {
      return { html: processedContent };
    }

    // 如果都失败了，将内容包裹在 div 中返回
    return { html: `<div>${processedContent}</div>` };
  } catch (error: any) {
    console.error(`Failed to parse response from ${providerName}`, error);
    return { html: `<div>Error parsing ${providerName} response: ${error?.message || 'Unknown error'}</div>` };
  }
}
