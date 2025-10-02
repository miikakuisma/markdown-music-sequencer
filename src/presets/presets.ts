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
    4: a#3

# Pattern
Kick:  x...x...x...x...
Bass:  1112111311121114
HiHat: ..x...x...x...x.`,

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
    4: g3-b3-d4

# Pattern
Kick:  x.......x.......
Snare: ....x.......x...
HiHat: ..x...x...x...x.
Keys:  1.....2.3.....4.`
};
