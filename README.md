# 🎵 Markdown Music Sequencer

A web-based music sequencer that lets you create beats and melodies using markdown syntax. Built with React, TypeScript, and the Web Audio API.

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge&logo=vercel)](https://markdown-music-sequencer.vercel.app/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-06B6D4?logo=tailwindcss&logoColor=white) ![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-native-orange)

## ✨ Features

- **Markdown-based notation** - Write music patterns in plain text
- **Visual step sequencer** - See your patterns come to life
- **Built-in synthesizers** - ADSR envelope, filters, and delay effects
- **Configurable drum synthesis** - Customize kick, snare, hi-hat, open hat, and clap parameters
- **Chord support** - Play multiple notes simultaneously
- **MIDI import/export** - Full interoperability with DAWs and music software
- **AI pattern generation** - Create patterns using natural language prompts (OpenAI GPT)
- **Preset library** - Rock, Hip-Hop, Techno, Acid House, and more
- **Export patterns** - Download your compositions as markdown or MIDI files

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment (for AI features)
cp .env.example .env.local
# Add your OpenAI API key to .env.local

# Start development server
npm run dev

# Build for production
npm run build
```

## 📝 Syntax Guide

### Basic Pattern

```markdown
---
title: "My Beat"
tempo: 120
---

# Pattern
Kick:  x...x...x...x...
Snare: ....x.......x...
HiHat: ..x...x...x...x.
```

### With Synthesizer

```markdown
---
title: "Bass Line"
tempo: 128
---

# Sounds
Bass:
  waveform: sawtooth
  filter: lowpass
  cutoff: 800
  resonance: 8
  attack: 0.01
  decay: 0.2
  sustain: 0.1
  release: 0.1
  volume: 0.4
  notes:
    1: c2
    2: d#2
    3: g2
    4: a#2

# Pattern
Kick:  x...x...x...x...
Bass:  1..23...1..24...
HiHat: ..x...x...x...x.
```

### With Chords

```markdown
# Sounds
Keys:
  waveform: triangle
  delay: 0.375
  delayFeedback: 0.4
  delayMix: 0.35
  notes:
    1: c4-e4-g4    # C major chord
    2: a3-c4-e4    # A minor chord
    3: f3-a3-c4    # F major chord

# Pattern
Keys: 1.....2.3.....4.
```

## 🎹 Notation Reference

### Drums
- `X` - Accented hit (loud)
- `x` - Normal hit (soft)
- `.` - Rest (silence)

### Notes
- `1-9` - Play mapped note (defined in Sounds section)
- `c3`, `d#3`, `eb4` - Play note directly
- `c2-e2-g2` - Play chord (notes separated by `-`)

### Sound Parameters

| Parameter | Range | Description |
|-----------|-------|-------------|
| `waveform` | sine, square, sawtooth, triangle | Oscillator shape |
| `filter` | lowpass, highpass, bandpass | Filter type |
| `cutoff` | 100-10000 | Filter frequency (Hz) |
| `resonance` | 1-20 | Filter resonance (Q) |
| `attack` | 0-5 | Attack time (seconds) |
| `decay` | 0-5 | Decay time (seconds) |
| `sustain` | 0-1 | Sustain level |
| `release` | 0-5 | Release time (seconds) |
| `volume` | 0-1 | Output volume |
| `delay` | 0-1 | Delay time (seconds) |
| `delayFeedback` | 0-1 | Delay feedback amount |
| `delayMix` | 0-1 | Delay wet/dry mix |

## 🎨 Presets

The sequencer comes with several built-in presets:

- **Rock Beat** - Classic rock drum pattern
- **Hip-Hop Boom Bap** - 90s hip-hop style
- **Techno 4/4** - Four-on-the-floor techno
- **Acid House** - 303-style bass line
- **Breakbeat** - Amen break-inspired rhythm
- **Plucked Keys** - Ambient keys with delay

## 🏗️ Project Structure

```
src/
├── components/        # React components
│   ├── Controls.tsx
│   ├── GridView.tsx
│   ├── MarkdownEditor.tsx
│   └── NotationGuide.tsx
├── audio/            # Audio engine & synthesis
│   ├── AudioEngine.ts
│   ├── drums.ts
│   ├── synth.ts
│   └── noteUtils.ts
├── parser/           # Markdown parsing
│   ├── markdownParser.ts
│   └── types.ts
├── hooks/            # React hooks
│   └── useSequencer.ts
├── presets/          # Preset patterns
│   └── presets.ts
└── App.tsx           # Main application
```

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Web Audio API** - Sound synthesis
- **Lucide React** - Icons

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 🎯 Roadmap

- [x] MIDI file import/export
- [x] AI pattern generation (OpenAI)
- [x] Configurable drum synthesis
- [ ] More effect types (reverb, distortion, chorus)
- [ ] Swing/shuffle timing
- [ ] Multi-pattern arrangements
- [ ] LocalStorage persistence
- [ ] Audio recording/WAV export
- [ ] Pattern length controls
- [ ] Server-side API proxy for secure key management

## 🙏 Acknowledgments

Built with the Web Audio API and inspired by classic drum machines and step sequencers.
