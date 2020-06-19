const UserData = require('./userData.model');
const { NOT_FOUND_ERROR } = require('../../errors/appErrors');

const get = async userId => {
  const userData = await UserData.findOne({ _id: userId });
  if (!userData) {
    throw new NOT_FOUND_ERROR('Cannot find user data');
  }
  return userData;
};

const set = async userId => {
  return await UserData.create({ _id: userId });
};

const update = async (userId, body) =>
  await UserData.findOneAndUpdate(
    { _id: userId },
    { $set: body },
    { upsert: true, new: true }
  );

const remove = async userId => await UserData.deleteOne({ _id: userId });

module.exports = { get, set, update, remove };
