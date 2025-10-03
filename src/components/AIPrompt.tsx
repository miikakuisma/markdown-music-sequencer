import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

interface AIPromptProps {
  onGenerate: (prompt: string) => Promise<void>;
}

export const AIPrompt: React.FC<AIPromptProps> = ({ onGenerate }) => {
  const hasAPIKey = !!import.meta.env.VITE_OPENAI_API_KEY;
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      await onGenerate(prompt);
      setPrompt('');
    } catch (error) {
      console.error('Error generating pattern:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const examplePrompts = [
    'Create a techno pattern at 130 BPM',
    'Generate a funky bassline with drums',
    'Make a chill lofi beat',
    'Add a complex drum fill',
  ];

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-purple-600 p-2 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">AI Pattern Generator</h2>
        {hasAPIKey && (
          <span className="ml-auto text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-full border border-green-600/30">
            OpenAI Connected
          </span>
        )}
      </div>

      {!hasAPIKey && (
        <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
          <p className="text-yellow-200 text-sm">
            Add <code className="bg-gray-800 px-1 py-0.5 rounded">VITE_OPENAI_API_KEY</code> to your <code className="bg-gray-800 px-1 py-0.5 rounded">.env.local</code> file to enable AI generation.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the pattern you want to generate..."
            disabled={!hasAPIKey || isGenerating}
            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-purple-500 focus:outline-none resize-none h-24 disabled:opacity-50"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={!hasAPIKey || !prompt.trim() || isGenerating}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>

          {isGenerating && (
            <div className="text-purple-300 text-sm animate-pulse">
              AI is composing your pattern...
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-gray-400 text-sm">Example prompts:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPrompt(example)}
                disabled={!hasAPIKey || isGenerating}
                className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg hover:bg-gray-600 transition text-sm disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
