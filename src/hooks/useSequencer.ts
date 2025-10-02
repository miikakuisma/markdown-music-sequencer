import { useState, useRef, useEffect } from 'react';
import { AudioEngine } from '../audio/AudioEngine';
import { parseMarkdown } from '../parser/markdownParser';
import { noteToFrequency, parseNoteAtPosition } from '../audio/noteUtils';
import { playSynth } from '../audio/synth';

export const useSequencer = (markdown: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const intervalRef = useRef<number | null>(null);
  const markdownRef = useRef(markdown);

  useEffect(() => {
    markdownRef.current = markdown;
  }, [markdown]);

  useEffect(() => {
    audioEngineRef.current = new AudioEngine();

    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const play = () => {
    setIsPlaying(true);
    setCurrentStep(0);

    let step = 0;

    const tick = () => {
      const { metadata, patterns, sounds } = parseMarkdown(markdownRef.current);
      if (patterns.length === 0) return;

      const pattern = patterns[0];
      const tempo = metadata.tempo;
      const stepDuration = (60 / tempo) / 4;
      const maxSteps = Math.max(...pattern.tracks.map(t => t.pattern.length));

      const engine = audioEngineRef.current;
      if (!engine) return;

      const ctx = engine.getContext();
      const now = ctx.currentTime;

      pattern.tracks.forEach(track => {
        const currentPos = step % track.pattern.length;
        const soundDef = sounds[track.name];

        if (soundDef) {
          // Synth/Bass track with note data
          const { note } = parseNoteAtPosition(track.pattern, currentPos, soundDef);

          if (note) {
            // All notes take 1 tick duration
            const duration = stepDuration;

            // Check if it's a chord (notes separated by '-')
            const chordNotes = note.split('-');

            // Play each note in the chord
            chordNotes.forEach(singleNote => {
              const freq = noteToFrequency(singleNote.trim());
              if (freq) {
                playSynth(ctx, now, freq, 0.3, duration, soundDef);
              }
            });
          }
        } else {
          // Drum track
          const char = track.pattern[currentPos];
          if (char === 'X') {
            engine.playDrum(track.name, now, 1.0);
          } else if (char === 'x') {
            engine.playDrum(track.name, now, 0.6);
          }
        }
      });

      step = (step + 1) % maxSteps;
      setCurrentStep(step);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(() => {
        tick();
      }, stepDuration * 1000);
    };

    tick();
  };

  const stop = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    setCurrentStep(0);
  };

  return {
    isPlaying,
    currentStep,
    play,
    stop,
    reset
  };
};
