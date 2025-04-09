"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SourceCodeViewProps {
  html: string;
}

export default function SourceCodeView({ html }: SourceCodeViewProps) {
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
            overflow: 'auto'
          }}
        >
          {html}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
