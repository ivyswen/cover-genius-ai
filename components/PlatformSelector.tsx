'use client';

import { useAppContext } from '../context/AppContext';

export default function PlatformSelector() {
  const { platform, setPlatform } = useAppContext();

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">平台选择</h2>
      <div className="space-x-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio"
            value="xiaohongshu"
            checked={platform === 'xiaohongshu'}
            onChange={() => setPlatform('xiaohongshu')}
          />
          <span className="ml-2">小红书</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio"
            value="wechat"
            checked={platform === 'wechat'}
            onChange={() => setPlatform('wechat')}
          />
          <span className="ml-2">微信公众号</span>
        </label>
      </div>
    </div>
  );
}