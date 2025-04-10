import axios from 'axios';
import { getProviderById } from './aiProviders';

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
    let apiEndpoint = provider.apiEndpoint;

    // 根据不同的提供商构建不同的请求数据
    switch (providerId) {
      case 'siliconflow':
        requestData = {
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You always respond with valid HTML code that can be directly used to create visually appealing designs.'
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

      case 'openrouter':
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

      case 'deepseek':
        requestData = {
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You always respond with valid HTML code that can be directly used to create visually appealing designs.'
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
              role: "user",
              parts: [
                {
                  text: `You are an expert web designer who creates beautiful HTML and CSS code for social media covers. Please create HTML code based on this prompt: ${prompt}\n\nRespond with valid HTML code that can be directly used to create visually appealing designs. Don't include any Markdown formatting in your response.`
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
        // 更新端点URL，添加模型名称
        apiEndpoint = `${provider.apiEndpoint}/${model}:generateContent`;
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
      apiEndpoint,
      requestData,
      requestConfig
    );

    // 使用提供商特定的响应解析方法
    return provider.parseResponse(response);
  } catch (error) {
    // 提取更详细的错误信息
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const statusText = error.response?.statusText;
      const errorData = error.response?.data;

      // 根据状态码提供更具体的错误信息
      if (statusCode === 401) {
        throw new Error(`认证失败: API密钥无效或已过期 (${statusCode} ${statusText})`);
      } else if (statusCode === 403) {
        throw new Error(`授权错误: 无权访问此API (${statusCode} ${statusText})`);
      } else if (statusCode === 429) {
        throw new Error(`请求过多: 超出了API限制 (${statusCode} ${statusText})`);
      } else if (statusCode && statusCode >= 500) {
        throw new Error(`服务器错误: 请稍后重试 (${statusCode} ${statusText})`);
      } else {
        // 尝试从响应中提取错误信息
        const errorMessage = errorData?.error?.message || errorData?.message || error.message;
        throw new Error(`请求失败: ${errorMessage} (${statusCode || 'Unknown'} ${statusText || ''})`);
      }
    } else {
      throw new Error(`生成封面失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }
}

