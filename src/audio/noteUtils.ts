import { SoundDefinition } from '../parser/types';

// Note to frequency converter
export const noteToFrequency = (note: string): number | null => {
  // Parse note format: c2, d#3, eb4, etc.
  const noteMatch = note.toLowerCase().match(/^([a-g])([#b]?)(\d+)$/);
  if (!noteMatch) return null;

  const [, noteName, accidental, octaveStr] = noteMatch;
  const octave = parseInt(octaveStr);

  // Note to semitone mapping (C = 0)
  const noteMap: Record<string, number> = {
    'c': 0, 'd': 2, 'e': 4, 'f': 5, 'g': 7, 'a': 9, 'b': 11
  };

  let semitone = noteMap[noteName];
  if (accidental === '#') semitone += 1;
  if (accidental === 'b') semitone -= 1;

  // Calculate frequency: A4 = 440Hz is our reference
  // A4 is octave 4, note A (semitone 9)
  const a4Semitone = 4 * 12 + 9; // 57
  const noteSemitone = octave * 12 + semitone;
  const semitoneDiff = noteSemitone - a4Semitone;

  return 440 * Math.pow(2, semitoneDiff / 12);
};

// Parse note from pattern - handles both letter notation (c3, d#3) and number notation (1, 2, 3)
// Returns chord notes separated by '-' if chord is defined (e.g., "c2-e2-g2")
export const parseNoteAtPosition = (
  pattern: string,
  position: number,
  soundDef?: SoundDefinition
): { note: string | null; length: number } => {
  const char = pattern[position];
  if (!char || char === '.' || char === ' ') {
    return { note: null, length: 1 };
  }

  // Check if it's a number (1-9)
  if (char >= '1' && char <= '9') {
    // Map number to note (or chord) using sound definition
    const mappedNote = soundDef?.notes?.[char];
    if (mappedNote) {
      return { note: mappedNote, length: 1 };
    }
    return { note: null, length: 1 };
  }

  // Parse letter note format (c3, d#3, eb4, etc.)
  const remaining = pattern.substring(position);
  const noteMatch = remaining.match(/^([a-g][#b]?\d+)/i);
  if (noteMatch) {
    return { note: noteMatch[1], length: noteMatch[1].length };
  }

  return { note: null, length: 1 };
};
