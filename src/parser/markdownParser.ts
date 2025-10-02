import { ParsedMarkdown, Metadata, SoundDefinition, Pattern } from './types';

export const parseMarkdown = (md: string): ParsedMarkdown => {
  try {
    const lines = md.split('\n');
    const metadata: Metadata = { tempo: 120, bars: 1 };
    const sounds: Record<string, SoundDefinition> = {};
    let inMetadata = false;
    let inSounds = false;
    let currentSoundName: string | null = null;
    const patterns: Pattern[] = [];
    let currentPattern: Pattern | null = null;

    for (const line of lines) {
      if (line === '---') {
        inMetadata = !inMetadata;
        continue;
      }

      if (inMetadata) {
        const [key, value] = line.split(':').map(s => s.trim());
        if (key && value) {
          const numValue = parseInt(value.replace(/"/g, ''));
          metadata[key] = isNaN(numValue) ? value.replace(/"/g, '') : numValue;
        }
      } else if (line.startsWith('# Sounds')) {
        inSounds = true;
        currentSoundName = null;
      } else if (line.startsWith('# ')) {
        inSounds = false;
        if (currentPattern) patterns.push(currentPattern);
        currentPattern = { name: line.slice(2).trim(), tracks: [] };
      } else if (inSounds) {
        // Parse sound definitions
        const trimmed = line.trim();

        if (line.match(/^\w+:$/) && !line.startsWith(' ')) {
          // New sound definition (no leading spaces, ends with :)
          currentSoundName = line.slice(0, -1).trim();
          sounds[currentSoundName] = {};
        } else if (currentSoundName && line.startsWith('  ')) {
          // Sound property (indented with 2+ spaces)
          if (trimmed === 'notes:') {
            // Start parsing note mappings
            sounds[currentSoundName].notes = {};
          } else if (sounds[currentSoundName].notes && trimmed.match(/^\d+:/)) {
            // Parse note mapping like "1: c2"
            const [num, note] = trimmed.split(':').map(s => s.trim());
            if (num && note) {
              sounds[currentSoundName].notes![num] = note;
            }
          } else if (trimmed.includes(':')) {
            const [key, value] = trimmed.split(':').map(s => s.trim());
            if (key && value) {
              const numValue = parseFloat(value);
              sounds[currentSoundName][key as keyof SoundDefinition] = isNaN(numValue) ? value as any : numValue as any;
            }
          }
        }
      } else if (currentPattern && line.includes(':')) {
        const [name, pattern] = line.split(':').map(s => s.trim());
        if (pattern && name) {
          currentPattern.tracks.push({ name, pattern });
        }
      }
    }

    if (currentPattern && currentPattern.tracks.length > 0) {
      patterns.push(currentPattern);
    }

    return { metadata, patterns, sounds };
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return { metadata: { tempo: 120, bars: 1 }, patterns: [], sounds: {} };
  }
};
