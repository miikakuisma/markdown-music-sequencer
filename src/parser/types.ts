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

export interface DrumDefinition {
  type: 'drum';
  drumType?: 'kick' | 'snare' | 'hihat' | 'openhh' | 'clap';

  // Common parameters
  volume?: number; // 0.0 to 1.0

  // Kick-specific
  pitch?: number; // Starting frequency (default: 150)
  pitchDecay?: number; // Pitch sweep time (default: 0.5)

  // Snare-specific
  tone?: number; // Oscillator frequency (default: 200)
  toneDecay?: number; // Tone duration (default: 0.1)
  noiseMix?: number; // 0-1, balance between noise and tone (default: 0.5)

  // Filter parameters (used by snare, hihat, clap)
  filterType?: 'lowpass' | 'highpass' | 'bandpass';
  filterCutoff?: number; // Filter frequency
  filterQ?: number; // Resonance/Q factor (default: 1)

  // Envelope
  decay?: number; // Overall decay time

  // Clap-specific
  burstCount?: number; // Number of noise bursts (default: 3)
  burstSpacing?: number; // Time between bursts in seconds (default: 0.01)
}

export interface SynthDefinition {
  type?: 'synth';
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

export type SoundDefinition = DrumDefinition | SynthDefinition;

export interface ParsedMarkdown {
  metadata: Metadata;
  patterns: Pattern[];
  sounds: Record<string, SoundDefinition>;
}

export type DrumType = 'kick' | 'snare' | 'hihat' | 'openhh' | 'clap';
