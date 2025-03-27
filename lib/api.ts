import axios from 'axios';
import { toast } from 'sonner';

interface GenerationResponse {
  html: string;
  css: string;
}

export async function generateCover(prompt: string, apiKey: string): Promise<GenerationResponse> {
  try {
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert web designer who creates beautiful HTML and CSS code for social media covers. You always respond with valid HTML and CSS code that can be directly used to create visually appealing designs.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://cover-genius-ai.vercel.app',
          'X-Title': 'Cover Genius AI'
        }
      }
    );

    const result = response.data.choices[0].message.content;
    const parsed = JSON.parse(result);

    if (!parsed.html || !parsed.css) {
      throw new Error('Invalid response format from AI');
    }

    return {
      html: parsed.html,
      css: parsed.css
    };
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to generate cover');
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