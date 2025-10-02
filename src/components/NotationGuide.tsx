import React from 'react';

export const NotationGuide: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Notation Guide</h2>
      <div className="space-y-4 text-gray-300">
        <div>
          <p className="font-semibold text-purple-400 mb-2">Drum Symbols:</p>
          <div className="bg-gray-900 p-3 rounded font-mono text-sm space-y-1">
            <div><span className="text-purple-400">X</span> = Accented hit (loud)</div>
            <div><span className="text-purple-400">x</span> = Normal hit (soft)</div>
            <div><span className="text-purple-400">.</span> = Rest (silence)</div>
          </div>
        </div>

        <div>
          <p className="font-semibold text-purple-400 mb-2">Synth/Bass Notes:</p>
          <div className="bg-gray-900 p-3 rounded text-sm space-y-1">
            <div><span className="text-blue-400">1-9</span> = Play mapped note (define in # Sounds)</div>
            <div><span className="text-blue-400">c3, d#3, eb4</span> = Play note directly</div>
            <div><span className="text-blue-400">c2-e2-g2</span> = Play chord (use - to separate notes)</div>
            <div>Each note/number takes 1 tick</div>
          </div>
        </div>

        <div>
          <p className="font-semibold text-purple-400 mb-2">Sound Definition:</p>
          <div className="bg-gray-900 p-3 rounded font-mono text-xs">
            # Sounds<br/>
            Bass:<br/>
            &nbsp;&nbsp;waveform: sawtooth<br/>
            &nbsp;&nbsp;volume: 0.4<br/>
            &nbsp;&nbsp;cutoff: 800<br/>
            &nbsp;&nbsp;notes:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;1: c2<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;2: d#2<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;3: c2-e2-g2
          </div>
        </div>

        <div>
          <p className="font-semibold text-purple-400 mb-2">Example:</p>
          <div className="bg-gray-900 p-3 rounded font-mono text-xs">
            Kick:  X...X...X...X...<br/>
            Bass:  1..23...1..24...<br/>
            HiHat: ..x...x...x...x.
          </div>
        </div>
      </div>
    </div>
  );
};
