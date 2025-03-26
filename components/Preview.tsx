'use client';

import { useAppContext } from '../context/AppContext';

export default function Preview() {
  const { input, generated } = useAppContext();

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">预览效果</h2>
      <div 
        className="p-4 border rounded-lg shadow-sm"
        style={{
          backgroundColor: generated?.css ? 'transparent' : '#f3f4f6',
        }}
      >
        {generated ? (
          <div 
            dangerouslySetInnerHTML={{ __html: generated.html }}
            style={generated.css ? { ...JSON.parse(generated.css) } : {}}
          />
        ) : (
          <div className="text-gray-500 text-center p-4">
            <p className="font-medium">{input?.content || '预览文案'}</p>
            <p className="mt-2">{input?.account || '预览账号'}</p>
            {input?.slogan && <p className="mt-1 text-sm">{input.slogan}</p>}
          </div>
        )}
      </div>
    </div>
  );
}