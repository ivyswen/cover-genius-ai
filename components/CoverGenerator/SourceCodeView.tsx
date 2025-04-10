"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SourceCodeViewProps {
  html: string;
}

export default function SourceCodeView({ html }: SourceCodeViewProps) {
  // Only render on client side
  if (typeof window === 'undefined') {
    return <div className="w-full h-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="relative h-full p-2">
        <SyntaxHighlighter
          language="html"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            height: 'auto',
            maxHeight: '900px',
            minHeight: '400px',
            overflow: 'auto',
            backgroundColor: '#1E1E1E'
          }}
        >
          {html}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
