const Statistics = require('./statistic.model');
const { NOT_FOUND_ERROR } = require('../../errors/appErrors');

const get = async userId => {
  const statistic = await Statistics.findOne({ userId });
  if (!statistic) {
    throw new NOT_FOUND_ERROR('Cannot find statistic');
  }

  return statistic;
};

const getStatsForUpdate = async userId => await Statistics.findOne({ userId });

const set = async (userId, statistics) => {
  return await Statistics.create({ userId, ...statistics });
};

const upsert = async (userId, statistic) =>
  Statistics.findOneAndUpdate(
    { userId },
    { $set: statistic },
    { upsert: true, new: true }
  );

const remove = async userId => Statistics.deleteOne({ userId });

module.exports = { get, upsert, remove, set, getStatsForUpdate };
