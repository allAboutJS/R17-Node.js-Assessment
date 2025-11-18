const { parse, lex } = require('../parser');
const executeCreateAccount = require('./execute-create-account');
const executeDebitOrCredit = require('./execute-debit-or-credit');

/**
 * Executes a parsed instruction based on the grammar.
 */
function execute(instruction, ...args) {
  try {
    const data = parse(lex(instruction));

    if (data.type === 'CREDIT' || data.type === 'DEBIT') return executeDebitOrCredit(data, ...args);
    if (data.type === 'CREATE') return executeCreateAccount(data);
  } catch (error) {
    return {
      status: 'failed',
      ...(error.context || {}),
      status_code: error.errorCode,
      status_reason: error.message,
    };
  }
}

module.exports = execute;
