/* eslint-disable camelcase */
/* eslint-disable prefer-const */
const appError = require('@app-core/errors/app-error');
const { isValidDate, isValidAccountId, isSupportedCurrency } = require('../helpers');

function executeDebitOrCredit(payload, accounts) {
  const data = { ...payload };

  data.amount = Number(data.amount);
  data.currency = data.currency?.toUpperCase();

  const { debit_account, credit_account, currency, execute_by, amount } = data;

  const debitAccountInArr = accounts.find((acc) => acc.id === debit_account);
  const creditAccountInArr = accounts.find((acc) => acc.id === credit_account);

  // Accounts must exist in accounts array
  if (!debitAccountInArr || !creditAccountInArr)
    appError('Account not found', 'AC03', {
      context: { ...data, accounts },
    });

  // Amount must be positive integer
  if (!Number.isInteger(amount) || amount < 0)
    appError('Amount must be a positive integer', 'AM01', {
      context: { ...data, accounts },
    });

  // Cannot debit and credit accounts must differ
  if (debit_account === credit_account || debitAccountInArr === creditAccountInArr)
    appError('Debit and credit accounts cannot be the same', 'AC02', {
      context: { ...data, accounts },
    });

  // Account base currencies must match
  if (accounts[0]?.currency !== accounts[1]?.currency || currency !== accounts[0].currency)
    appError('Account currency mismatch', 'CU01', {
      context: { ...data, accounts },
    });

  // Must support currency
  if (!isSupportedCurrency(currency))
    appError('Unsupported currency', 'CU02', {
      context: { ...data, accounts },
    });

  // Debit account balance must be >= amount
  if (!(accounts.find((acc) => acc.id === debit_account).balance >= amount))
    appError('Insufficient funds in debit account', 'AC01', {
      context: { ...data, accounts },
    });

  // Account id must be valid
  if (!isValidAccountId(debit_account) || !isValidAccountId(credit_account))
    appError('Invalid account ID format', 'AC04', {
      context: { ...data, accounts },
    });

  // Date must match yyyy-mm-dd
  if (execute_by && !isValidDate(execute_by))
    appError('Invalid date format', 'DT01', {
      context: { ...data, accounts },
    });

  let execDate;
  if (execute_by) {
    const [year, month, date] = execute_by.split('-');
    execDate = new Date(Date.UTC(year, month - 1, date));
  } else execDate = new Date();

  const statusCode = execDate > new Date() ? 'AP02' : 'AP00';
  let statusReason;

  if (statusCode === 'AP00') {
    statusReason = 'Transaction executed successfully';

    debitAccountInArr.balance_before = debitAccountInArr.balance;
    debitAccountInArr.balance -= amount;

    creditAccountInArr.balance_before = creditAccountInArr.balance;
    creditAccountInArr.balance += amount;
  } else statusReason = 'Transaction scheduled for future execution';

  return {
    status: 'success',
    ...data,
    execute_by,
    status_code: statusCode,
    status_reason: statusReason,
    accounts,
  };
}

module.exports = executeDebitOrCredit;
