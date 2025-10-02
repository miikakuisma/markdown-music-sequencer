import { DrumType } from '../parser/types';
import { playKick, playSnare, playHiHat, playOpenHH, playClap } from './drums';

export class AudioEngine {
  private audioContext: AudioContext;
  private gainNodes: Record<string, GainNode> = {};

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.initializeGainNodes();
  }

  private initializeGainNodes() {
    // Create gain nodes for each drum
    (['kick', 'snare', 'hihat', 'openhh', 'clap'] as DrumType[]).forEach(drum => {
      const gain = this.audioContext.createGain();
      gain.connect(this.audioContext.destination);
      this.gainNodes[drum] = gain;
    });
  }

  getContext(): AudioContext {
    return this.audioContext;
  }

  getDrumGainNode(drumType: string): GainNode | undefined {
    return this.gainNodes[drumType];
  }

  playDrum(drumName: string, time: number, velocity: number) {
    const drumSounds: Record<string, (ctx: AudioContext, gain: GainNode, time: number, velocity: number) => void> = {
      'Kick': playKick,
      'Snare': playSnare,
      'HiHat': playHiHat,
      'OpenHH': playOpenHH,
      'Clap': playClap
    };

    const drumFunction = drumSounds[drumName];
    if (drumFunction) {
      const gain = this.gainNodes[drumName.toLowerCase()];
      if (gain) {
        drumFunction(this.audioContext, gain, time, velocity);
      }
    }
  }

  close() {
    this.audioContext.close();
  }
}
