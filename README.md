# B2 iTEP Essential Reading — Turkish Workplace Edition

A configuration-driven React practice application containing three graded B2 workplace readings, untimed vocabulary preparation and 30 timed multiple-choice questions.

## Test flow

1. Entry B2 warm-up (timer paused)
2. Entry B2 reading (timer running)
3. Mid B2 warm-up (timer paused)
4. Mid B2 reading (timer running)
5. Standard B2 warm-up (timer paused)
6. Standard B2 reading (timer running)

Every warm-up contains flashcards, independently randomized word-to-meaning matching and a contextual gap-fill with a randomized word bank. Question options are randomized once per attempt.

## Technical design

- React 18, TypeScript, Vite 6 and Tailwind CSS 4
- Stable reading, vocabulary, gap-fill, question and option IDs
- Responses stored as `questionId → optionId`
- Displayed option order retained separately for audit/review
- Duration, instructions, navigation rules, randomization rules, scoring, thresholds and datasets controlled through `src/data/testData.ts`
- Automatic submission when reading time reaches zero
- Responsive split-screen reading interface

## Run locally

```bash
npm install
npm run dev
```

## Validate and build

```bash
npm run typecheck
npm run build
```

Production output is written to `dist/`. The Vite base path is relative, so the build can be hosted from a GitHub Pages repository subdirectory.

## Configure duration

Copy `.env.example` to `.env` and set:

```env
VITE_TEST_DURATION_SECONDS=1800
```

Never commit private credentials or API keys in `.env`.
