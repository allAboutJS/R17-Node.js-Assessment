const { ACTION } = require('../parser/constants');
const CREATE_ACCOUNT_GRAMMAR = require('./create-account-grammar');
const DEBIT_CREDIT_GRAMMAR = require('./debit-credit-grammar');

const GRAMMARS = {
  [ACTION.CREDIT]: DEBIT_CREDIT_GRAMMAR,
  [ACTION.DEBIT]: DEBIT_CREDIT_GRAMMAR,
  [ACTION.CREATE]: CREATE_ACCOUNT_GRAMMAR,
};

module.exports = GRAMMARS;
