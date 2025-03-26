'use client';

import { useAppContext } from '../context/AppContext';

export default function CodeOutput() {
  const { generated } = useAppContext();

  if (!generated) return null;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">生成的代码</h2>
      <div className="mt-2">
        <h3 className="text-lg font-medium mb-1">HTML</h3>
        <pre className="p-4 bg-gray-100 rounded-lg overflow-x-auto">
          {generated.html}
        </pre>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-1">CSS</h3>
        <pre className="p-4 bg-gray-100 rounded-lg overflow-x-auto">
          {generated.css}
        </pre>
      </div>
    </div>
  );
}