'use client';

import { useAppContext } from '../context/AppContext';

export default function InputForm() {
  const { input, setInput } = useAppContext();

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">内容设置</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            文案内容
          </label>
          <textarea
            id="content"
            className="w-full p-2 border rounded-md"
            value={input?.content || ''}
            onChange={(e) => setInput({ ...input, content: e.target.value })}
            rows={3}
            placeholder="输入文案内容"
          />
        </div>
        <div>
          <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">
            账号名称
          </label>
          <input
            type="text"
            id="account"
            className="w-full p-2 border rounded-md"
            value={input?.account || ''}
            onChange={(e) => setInput({ ...input, account: e.target.value })}
            placeholder="输入账号名称"
          />
        </div>
        <div>
          <label htmlFor="slogan" className="block text-sm font-medium text-gray-700 mb-1">
            品牌口号（可选）
          </label>
          <input
            type="text"
            id="slogan"
            className="w-full p-2 border rounded-md"
            value={input?.slogan || ''}
            onChange={(e) => setInput({ ...input, slogan: e.target.value })}
            placeholder="输入品牌口号"
          />
        </div>
      </div>
    </div>
  );
}