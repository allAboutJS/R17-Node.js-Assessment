/* eslint-disable camelcase */
const { throwAppError } = require('@app-core/errors');
const { PaymentMessages } = require('@app/messages');
const { parse, lex } = require('./parser');
const { PAYMENT_CODES } = require('./constants');
const { isSupportedCurrency, isValidDate, isValidAccountId } = require('./helpers');

/** Executes a parsed instruction based on the grammar */
function execute(instruction, accounts) {
  try {
    const data = parse(lex(instruction));

    data.amount = Number(data.amount);
    data.currency = data.currency?.toUpperCase();

    const { debit_account, credit_account, currency, execute_by, amount } = data;

    const debitAccountInArr = accounts.find((acc) => acc.id === debit_account);
    const creditAccountInArr = accounts.find((acc) => acc.id === credit_account);

    // Accounts must exist in accounts array
    if (!debitAccountInArr || !creditAccountInArr)
      throwAppError(PaymentMessages.ACCOUNT_NOT_FOUND, PAYMENT_CODES.ACCT_NOT_FOUND, {
        details: { ...data, accounts },
      });

    // Amount must be positive integer
    if (!Number.isInteger(amount) || amount < 0)
      throwAppError(PaymentMessages.INVALID_AMOUNT, PAYMENT_CODES.AMT_POS_INT, {
        details: { ...data, accounts },
      });

    // Cannot debit and credit accounts must differ
    if (debit_account === credit_account || debitAccountInArr === creditAccountInArr)
      throwAppError(PaymentMessages.SAME_ACCOUNT_ERROR, PAYMENT_CODES.DIFF_ACCOUNTS, {
        details: { ...data, accounts },
      });

    // Account base currencies must match
    if (accounts[0]?.currency !== accounts[1]?.currency || currency !== accounts[0].currency)
      throwAppError(PaymentMessages.CURRENCY_MISMATCH, PAYMENT_CODES.CURR_MISMATCH, {
        details: { ...data, accounts },
      });

    // Must support currency
    if (!isSupportedCurrency(currency))
      throwAppError(PaymentMessages.UNSUPPORTED_CURRENCY, PAYMENT_CODES.CURR_UNSUPPORTED, {
        details: { ...data, accounts },
      });

    // Debit account balance must be >= amount
    if (!(accounts.find((acc) => acc.id === debit_account).balance >= amount))
      throwAppError(PaymentMessages.INSUFFICIENT_FUNDS, PAYMENT_CODES.INSUFF_FUNDS, {
        details: { ...data, accounts },
      });

    // Account id must be valid
    if (!isValidAccountId(debit_account) || !isValidAccountId(credit_account))
      throwAppError(PaymentMessages.INVALID_ACCOUNT_ID, PAYMENT_CODES.BAD_ACCT_ID, {
        details: { ...data, accounts },
      });

    // Date must match yyyy-mm-dd
    if (execute_by && !isValidDate(execute_by))
      throwAppError(PaymentMessages.INVALID_DATE_FORMAT, PAYMENT_CODES.BAD_DATE, {
        details: { ...data, accounts },
      });

    let execDate;
    if (execute_by) {
      const [year, month, date] = execute_by.split('-');
      execDate = new Date(Date.UTC(year, month - 1, date));
    }

    const now = new Date();
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const statusCode =
      execDate && execDate > todayUTC ? PAYMENT_CODES.PENDING : PAYMENT_CODES.SUCCESS;

    let statusReason;
    if (statusCode === PAYMENT_CODES.SUCCESS) {
      statusReason = 'Transaction executed successfully';

      debitAccountInArr.balance_before = debitAccountInArr.balance;
      debitAccountInArr.balance -= amount;

      creditAccountInArr.balance_before = creditAccountInArr.balance;
      creditAccountInArr.balance += amount;
    } else statusReason = 'Transaction scheduled for future execution';

    return {
      status: 'success',
      ...data,
      execute_by: execute_by || null,
      status_code: statusCode,
      status_reason: statusReason,
      accounts,
    };
  } catch (error) {
    throwAppError('Failed to process instruction', error.errorCode, {
      details: { ...error.details, status_code: error.errorCode, status_reason: error.message },
    });
  }
}

module.exports = execute;
