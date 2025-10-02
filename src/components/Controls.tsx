import React from 'react';
import { Play, Pause, Download } from 'lucide-react';
import { presets } from '../presets/presets';
import { parseMarkdown } from '../parser/markdownParser';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onDownload: () => void;
  onLoadPreset: (preset: string) => void;
}

// Helper to get preset display name from title in markdown
const getPresetTitle = (presetKey: string): string => {
  const presetMarkdown = presets[presetKey];
  const parsed = parseMarkdown(presetMarkdown);
  return (parsed.metadata.title as string) || presetKey;
};

// Categorize presets by type
const getPresetCategory = (presetKey: string): 'drums' | 'synth' => {
  const presetMarkdown = presets[presetKey];
  const parsed = parseMarkdown(presetMarkdown);
  return Object.keys(parsed.sounds).length > 0 ? 'synth' : 'drums';
};

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onPlayPause,
  onDownload,
  onLoadPreset
}) => {
  const presetKeys = Object.keys(presets);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <button
          onClick={onPlayPause}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-lg"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isPlaying ? 'Stop' : 'Play'}
        </button>

        <button
          onClick={onDownload}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition ml-auto"
        >
          <Download className="w-5 h-5" />
          Download
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Presets</h3>
        <div className="flex gap-2 flex-wrap">
          {presetKeys.map(key => {
            const category = getPresetCategory(key);
            const title = getPresetTitle(key);
            const colorClass = category === 'synth'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700';

            return (
              <button
                key={key}
                onClick={() => onLoadPreset(key)}
                className={`${colorClass} text-white px-4 py-2 rounded-lg transition text-sm font-medium shadow-md`}
              >
                {title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
