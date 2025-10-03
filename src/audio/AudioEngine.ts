import { DrumType, DrumDefinition, SoundDefinition } from '../parser/types';
import { playKick, playSnare, playHiHat, playOpenHH, playClap } from './drums';

export class AudioEngine {
  private audioContext: AudioContext;
  private gainNodes: Record<string, GainNode> = {};
  private drumConfigs: Record<string, Partial<DrumDefinition>> = {};

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

  setDrumConfig(drumName: string, config: Partial<DrumDefinition>) {
    this.drumConfigs[drumName] = config;
  }

  setSoundDefinitions(sounds: Record<string, SoundDefinition>) {
    // Store drum configurations from sound definitions
    Object.entries(sounds).forEach(([name, def]) => {
      if (def.type === 'drum') {
        this.drumConfigs[name] = def;
      }
    });
  }

  playDrum(drumName: string, time: number, velocity: number) {
    const drumSounds: Record<string, (ctx: AudioContext, gain: GainNode, time: number, velocity: number, config?: Partial<DrumDefinition>) => void> = {
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
        const config = this.drumConfigs[drumName] || {};
        drumFunction(this.audioContext, gain, time, velocity, config);
      }
    }
  }

  close() {
    this.audioContext.close();
  }
}
