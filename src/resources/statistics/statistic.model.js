const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { addMethods } = require('../../utils/toResponse');

const gameSchema = new mongoose.Schema({
  words: {
    type: [Object],
    default: []
  },
  totalGamesCompleted: {
    type: Number,
    default: 0
  },
  errorRatePercent: {
    type: Number,
    default: 0
  }
});

const StatisticSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    learnedWords: {
      type: Number,
      required: false,
      default: 0
    },
    optional: {
      type: Object,
      required: false,
      speakit: gameSchema,
      audiocall: gameSchema,
      'english-puzzle': gameSchema,
      sprint: gameSchema,
      savannah: gameSchema,
      'own-game': gameSchema
    }
  },
  { collection: 'statistic' }
);

addMethods(StatisticSchema);

module.exports = mongoose.model('Statistic', StatisticSchema);
