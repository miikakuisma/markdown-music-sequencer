import { Midi } from '@tonejs/midi';
import { parseMarkdown } from '../parser/markdownParser';
import { SynthDefinition } from '../parser/types';

/**
 * Convert markdown pattern to MIDI file
 */
export const markdownToMidi = (markdown: string): Uint8Array => {
  const { metadata, patterns, sounds } = parseMarkdown(markdown);

  if (patterns.length === 0) {
    throw new Error('No patterns found in markdown');
  }

  const midi = new Midi();
  midi.header.setTempo(metadata.tempo || 120);

  const pattern = patterns[0];
  const stepDuration = (60 / (metadata.tempo || 120)) / 4; // 16th note duration in seconds

  // Create a track for each pattern track
  pattern.tracks.forEach(track => {
    const soundDef = sounds[track.name];
    const midiTrack = midi.addTrack();
    midiTrack.name = track.name;

    // Determine if this is a drum track or synth track
    const isDrum = !soundDef || soundDef.type === 'drum';

    if (isDrum) {
      // Drum track - use MIDI channel 10 (drums)
      midiTrack.channel = 9; // MIDI channels are 0-indexed, so 9 = channel 10

      // Map drum names to MIDI drum notes (General MIDI)
      const drumNoteMap: Record<string, number> = {
        'Kick': 36,    // Bass Drum 1
        'Snare': 38,   // Acoustic Snare
        'HiHat': 42,   // Closed Hi-Hat
        'OpenHH': 46,  // Open Hi-Hat
        'Clap': 39,    // Hand Clap
      };

      const drumNote = drumNoteMap[track.name] || 38;

      // Parse pattern and add notes
      for (let i = 0; i < track.pattern.length; i++) {
        const char = track.pattern[i];
        if (char === 'X' || char === 'x') {
          const time = i * stepDuration;
          const velocity = char === 'X' ? 1.0 : 0.6;
          midiTrack.addNote({
            midi: drumNote,
            time: time,
            duration: 0.1,
            velocity: velocity
          });
        }
      }
    } else {
      // Synth track
      const synthDef = soundDef as SynthDefinition;

      for (let i = 0; i < track.pattern.length; i++) {
        const char = track.pattern[i];

        if (char === '.' || char === ' ') continue;

        let note: string | undefined;

        // Number notation (1-9)
        if (char >= '1' && char <= '9') {
          note = synthDef.notes?.[char];
        }
        // Letter notation (handled directly)
        else if (char.match(/[a-g]/i)) {
          const remaining = track.pattern.substring(i);
          const noteMatch = remaining.match(/^([a-g][#b]?\d+)/i);
          if (noteMatch) {
            note = noteMatch[1];
          }
        }

        if (note) {
          const time = i * stepDuration;
          const duration = stepDuration;

          // Handle chords (notes separated by '-')
          const chordNotes = note.split('-');
          chordNotes.forEach(singleNote => {
            midiTrack.addNote({
              name: singleNote.trim(),
              time: time,
              duration: duration,
              velocity: 0.7
            });
          });
        }
      }
    }
  });

  return midi.toArray();
};

/**
 * Convert MIDI file to markdown pattern
 */
export const midiToMarkdown = (midiData: ArrayBuffer): string => {
  const midi = new Midi(midiData);

  // Extract tempo
  const tempo = Math.round(midi.header.tempos[0]?.bpm || 120);

  // Calculate step resolution (16th notes)
  const stepDuration = (60 / tempo) / 4;

  // Find the length of the pattern (round to nearest 16 steps)
  let maxTime = 0;
  midi.tracks.forEach(track => {
    track.notes.forEach(note => {
      const endTime = note.time + note.duration;
      if (endTime > maxTime) maxTime = endTime;
    });
  });

  const numSteps = Math.ceil(maxTime / stepDuration);
  const patternLength = Math.ceil(numSteps / 16) * 16; // Round to nearest 16

  // General MIDI drum note mapping (reverse)
  const drumNoteToName: Record<number, string> = {
    36: 'Kick',
    38: 'Snare',
    42: 'HiHat',
    46: 'OpenHH',
    39: 'Clap',
  };

  let markdown = `---
title: "Imported MIDI"
tempo: ${tempo}
---

# Pattern
`;

  // Process each MIDI track
  midi.tracks.forEach((track, trackIndex) => {
    const isDrum = track.channel === 9; // MIDI channel 10 (0-indexed = 9)

    if (isDrum) {
      // Group drum notes by pitch
      const notesByPitch: Record<number, any[]> = {};
      track.notes.forEach(note => {
        const pitch = note.midi;
        if (!notesByPitch[pitch]) notesByPitch[pitch] = [];
        notesByPitch[pitch].push(note);
      });

      // Create a track for each drum pitch
      Object.entries(notesByPitch).forEach(([pitch, notes]) => {
        const drumName = drumNoteToName[parseInt(pitch)] || `Drum${pitch}`;
        const pattern = Array(patternLength).fill('.');

        notes.forEach(note => {
          const step = Math.round(note.time / stepDuration);
          if (step < patternLength) {
            pattern[step] = note.velocity > 0.8 ? 'X' : 'x';
          }
        });

        markdown += `${drumName}: ${pattern.join('')}\n`;
      });
    } else {
      // Synth/melodic track
      const trackName = track.name || `Track${trackIndex + 1}`;
      const pattern = Array(patternLength).fill('.');

      track.notes.forEach(note => {
        const step = Math.round(note.time / stepDuration);
        if (step < patternLength) {
          // Use note name directly (e.g., "C4", "D#3")
          pattern[step] = note.name.toLowerCase();
        }
      });

      markdown += `${trackName}: ${pattern.join('')}\n`;
    }
  });

  return markdown;
};
