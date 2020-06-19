const bcrypt = require('bcrypt');

const { AUTHENTICATION_ERROR } = require('../../errors/appErrors');
const usersRepo = require('./user.db.repository');
const statisticService = require('../statistics/statistic.service');
const settingsService = require('../settings/setting.service');
const userDataService = require('../userData/userData.service');

const authenticate = async user => {
  const userEntity = await usersRepo.getUserByEmail(user.email);

  const isValidated = await bcrypt.compare(user.password, userEntity.password);
  if (!isValidated) {
    throw new AUTHENTICATION_ERROR();
  }

  return { id: userEntity._id };
};

const get = id => usersRepo.get(id);

const save = async user => {
  const response = await usersRepo.save(user);
  await userDataService.set(response.id);
  return response;
};

const update = (id, user) => usersRepo.update(id, user);

const remove = async id => {
  await statisticService.remove(id);
  await settingsService.remove(id);
  await usersRepo.remove(id);
  await userDataService.remove(id);
};

module.exports = { authenticate, get, save, update, remove };
