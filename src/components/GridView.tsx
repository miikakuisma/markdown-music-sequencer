import React from 'react';
import { parseMarkdown } from '../parser/markdownParser';
import { parseNoteAtPosition } from '../audio/noteUtils';

interface GridViewProps {
  markdown: string;
  currentStep: number;
  isPlaying: boolean;
}

export const GridView: React.FC<GridViewProps> = ({ markdown, currentStep, isPlaying }) => {
  const { patterns, sounds } = parseMarkdown(markdown);
  if (patterns.length === 0) return null;

  const pattern = patterns[0];
  const maxSteps = Math.max(...pattern.tracks.map(t => t.pattern.length));

  return (
    <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
      <div className="flex gap-2">
        <div className="w-20 flex flex-col justify-around">
          {pattern.tracks.map((track, i) => (
            <div key={i} className="h-10 flex items-center justify-end pr-2 text-white text-sm font-semibold">
              {track.name}
            </div>
          ))}
        </div>

        <div className="flex gap-1">
          {[...Array(maxSteps)].map((_, step) => (
            <div key={step} className="flex flex-col gap-1">
              <div className={`text-xs text-center mb-1 ${step % 4 === 0 ? 'text-purple-400 font-bold' : 'text-gray-500'}`}>
                {step + 1}
              </div>
              {pattern.tracks.map((track, trackIdx) => {
                const char = track.pattern[step] || '.';
                const soundDef = sounds[track.name];

                // Parse note if this is a synth track
                let displayChar = char;
                let isNote = false;
                if (soundDef) {
                  const { note } = parseNoteAtPosition(track.pattern, step, soundDef);
                  if (note) {
                    isNote = true;
                    displayChar = char; // Show the original character (number or note)
                  }
                }

                // Drum track
                const isActive = char === 'X' || char === 'x';
                const isAccent = char === 'X';
                const isCurrent = step === currentStep && isPlaying;

                return (
                  <div
                    key={`${trackIdx}-${step}`}
                    className={`w-8 h-10 rounded border-2 transition-all flex items-center justify-center text-xs font-mono ${
                      isCurrent
                        ? 'border-purple-400 bg-purple-400/50'
                        : isNote
                        ? 'bg-blue-500 border-blue-600 text-white'
                        : isActive
                        ? isAccent
                          ? 'bg-purple-500 border-purple-600'
                          : 'bg-purple-400/60 border-purple-500'
                        : step % 4 === 0
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-gray-800/50 border-gray-700/50'
                    }`}
                  >
                    {isNote ? <span className="text-[10px] font-bold">{displayChar}</span> : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
