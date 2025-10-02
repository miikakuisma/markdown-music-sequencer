export interface Track {
  name: string;
  pattern: string;
}

export interface Pattern {
  name: string;
  tracks: Track[];
}

export interface Metadata {
  tempo: number;
  bars: number;
  [key: string]: string | number;
}

export interface SoundDefinition {
  waveform?: 'sine' | 'square' | 'sawtooth' | 'triangle';
  filter?: 'lowpass' | 'highpass' | 'bandpass';
  cutoff?: number;
  resonance?: number;
  attack?: number;
  decay?: number;
  sustain?: number;
  release?: number;
  volume?: number; // 0.0 to 1.0
  notes?: Record<string, string>; // Map numbers to notes, e.g., { "1": "c3", "2": "d3" }
  delay?: number; // Delay time in seconds (0-1)
  delayFeedback?: number; // Delay feedback amount (0-1)
  delayMix?: number; // Delay wet/dry mix (0-1)
}

export interface ParsedMarkdown {
  metadata: Metadata;
  patterns: Pattern[];
  sounds: Record<string, SoundDefinition>;
}

export type DrumType = 'kick' | 'snare' | 'hihat' | 'openhh' | 'clap';
