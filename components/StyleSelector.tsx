'use client';

import { useAppContext } from '../context/AppContext';

export default function StyleSelector() {
  const { style, setStyle } = useAppContext();

  const styles = [
    { id: 'modern', name: '现代简约' },
    { id: 'elegant', name: '优雅精致' },
    { id: 'playful', name: '活泼可爱' },
    { id: 'professional', name: '专业商务' },
    { id: 'retro', name: '复古文艺' }
  ];

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">风格选择</h2>
      <div className="grid grid-cols-2 gap-2">
        {styles.map((item) => (
          <button
            key={item.id}
            className={`p-2 border rounded-md ${style === item.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            onClick={() => setStyle(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}