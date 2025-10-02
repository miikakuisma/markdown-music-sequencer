# Markdown Music Sequencer - Claude Context

## Project Overview
A web-based music sequencer that uses markdown syntax to create drum patterns and synthesizer sequences. Built with React, TypeScript, and the Web Audio API.

## Architecture

### File Structure
```
src/
├── App.tsx                      # Main application component
├── main.tsx                     # Entry point
├── components/
│   ├── Controls.tsx             # Playback controls and preset buttons
│   ├── GridView.tsx             # Visual step sequencer grid
│   ├── MarkdownEditor.tsx       # Textarea for editing patterns
│   └── NotationGuide.tsx        # Help section with syntax examples
├── audio/
│   ├── AudioEngine.ts           # Manages AudioContext and gain nodes
│   ├── drums.ts                 # Drum synthesis functions (kick, snare, hihat, etc.)
│   ├── synth.ts                 # Synthesizer with ADSR, filter, and delay
│   └── noteUtils.ts             # Note parsing and frequency conversion
├── parser/
│   ├── types.ts                 # TypeScript interfaces
│   └── markdownParser.ts        # Parses markdown into patterns and sounds
├── hooks/
│   └── useSequencer.ts          # Playback state and timing logic
└── presets/
    └── presets.ts               # Pre-made patterns (rock, techno, pluckkeys, etc.)
```

## Markdown Syntax

### Basic Structure
```markdown
---
title: "Song Title"
tempo: 120
---

# Sounds
SoundName:
  waveform: sawtooth
  filter: lowpass
  cutoff: 800
  attack: 0.01
  decay: 0.1
  sustain: 0.7
  release: 0.1
  volume: 0.3
  delay: 0.375
  delayFeedback: 0.4
  delayMix: 0.35
  notes:
    1: c2
    2: d#2
    3: c2-e2-g2  # Chord notation

# Pattern
Kick:  x...x...x...x...
Snare: ....x.......x...
Bass:  1..23...1..24...
```

### Pattern Notation
- **Drums**: `X` (accent), `x` (normal), `.` (rest)
- **Synth**: `1-9` (mapped notes), `c3`, `d#3`, `eb4` (direct notes)
- **Chords**: `c2-e2-g2` (multiple notes separated by `-`)

### Sound Properties
- `waveform`: sine, square, sawtooth, triangle
- `filter`: lowpass, highpass, bandpass
- `cutoff`: 100-10000 Hz
- `resonance`: 1-20 Q factor
- `attack`, `decay`, `release`: 0-5 seconds
- `sustain`: 0-1 (amplitude level)
- `volume`: 0-1
- `delay`: 0-1 seconds (delay time)
- `delayFeedback`: 0-1 (echo repeats)
- `delayMix`: 0-1 (wet/dry balance)

## Key Features

### Audio Engine
- Web Audio API-based synthesis
- Drum sounds: kick (sine sweep), snare (filtered noise + tone), hihat (short noise), clap (burst noise)
- Synth engine with ADSR envelope, biquad filter, and delay effect
- Chord support (polyphony via multiple oscillators)

### Sequencer
- 16th-note resolution
- Pattern length adapts to longest track
- Real-time playback with visual feedback
- Tempo-synced timing

### Presets
- Auto-generated buttons from preset data
- Visual categorization: synth presets (purple/pink gradient), drum presets (blue/cyan gradient)
- Preset titles extracted from markdown metadata

## Development Notes

### Adding New Presets
1. Add entry to `src/presets/presets.ts`
2. Button automatically appears with correct color coding
3. Title pulled from markdown `title:` metadata

### Adding New Drum Sounds
1. Create synthesis function in `src/audio/drums.ts`
2. Add to `AudioEngine.ts` drum mapping
3. Reference by track name in patterns

### Adding Sound Parameters
1. Update `SoundDefinition` interface in `src/parser/types.ts`
2. Add parsing logic in `src/parser/markdownParser.ts`
3. Implement in `src/audio/synth.ts`

## Recent Changes

### Refactoring (Latest)
- Split monolithic 868-line App.tsx into modular components
- Extracted audio, parsing, and UI logic into separate files
- Created reusable hooks and utilities

### Features Added
- Chord support with `-` notation
- Delay effect with feedback and mix controls
- "Plucked Keys" preset with ambient delay
- Dynamic preset button generation
- Improved UI with gradient header and badges

## Technical Decisions

### Why Web Audio API?
- Native browser support, no external libraries needed
- Low-latency synthesis and scheduling
- Fine-grained control over sound parameters

### Why Markdown?
- Human-readable format
- Easy to edit and share
- Natural representation of step sequences
- Supports metadata and structured data

### Timing Architecture
- Uses `setInterval` for tick scheduling
- Audio scheduled at `AudioContext.currentTime`
- Pattern loops automatically based on length

## Known Limitations
- Monophonic per track (except chords defined in note mappings)
- No MIDI import/export yet (planned)
- No pattern length adjustment (fixed by content)
- Delay feedback loop has no high-frequency damping (can get bright)

## Future Considerations
- MIDI file import/export
- More effect types (reverb, distortion, chorus)
- Swing/shuffle timing
- Multi-pattern arrangements
- Save/load user patterns to localStorage
- Audio recording/export to WAV
