import { DrumDefinition } from '../parser/types';

export const playKick = (
  ctx: AudioContext,
  gainNode: GainNode,
  time: number,
  velocity: number,
  config: Partial<DrumDefinition> = {}
) => {
  const pitch = config.pitch ?? 150;
  const pitchDecay = config.pitchDecay ?? 0.5;
  const decay = config.decay ?? 0.5;
  const volume = config.volume ?? 1.0;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(gainNode);

  osc.frequency.setValueAtTime(pitch, time);
  osc.frequency.exponentialRampToValueAtTime(0.01, time + pitchDecay);

  gain.gain.setValueAtTime(velocity * volume, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + decay);

  osc.start(time);
  osc.stop(time + decay);
};

export const playSnare = (
  ctx: AudioContext,
  gainNode: GainNode,
  time: number,
  velocity: number,
  config: Partial<DrumDefinition> = {}
) => {
  const tone = config.tone ?? 200;
  const toneDecay = config.toneDecay ?? 0.1;
  const filterType = config.filterType ?? 'highpass';
  const filterCutoff = config.filterCutoff ?? 1000;
  const decay = config.decay ?? 0.2;
  const noiseMix = config.noiseMix ?? 0.5;
  const volume = config.volume ?? 1.0;

  const noiseDuration = decay;

  // Noise component
  const noise = ctx.createBufferSource();
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * noiseDuration, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < output.length; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  noise.buffer = noiseBuffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = filterType;
  noiseFilter.frequency.value = filterCutoff;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(velocity * noiseMix * volume, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + noiseDuration);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(gainNode);

  // Tone component
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.frequency.value = tone;
  oscGain.gain.setValueAtTime(velocity * (1 - noiseMix) * volume, time);
  oscGain.gain.exponentialRampToValueAtTime(0.01, time + toneDecay);

  osc.connect(oscGain);
  oscGain.connect(gainNode);

  noise.start(time);
  noise.stop(time + noiseDuration);
  osc.start(time);
  osc.stop(time + toneDecay);
};

export const playHiHat = (
  ctx: AudioContext,
  gainNode: GainNode,
  time: number,
  velocity: number,
  config: Partial<DrumDefinition> = {}
) => {
  const filterCutoff = config.filterCutoff ?? 7000;
  const decay = config.decay ?? 0.05;
  const volume = config.volume ?? 1.0;

  const noise = ctx.createBufferSource();
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * decay, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < output.length; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  noise.buffer = noiseBuffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = filterCutoff;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(velocity * volume, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + decay);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(gainNode);

  noise.start(time);
  noise.stop(time + decay);
};

export const playOpenHH = (
  ctx: AudioContext,
  gainNode: GainNode,
  time: number,
  velocity: number,
  config: Partial<DrumDefinition> = {}
) => {
  const filterCutoff = config.filterCutoff ?? 7000;
  const decay = config.decay ?? 0.3;
  const volume = config.volume ?? 1.0;

  const noise = ctx.createBufferSource();
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * decay, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < output.length; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  noise.buffer = noiseBuffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = filterCutoff;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(velocity * volume, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + decay);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(gainNode);

  noise.start(time);
  noise.stop(time + decay);
};

export const playClap = (
  ctx: AudioContext,
  gainNode: GainNode,
  time: number,
  velocity: number,
  config: Partial<DrumDefinition> = {}
) => {
  const filterCutoff = config.filterCutoff ?? 1500;
  const filterQ = config.filterQ ?? 1;
  const decay = config.decay ?? 0.05;
  const burstCount = config.burstCount ?? 3;
  const burstSpacing = config.burstSpacing ?? 0.01;
  const volume = config.volume ?? 1.0;

  // Multiple short bursts of noise to simulate hand clap
  const offsets = Array.from({ length: burstCount }, (_, i) => i * burstSpacing);

  offsets.forEach(offset => {
    const noise = ctx.createBufferSource();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * decay, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < output.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = filterCutoff;
    noiseFilter.Q.value = filterQ;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(velocity * volume, time + offset);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + offset + decay);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(gainNode);

    noise.start(time + offset);
    noise.stop(time + offset + decay);
  });
};
