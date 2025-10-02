import React from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Markdown Editor</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-96 font-mono text-sm bg-gray-900 text-gray-100 border-2 border-gray-700 rounded-lg p-4 focus:outline-none focus:border-purple-500"
        spellCheck={false}
      />
    </div>
  );
};
