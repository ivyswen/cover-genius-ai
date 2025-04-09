import axios from 'axios';
import { toast } from 'sonner';
import { AIProvider, getProviderById } from './aiProviders';

interface GenerationResponse {
  html: string;
}

export async function generateCover(
  prompt: string,
  apiKey: string,
  providerId: string,
  modelId?: string
): Promise<GenerationResponse> {
  try {
    const provider = getProviderById(providerId);
    if (!provider) {
      throw new Error(`Unknown AI provider: ${providerId}`);
    }

    const model = modelId || provider.defaultModel;
    let requestData;
    let requestConfig;

    // 根据不同的提供商构建不同的请求数据
    switch (providerId) {
      case 'deepseek':
        requestData = {
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert web designer who creates beautiful HTML and CSS code for social media covers. You always respond with valid HTML code that can be directly used to create visually appealing designs.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' }
        };
        break;

      case 'anthropic':
        requestData = {
          model: model,
          messages: [
            {
              role: 'user',
              content: `You are an expert web designer who creates beautiful HTML and CSS code for social media covers. Please create HTML code based on this prompt: ${prompt}\n\nRespond with valid HTML code that can be directly used to create visually appealing designs. Return the HTML code in a code block or as a JSON object with an 'html' field.`
            }
          ],
          max_tokens: 4000
        };
        break;

      case 'gemini':
        // 对于Gemini，我们需要在URL中添加API密钥
        requestData = {
          contents: [
            {
              parts: [
                {
                  text: `You are an expert web designer who creates beautiful HTML and CSS code for social media covers. Please create HTML code based on this prompt: ${prompt}\n\nRespond with valid HTML code that can be directly used to create visually appealing designs. Return the HTML code in a code block or as a JSON object with an 'html' field.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192
          }
        };
        // 对于Gemini，API密钥是作为URL参数传递的
        requestConfig = {
          headers: provider.headers(apiKey),
          params: {
            key: apiKey
          }
        };
        break;

      case 'openai':
        requestData = {
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert web designer who creates beautiful HTML and CSS code for social media covers. You always respond with valid HTML code that can be directly used to create visually appealing designs.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        };
        break;

      default:
        throw new Error(`Unsupported provider: ${providerId}`);
    }

    // 如果没有特殊配置，使用默认配置
    if (!requestConfig) {
      requestConfig = {
        headers: provider.headers(apiKey)
      };
    }

    const response = await axios.post(
      provider.apiEndpoint,
      requestData,
      requestConfig
    );

    // 使用提供商特定的响应解析方法
    return provider.parseResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(`Failed to generate cover: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

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