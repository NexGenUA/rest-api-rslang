const { OK } = require('http-status-codes');
const router = require('express').Router({ mergeParams: true });
const userDataService = require('./userData.service');
const { userData } = require('../../utils/validation/schemas');
const { validator } = require('../../utils/validation/validator');

router.get('/', async (req, res) => {
  const data = await userDataService.get(req.userId);
  const { lerningWords, hardWords, deletedWords } = data;
  res.status(OK).send({ lerningWords, hardWords, deletedWords });
});

router.put('/', validator(userData, 'body'), async (req, res) => {
  console.log(req.userId, req.body);
  const data = await userDataService.update(req.userId, req.body);
  const { lerningWords, hardWords, deletedWords } = data;
  res.status(OK).send({ lerningWords, hardWords, deletedWords });
});

module.exports = router;
