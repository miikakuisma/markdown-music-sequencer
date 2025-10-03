/**
 * AI-powered pattern generator
 * Uses OpenAI API by default (via environment variable)
 * Anthropic (Claude) support included as commented code for reference
 */

const SYSTEM_PROMPT = `You are a music composition assistant that generates patterns for a markdown-based music sequencer.

# Markdown Music Syntax

## Basic Structure
\`\`\`markdown
---
title: "Song Title"
tempo: 120
---

# Sounds
SoundName:
  type: synth
  waveform: sawtooth
  filter: lowpass
  cutoff: 800
  attack: 0.01
  decay: 0.1
  sustain: 0.7
  release: 0.1
  volume: 0.3
  notes:
    1: c2
    2: d#2
    3: g2

DrumName:
  type: drum
  pitch: 150
  decay: 0.5
  volume: 0.8

# Pattern
Kick:  x...x...x...x...
Snare: ....x.......x...
Bass:  1..23...1..23...
\`\`\`

## Pattern Notation
- **Drums**: \`X\` (accent), \`x\` (normal), \`.\` (rest)
- **Synth**: \`1-9\` (mapped notes), or direct notes like \`c3\`, \`d#3\`, \`eb4\`
- **Chords**: \`c2-e2-g2\` (multiple notes separated by \`-\`)
- **Pattern length**: Typically 16 steps (one bar in 16th notes)

## Drum Types
Available drums: Kick, Snare, HiHat, OpenHH, Clap

## Drum Parameters (when type: drum)
- \`pitch\`: Starting frequency (kick)
- \`tone\`: Oscillator frequency (snare)
- \`filterCutoff\`: Filter frequency
- \`decay\`: Overall decay time
- \`noiseMix\`: Balance between noise and tone (snare)
- \`volume\`: 0-1

## Synth Parameters (when type: synth)
- \`waveform\`: sine, square, sawtooth, triangle
- \`filter\`: lowpass, highpass, bandpass
- \`cutoff\`: 100-10000 Hz
- \`attack\`, \`decay\`, \`release\`: 0-5 seconds
- \`sustain\`: 0-1
- \`volume\`: 0-1
- \`delay\`, \`delayFeedback\`, \`delayMix\`: delay effect parameters

# Your Task
When the user requests a pattern:
1. Generate complete, valid markdown following the syntax above
2. Include appropriate # Sounds definitions if using synths or custom drums
3. Create musically coherent patterns
4. Ensure patterns are typically 16 steps long
5. Use proper tempo values (60-200 BPM typically)
6. Return ONLY the markdown, no explanations

# Examples

**Techno:**
\`\`\`markdown
---
title: "Techno Groove"
tempo: 128
---

# Pattern
Kick:  X...X...X...X...
HiHat: xxxxxxxxxxxxxxxx
Snare: ....X.......X...
\`\`\`

**Acid Bass:**
\`\`\`markdown
---
title: "Acid Line"
tempo: 130
---

# Sounds
Bass:
  waveform: sawtooth
  filter: lowpass
  cutoff: 600
  resonance: 12
  attack: 0.01
  decay: 0.2
  sustain: 0.1
  release: 0.1
  volume: 0.4
  notes:
    1: c2
    2: c3
    3: d#2
    4: g2

# Pattern
Kick: x...x...x...x...
Bass: 1.2.3.4.1.2.3...
\`\`\`
`;

/**
 * Generate a pattern using AI (OpenAI by default)
 */
export const generatePattern = async (
  userPrompt: string,
  currentMarkdown: string
): Promise<string> => {
  // Get API key from environment variable
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_OPENAI_API_KEY not found in environment variables');
  }

  // Build context message including current pattern if available
  const contextMessage = currentMarkdown
    ? `Current pattern for reference:\n\n${currentMarkdown}\n\nUser request: ${userPrompt}`
    : `User request: ${userPrompt}`;

  return await generateWithOpenAI(contextMessage, apiKey, 'gpt-4o-mini');

  // Anthropic alternative (uncomment to use Claude instead):
  // const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  // if (!anthropicKey) {
  //   throw new Error('VITE_ANTHROPIC_API_KEY not found in environment variables');
  // }
  // return await generateWithAnthropic(contextMessage, anthropicKey, 'claude-3-5-sonnet-20241022');
};

/**
 * Generate using Anthropic API (commented out - uncomment to use Claude)
 */
// async function generateWithAnthropic(
//   userMessage: string,
//   apiKey: string,
//   model: string
// ): Promise<string> {
//   const response = await fetch('https://api.anthropic.com/v1/messages', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'x-api-key': apiKey,
//       'anthropic-version': '2023-06-01',
//     },
//     body: JSON.stringify({
//       model: model,
//       max_tokens: 2000,
//       system: SYSTEM_PROMPT,
//       messages: [
//         {
//           role: 'user',
//           content: userMessage,
//         },
//       ],
//     }),
//   });
//
//   if (!response.ok) {
//     const error = await response.text();
//     throw new Error(`Anthropic API error: ${error}`);
//   }
//
//   const data = await response.json();
//   const generatedText = data.content[0].text;
//
//   return extractMarkdown(generatedText);
// }

/**
 * Generate using OpenAI API
 */
async function generateWithOpenAI(
  userMessage: string,
  apiKey: string,
  model: string
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  const generatedText = data.choices[0].message.content;

  return extractMarkdown(generatedText);
}

/**
 * Extract markdown from response (handles cases where AI wraps it in code blocks)
 */
function extractMarkdown(text: string): string {
  // Remove markdown code block wrapper if present
  const codeBlockMatch = text.match(/```markdown\n([\s\S]*?)\n```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // Remove generic code block wrapper
  const genericCodeBlockMatch = text.match(/```\n([\s\S]*?)\n```/);
  if (genericCodeBlockMatch) {
    return genericCodeBlockMatch[1].trim();
  }

  return text.trim();
}
