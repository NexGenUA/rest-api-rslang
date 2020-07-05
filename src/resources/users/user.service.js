const bcrypt = require('bcrypt');

const usersRepo = require('./user.db.repository');
const tokenService = require('../token/token.service');
const settingsService = require('../settings/setting.service');
const statisticService = require('../statistics/statistic.service');
const { AUTHENTICATION_ERROR } = require('../../errors/appErrors');
const userDataService = require('../userData/userData.service');
const { defaultSettings } = require('../../utils/mock/defaultMock');

const authenticate = async user => {
  const userEntity = await usersRepo.getUserByEmail(user.email);

  const isValidated = await bcrypt.compare(user.password, userEntity.password);
  if (!isValidated) {
    throw new AUTHENTICATION_ERROR();
  }

  const tokens = await tokenService.getTokens(userEntity._id);

  return {
    ...tokens,
    userId: userEntity._id,
    name: userEntity.name,
    email: userEntity.email
  };
};

const get = id => usersRepo.get(id);

const save = async user => {
  const response = await usersRepo.save(user);
  const id = response.id;
  await userDataService.set(id);
  await settingsService.upsert(id, { ...defaultSettings, id });
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
