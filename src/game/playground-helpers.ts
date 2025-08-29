// playground-helpers.ts

export const RESULT_QUOTES = [
  [
    'Not quite right!',
    'You missed the mark!',
    'Have you seen an angle before?',
    'Your measurements are all over the place!',
    'Your precision needs work!',
  ],
  [
    'Not too shabby.',
    'Getting sharper, keep it up!',
    'Not perfect, but getting better!',
  ],
  [
    'Your angles are on point!',
    'Your precision is unparalleled!',
    'Your geometric skills are divine!',
    "Amazing! You're acute-y!",
    'Wow! So precise!',
  ],
];

export const CHANGING_QUOTES = [
  ["I'm such a-cute-y!", "I'm a tiny slice of pi!", "You're doing great!"],
  ["I'm wide open!", 'Keep going!', 'Wow!', 'Wheee!!'],
  [
    "I'm so obtuse!",
    'The bigger the better!',
    "Life's too short for right angles!",
    'Whoa!',
  ],
];

/**
 * Get a random changing quote based on the rotation value
 * @param rotateValue current angle
 * @returns a random quote string
 */
export function getChangingQuote(rotateValue: number): string {
  let possibleQuotes = CHANGING_QUOTES[1];

  if (rotateValue < 110) {
    possibleQuotes = CHANGING_QUOTES[0];
  } else if (rotateValue >= 230) {
    possibleQuotes = CHANGING_QUOTES[2];
  }

  const randomQuoteIndex = Math.floor(Math.random() * possibleQuotes.length);
  return possibleQuotes[randomQuoteIndex];
}

/**
 * Get a result quote based on the accuracy percentage
 * @param accuracy accuracy percentage
 * @returns a random result quote
 */
export function getResultQuote(accuracy: number): string {
  let possibleQuotes = RESULT_QUOTES[1];

  if (accuracy < 50) {
    possibleQuotes = RESULT_QUOTES[0];
  } else if (accuracy >= 85) {
    possibleQuotes = RESULT_QUOTES[2];
  }

  const randomQuoteIndex = Math.floor(Math.random() * possibleQuotes.length);
  return possibleQuotes[randomQuoteIndex];
}
