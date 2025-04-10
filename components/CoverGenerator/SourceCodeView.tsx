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
    <div className="w-full">
      <div className="relative">
        <SyntaxHighlighter
          language="html"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            minHeight: '650px',
            maxHeight: '800px',
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
