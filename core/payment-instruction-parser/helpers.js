const { UNICODE_WHITESPACE, ACTION } = require('./constants');

const supportedCurrencies = ['NGN', 'USD', 'GBP', 'GHS'];

/** Validate account id */
function isValidAccountId(id) {
  if (!id || typeof id !== 'string') return false;
  for (let i = 0; i < id.length; i++) {
    const c = id[i];
    const code = c.charCodeAt(0);
    const isAlphaNum =
      (code >= 48 && code <= 57) || (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    const isAllowedChar = c === '-' || c === '@';
    if (!isAlphaNum && !isAllowedChar) return false;
  }
  return true;
}

/** Validate date string */
function isValidDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return false;
  const [year, month, day] = parts.map(Number);
  if (
    !Number.isInteger(year) ||
    year < 0 ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    !Number.isInteger(day) ||
    day < 1 ||
    day > 31
  )
    return false;

  const monthDays = [
    31,
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return day <= monthDays[month - 1];
}

/** Validate currency */
function isSupportedCurrency(curr) {
  return supportedCurrencies.includes(curr);
}

/** Evaluates action enum and returns the corresponding type */
function evalTransactionType(type) {
  if (type === ACTION.CREDIT) return 'CREDIT';
  if (type === ACTION.DEBIT) return 'DEBIT';
  if (type === ACTION.CREATE) return 'CREATE';
  return '';
}

/** Detect whitespace */
function isWhitespace(char) {
  return UNICODE_WHITESPACE.has(char);
}

module.exports = {
  isValidAccountId,
  isSupportedCurrency,
  isValidDate,
  evalTransactionType,
  isWhitespace,
};
