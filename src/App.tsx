import React, { useState } from 'react';
import { Music } from 'lucide-react';
import { GridView } from './components/GridView';
import { MarkdownEditor } from './components/MarkdownEditor';
import { NotationGuide } from './components/NotationGuide';
import { Controls } from './components/Controls';
import { useSequencer } from './hooks/useSequencer';
import { presets } from './presets/presets';

const MarkdownMusicSequencer: React.FC = () => {
  const [markdown, setMarkdown] = useState(presets.pluckkeys);

  const { isPlaying, currentStep, play, stop } = useSequencer(markdown);

  const handlePlayPause = () => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'music-pattern.md';
    a.click();
  };

  const loadPreset = (preset: string) => {
    if (presets[preset]) {
      setMarkdown(presets[preset]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-3 rounded-xl shadow-lg">
                <Music className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Markdown Music Sequencer</h1>
                <p className="text-purple-200 text-sm mt-1">Create rhythms with markdown syntax</p>
              </div>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="bg-gray-800/50 px-3 py-1 rounded-full text-purple-300 border border-purple-500/30">
                <code>X/x</code> drums
              </span>
              <span className="bg-gray-800/50 px-3 py-1 rounded-full text-blue-300 border border-blue-500/30">
                <code>1-9</code> notes
              </span>
              <span className="bg-gray-800/50 px-3 py-1 rounded-full text-green-300 border border-green-500/30">
                <code>.</code> rest
              </span>
            </div>
          </div>
        </div>

        {/* Controls & Sequencer */}
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700">
          <Controls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onDownload={downloadMarkdown}
            onLoadPreset={loadPreset}
          />

          <div className="mt-6">
            <GridView
              markdown={markdown}
              currentStep={currentStep}
              isPlaying={isPlaying}
            />
          </div>
        </div>

        {/* Editor & Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
          <NotationGuide />
        </div>
      </div>
    </div>
  );
};

export default MarkdownMusicSequencer;
