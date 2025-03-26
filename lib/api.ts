import axios from 'axios';
import { toast } from 'sonner';

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