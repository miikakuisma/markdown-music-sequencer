export const presets: Record<string, string> = {
  rock: `---
title: "Rock Beat"
tempo: 120
bars: 1
---

# Pattern
Kick:  X...X...X...X...
Snare: ....X.......X...
HiHat: x.x.x.x.x.x.x.x.
OpenHH: ......x.......x.
Clap:  ................`,

  hiphop: `---
title: "Hip-Hop Boom Bap"
tempo: 90
bars: 1
---

# Pattern
Kick:  X.......X.......
Snare: ....X.......X...
HiHat: ..x...x...x...x.
OpenHH: ................
Clap:  ....x.......x...`,

  techno: `---
title: "Techno 4/4"
tempo: 128
bars: 1
---

# Pattern
Kick:  X...X...X...X...
Snare: ................
HiHat: xxxxxxxxxxxxxxxx
OpenHH: ......X.......X.
Clap:  ....X.......X...`,

  acidhouse: `---
title: "Acid House"
tempo: 128
---

# Pattern
Kick:  x...x...x...x...
Bass:  1112111311121114
HiHat: ..x...x...x...x.

# Sounds
Bass:
  waveform: sawtooth
  filter: lowpass
  cutoff: 800
  resonance: 8
  attack: 0.01
  decay: 0.1
  sustain: 0.1
  release: 0.1
  volume: 0.4
  notes:
    1: c2
    2: d#2
    3: g2
    4: a#3`,

  breakbeat: `---
title: "Breakbeat"
tempo: 140
bars: 1
---

# Pattern
Kick:  X.....X.X.......
Snare: ....X.......X.X.
HiHat: x.x.x.x.x.x.x.x.
OpenHH: ..............x.
Clap:  ................`,

  pluckkeys: `---
title: "Plucked Keys"
tempo: 95
---

# Pattern
Kick:  x.......x.......
Snare: ....x.......x...
HiHat: ..x...x...x...x.
Keys:  1.....2.3.....4.

# Sounds
Keys:
  waveform: triangle
  filter: lowpass
  cutoff: 3000
  resonance: 1
  attack: 0.005
  decay: 0.3
  sustain: 0.2
  release: 0.8
  volume: 0.35
  delay: 0.375
  delayFeedback: 0.4
  delayMix: 0.35
  notes:
    1: c4-e4-g4
    2: a3-c4-e4
    3: f3-a3-c4
    4: g3-b3-d4`,

  customdrums: `---
title: "Custom Drums"
tempo: 120
---

# Pattern
Kick:  X...X...X...X...
Snare: ....X.......X...
HiHat: x.x.x.x.x.x.x.x.
Clap:  ....x.......x...

# Sounds
Kick:
  type: drum
  pitch: 80
  decay: 0.8
  volume: 0.9

Snare:
  type: drum
  tone: 150
  filterCutoff: 2000
  decay: 0.15
  noiseMix: 0.7
  volume: 0.7

HiHat:
  type: drum
  filterCutoff: 9000
  decay: 0.04
  volume: 0.5

Clap:
  type: drum
  filterCutoff: 2000
  filterQ: 2
  burstCount: 4
  burstSpacing: 0.008
  decay: 0.06
  volume: 0.8`
};
