const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { addMethods } = require('../../utils/toResponse');

const UserDataSchema = new Schema(
  {
    learningWords: {
      type: [String],
      default: []
    },
    hardWords: {
      type: [String],
      default: []
    },
    deletedWords: {
      type: [String],
      default: []
    }
  },
  { collection: 'userData' }
);

addMethods(UserDataSchema);

module.exports = mongoose.model('UserData', UserDataSchema);
