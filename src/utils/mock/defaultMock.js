const defaultSettings = {
  wordsPerDay: 10,
  optional: {
    maxWords: 15,
    translation: true,
    explantation: true,
    exampleText: false,
    transcription: false,
    association: false
  }
};

const game = {
  words: [],
  totalGamesCompleted: 0,
  errorRatePercent: 0
};

const defaultStatistics = {
  learnedWords: 0,
  optional: {
    speakit: game,
    audiocall: game,
    'english-puzzle': game,
    sprint: game,
    savannah: game,
    'own-game': game
  }
};

module.exports = { defaultSettings, defaultStatistics };
