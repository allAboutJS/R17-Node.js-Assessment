const dateRegex = /\d{4}-\d{2}-\d{2}/;
const supportedCurrencies = ['NGN', 'USD', 'GBP', 'GHS'];
const accountIdRegex = /^[a-zA-Z0-9\-@]+$/;

function isValidDate(dateStr) {
  return dateRegex.test(dateStr);
}

function isSupportedCurrency(curr) {
  return supportedCurrencies.includes(curr);
}

function isValidAccountId(id) {
  return accountIdRegex.test(id);
}

module.exports = { isValidAccountId, isSupportedCurrency, isValidDate };
