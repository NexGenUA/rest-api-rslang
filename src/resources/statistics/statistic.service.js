const statisticRepo = require('./statistic.db.repository');
const { defaultStatistics } = require('../../utils/mock/defaultMock');

const get = async userId => statisticRepo.get(userId);

const set = async userId => statisticRepo.set(userId, defaultStatistics);

const upsert = async (userId, statistic) => {
  let stats = await statisticRepo.getStatsForUpdate(userId);
  stats = stats || statistic;
  const { optional } = stats;
  const optionals = { ...optional, ...statistic.optional };
  return statisticRepo.upsert(userId, { optional: optionals });
};

const remove = async userId => statisticRepo.remove(userId);

module.exports = { get, upsert, remove, set };
