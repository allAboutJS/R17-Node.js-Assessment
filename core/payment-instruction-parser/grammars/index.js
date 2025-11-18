const { ACTION } = require('../constants');
const DEBIT_CREDIT_GRAMMAR = require('./debit-credit-grammar');

const GRAMMARS = {
  [ACTION.CREDIT]: DEBIT_CREDIT_GRAMMAR,
  [ACTION.DEBIT]: DEBIT_CREDIT_GRAMMAR,
};

module.exports = GRAMMARS;
