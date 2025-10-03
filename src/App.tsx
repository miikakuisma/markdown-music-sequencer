import React, { useState, useRef } from 'react';
import { Music } from 'lucide-react';
import { GridView } from './components/GridView';
import { MarkdownEditor } from './components/MarkdownEditor';
import { NotationGuide } from './components/NotationGuide';
import { Controls } from './components/Controls';
import { AIPrompt } from './components/AIPrompt';
import { useSequencer } from './hooks/useSequencer';
import { presets } from './presets/presets';
import { midiToMarkdown, markdownToMidi } from './midi/midiConverter';
import { generatePattern } from './ai/patternGenerator';

const MarkdownMusicSequencer: React.FC = () => {
  const [markdown, setMarkdown] = useState(presets.pluckkeys);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleMidiImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const convertedMarkdown = midiToMarkdown(arrayBuffer);
      setMarkdown(convertedMarkdown);
    } catch (error) {
      console.error('Error importing MIDI:', error);
      alert('Failed to import MIDI file. Please check the file format.');
    }

    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMidiExport = () => {
    try {
      const midiData = markdownToMidi(markdown);
      // Convert to regular Uint8Array for Blob compatibility
      const uint8Array = new Uint8Array(midiData);
      const blob = new Blob([uint8Array], { type: 'audio/midi' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pattern.mid';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting MIDI:', error);
      alert('Failed to export MIDI file. Please check your pattern.');
    }
  };

  const handleAIGenerate = async (prompt: string) => {
    try {
      const generated = await generatePattern(prompt, markdown);
      setMarkdown(generated);
    } catch (error) {
      console.error('Error generating pattern:', error);
      alert(`Failed to generate pattern: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-8">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".mid,.midi"
        style={{ display: 'none' }}
      />
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
            onMidiImport={handleMidiImport}
            onMidiExport={handleMidiExport}
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

        {/* AI Prompt */}
        <AIPrompt onGenerate={handleAIGenerate} />

      </div>
    </div>
  );
};

export default MarkdownMusicSequencer;
