import { SoundDefinition } from '../parser/types';

// Synthesizer with ADSR envelope and filter
export const playSynth = (
  ctx: AudioContext,
  time: number,
  frequency: number,
  velocity: number,
  duration: number,
  soundDef: SoundDefinition
) => {
  const {
    waveform = 'sawtooth',
    filter = 'lowpass',
    cutoff = 1000,
    resonance = 1,
    attack = 0.01,
    decay = 0.1,
    sustain = 0.7,
    release = 0.1,
    volume = 0.3,
    delay = 0,
    delayFeedback = 0.3,
    delayMix = 0.5
  } = soundDef;

  // Oscillator
  const osc = ctx.createOscillator();
  osc.type = waveform;
  osc.frequency.value = frequency;

  // Filter
  const filterNode = ctx.createBiquadFilter();
  filterNode.type = filter;
  filterNode.frequency.value = cutoff;
  filterNode.Q.value = resonance;

  // Envelope (ADSR)
  const gainNode = ctx.createGain();
  const attackTime = time + attack;
  const decayTime = attackTime + decay;
  const releaseTime = time + duration;
  const endTime = releaseTime + release;

  // Apply volume to velocity
  const finalVelocity = velocity * volume;

  gainNode.gain.setValueAtTime(0, time);
  gainNode.gain.linearRampToValueAtTime(finalVelocity, attackTime);
  gainNode.gain.linearRampToValueAtTime(finalVelocity * sustain, decayTime);
  gainNode.gain.setValueAtTime(finalVelocity * sustain, releaseTime);
  gainNode.gain.linearRampToValueAtTime(0.001, endTime);

  // Delay effect setup
  if (delay > 0) {
    const delayNode = ctx.createDelay(5.0);
    delayNode.delayTime.value = delay;

    const feedbackNode = ctx.createGain();
    feedbackNode.gain.value = delayFeedback;

    const wetGain = ctx.createGain();
    wetGain.gain.value = delayMix;

    const dryGain = ctx.createGain();
    dryGain.gain.value = 1 - delayMix;

    // Delay feedback loop
    delayNode.connect(feedbackNode);
    feedbackNode.connect(delayNode);

    // Connect signal chain with delay
    osc.connect(filterNode);
    filterNode.connect(gainNode);

    // Split signal to dry and wet
    gainNode.connect(dryGain);
    gainNode.connect(delayNode);
    delayNode.connect(wetGain);

    // Merge and output
    dryGain.connect(ctx.destination);
    wetGain.connect(ctx.destination);
  } else {
    // No delay - simple connection
    osc.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);
  }

  // Schedule
  osc.start(time);
  osc.stop(endTime);
};
