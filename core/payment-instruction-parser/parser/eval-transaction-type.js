const { ACTION } = require('./constants');

/** Evaluates action enum and returns the corresponding type */
function evalTransactionType(type) {
  if (type === ACTION.CREDIT) return 'CREDIT';
  if (type === ACTION.DEBIT) return 'DEBIT';
  if (type === ACTION.CREATE) return 'CREATE';
  return '';
}

module.exports = evalTransactionType;
