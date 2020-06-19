const userData = require('./userData.db.repository');

const set = async userId => await userData.set(userId);

const get = async userId => await userData.get(userId);

const update = async (userId, body) => await userData.update(userId, body);

const remove = async userId => await userData.remove(userId);

module.exports = { set, get, update, remove };
