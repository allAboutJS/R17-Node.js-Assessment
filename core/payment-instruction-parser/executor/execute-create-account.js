/* eslint-disable camelcase */
/* eslint-disable prefer-const */
const appError = require('@app-core/errors/app-error');
const { isValidDate, isValidAccountId, isSupportedCurrency } = require('../helpers');

function executeCreateAccount(payload) {
  const data = { ...payload };

  data.balance = Number(data.balance);
  data.currency = data.currency?.toUpperCase();

  const { account_id, currency, execute_by, balance } = data;

  // Balance must be positive integer
  if (!Number.isInteger(balance) || balance < 0)
    appError('Balance must be a positive integer', 'AM01', {
      context: { ...data, data },
    });

  // Must support currency
  if (!isSupportedCurrency(currency))
    appError('Unsupported currency', 'CU02', {
      context: { ...data },
    });

  // Account ID must be valid
  if (!isValidAccountId(account_id))
    appError('Invalid account ID format', 'AC04', {
      context: { ...data },
    });

  // Date must match yyyy-mm-dd
  if (execute_by && !isValidDate(execute_by))
    appError('Invalid date format', 'DT01', {
      context: { ...data },
    });

  let execDate;
  if (execute_by) {
    const [year, month, date] = execute_by.split('-');
    execDate = new Date(Date.UTC(year, month - 1, date));
  } else execDate = new Date();

  const statusCode = execDate > new Date() ? 'AP02' : 'AP00';
  let statusReason;
  let account;

  if (statusCode === 'AP00') statusReason = 'Account created successfully';
  else statusReason = 'Account scheduled for future creation';

  account = {
    account_id,
    balance,
    currency,
    [statusCode === 'AP00' ? 'created_on' : 'to_be_created_on']: execute_by,
  };

  return {
    status: 'success',
    status_code: statusCode,
    status_reason: statusReason,
    account,
  };
}

module.exports = executeCreateAccount;
