export const playKick = (ctx: AudioContext, gainNode: GainNode, time: number, velocity: number) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(gainNode);

  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);

  gain.gain.setValueAtTime(velocity, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

  osc.start(time);
  osc.stop(time + 0.5);
};

export const playSnare = (ctx: AudioContext, gainNode: GainNode, time: number, velocity: number) => {
  const noise = ctx.createBufferSource();
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < output.length; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  noise.buffer = noiseBuffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1000;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(velocity * 0.4, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(gainNode);

  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.frequency.value = 200;
  oscGain.gain.setValueAtTime(velocity * 0.3, time);
  oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

  osc.connect(oscGain);
  oscGain.connect(gainNode);

  noise.start(time);
  noise.stop(time + 0.2);
  osc.start(time);
  osc.stop(time + 0.1);
};

export const playHiHat = (ctx: AudioContext, gainNode: GainNode, time: number, velocity: number) => {
  const noise = ctx.createBufferSource();
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < output.length; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  noise.buffer = noiseBuffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 7000;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(velocity * 0.3, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(gainNode);

  noise.start(time);
  noise.stop(time + 0.05);
};

export const playOpenHH = (ctx: AudioContext, gainNode: GainNode, time: number, velocity: number) => {
  const noise = ctx.createBufferSource();
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < output.length; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  noise.buffer = noiseBuffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 7000;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(velocity * 0.4, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(gainNode);

  noise.start(time);
  noise.stop(time + 0.3);
};

export const playClap = (ctx: AudioContext, gainNode: GainNode, time: number, velocity: number) => {
  // Multiple short bursts of noise to simulate hand clap
  [0, 0.01, 0.02].forEach(offset => {
    const noise = ctx.createBufferSource();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < output.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1500;
    noiseFilter.Q.value = 1;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(velocity * 0.3, time + offset);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + offset + 0.05);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(gainNode);

    noise.start(time + offset);
    noise.stop(time + offset + 0.05);
  });
};
