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

#### Synth Sounds
- `type`: 'synth' (optional, defaults to synth if omitted)
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
- `notes`: mapping of numbers 1-9 to specific notes/chords

#### Drum Sounds
- `type`: 'drum' (required for drum configuration)
- `volume`: 0-1 (amplitude level)
- **Kick-specific**:
  - `pitch`: Starting frequency (default: 150)
  - `pitchDecay`: Pitch sweep time (default: 0.5)
  - `decay`: Amplitude decay time (default: 0.5)
- **Snare-specific**:
  - `tone`: Oscillator frequency (default: 200)
  - `toneDecay`: Tone duration (default: 0.1)
  - `noiseMix`: 0-1, balance between noise and tone (default: 0.5)
  - `filterType`: lowpass, highpass, bandpass (default: highpass)
  - `filterCutoff`: Filter frequency (default: 1000)
  - `decay`: Overall decay time (default: 0.2)
- **HiHat/OpenHH-specific**:
  - `filterCutoff`: Filter frequency (default: 7000)
  - `decay`: Duration (default: 0.05 for HiHat, 0.3 for OpenHH)
- **Clap-specific**:
  - `filterCutoff`: Bandpass center frequency (default: 1500)
  - `filterQ`: Bandpass Q factor (default: 1)
  - `decay`: Burst duration (default: 0.05)
  - `burstCount`: Number of noise bursts (default: 3)
  - `burstSpacing`: Time between bursts in seconds (default: 0.01)

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

### Major Features (Latest)
- **Configurable Drum Synthesis**: Drums can now be customized via `# Sounds` section with parameters like pitch, decay, filter settings, etc.
- **MIDI Import/Export**: Full bidirectional MIDI file support for interoperability with DAWs and other music software
- **AI Pattern Generation**: LLM-powered pattern creation using Claude or GPT models with natural language prompts
- Split monolithic 868-line App.tsx into modular components
- Extracted audio, parsing, and UI logic into separate files
- Created reusable hooks and utilities

### Previous Features
- Chord support with `-` notation
- Delay effect with feedback and mix controls
- "Plucked Keys" and "Custom Drums" presets
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

## MIDI Import/Export

### Export to MIDI
- Click "Export MIDI" button to download current pattern as `.mid` file
- Maps drum tracks to General MIDI drum notes (channel 10)
- Preserves tempo and note information
- Supports chords and melodic patterns

### Import from MIDI
- Click "Import MIDI" to load a `.mid` file
- Automatically converts to markdown format
- Drum tracks mapped from General MIDI drum notes
- Melodic tracks use direct note notation (e.g., `c4`, `d#3`)

### MIDI Implementation Details
- Uses `@tonejs/midi` library for parsing/writing
- Drum mapping:
  - Kick: MIDI note 36 (Bass Drum 1)
  - Snare: MIDI note 38 (Acoustic Snare)
  - HiHat: MIDI note 42 (Closed Hi-Hat)
  - OpenHH: MIDI note 46 (Open Hi-Hat)
  - Clap: MIDI note 39 (Hand Clap)
- 16th-note resolution
- Supports velocity mapping (X vs x notation)

## AI Pattern Generation

### Overview
AI-powered pattern generation using OpenAI GPT to create musical patterns from natural language descriptions.

### Setup

#### Local Development
1. Copy `.env.example` to `.env.local`
2. Add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your-api-key-here
   ```
3. Restart dev server

#### Production (Vercel)
Add `VITE_OPENAI_API_KEY` as an environment variable in your Vercel project settings.

### Usage
Type a natural language prompt describing the pattern you want:
- "Create a techno pattern at 130 BPM"
- "Generate a funky bassline with drums"
- "Make a chill lofi beat"
- "Add a complex drum fill"

### How It Works
1. System prompt teaches LLM markdown music syntax
2. Current pattern sent as context
3. GPT generates new markdown pattern
4. Pattern automatically loaded into editor

### Alternative: Using Anthropic Claude
The codebase includes commented-out Anthropic integration. To use Claude:

1. Add to `.env.local`:
   ```
   VITE_ANTHROPIC_API_KEY=your-anthropic-key-here
   ```

2. In `src/ai/patternGenerator.ts`, uncomment the Anthropic code:
   ```typescript
   // Uncomment the generateWithAnthropic function
   // Replace the OpenAI call with:
   const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
   return await generateWithAnthropic(contextMessage, anthropicKey, 'claude-3-5-sonnet-20241022');
   ```

### Model Configuration
- **OpenAI**: Uses `gpt-4o-mini` by default (hardcoded in `patternGenerator.ts`)
- **Anthropic**: `claude-3-5-sonnet-20241022` (in commented code)
- To change models, edit `src/ai/patternGenerator.ts`

### Security
- Environment variables with `VITE_` prefix are exposed to client-side code
- For production, consider a server-side API proxy to protect keys
- Never commit `.env.local` to version control (already in `.gitignore`)

## Known Limitations
- Monophonic per track (except chords defined in note mappings)
- No pattern length adjustment (fixed by content)
- Delay feedback loop has no high-frequency damping (can get bright)
- API keys exposed to client-side code (use server proxy for production)
- MIDI import creates fixed-length patterns (no loop detection)

## Future Considerations
- More effect types (reverb, distortion, chorus)
- Swing/shuffle timing
- Multi-pattern arrangements
- Save/load user patterns to localStorage
- Audio recording/export to WAV
- Server-side API proxy for secure key management
- MIDI clock sync
- Multi-track arrangements with sections
