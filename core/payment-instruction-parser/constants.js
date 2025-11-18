const PAYMENT_CODES = {
  AMT_POS_INT: 'AM01',
  CURR_MISMATCH: 'CU01',
  CURR_UNSUPPORTED: 'CU02',
  INSUFF_FUNDS: 'AC01',
  DIFF_ACCOUNTS: 'AC02',
  ACCT_NOT_FOUND: 'AC03',
  BAD_ACCT_ID: 'AC04',
  BAD_DATE: 'DT01',
  MISSING_KEYWORD: 'SY01',
  BAD_KEYWORD_ORDER: 'SY02',
  MALFORMED: 'SY03',
  SUCCESS: 'AP00',
  PENDING: 'AP02',
};

/** Token type enum */
const TOKEN_TYPE = {
  KEYWORD: 0,
  VARIABLE: 1,
};

/** Transaction action type enum */
const ACTION = {
  DEBIT: 0,
  CREDIT: 1,
};

/** Keyword types enum */
const KEYWORD_TYPE = {
  ACTION: 0,
  COMPLEMENTARY: 1,
  SUPPLEMENTARY: 2,
};

/** Supplementary keyword type enum */
const SUPPLEMENT_TYPE = {
  ACCOUNT: 0,
  ON: 1,
  BALANCE: 2,
};

/** Complementary keyword type enum */
const COMPLEMENT_TYPE = {
  TO: 0,
  FROM: 1,
  FOR: 2,
};

const BASE_ERROR = {
  type: null,
  amount: null,
  currency: null,
  debit_account: null,
  credit_account: null,
  execute_by: null,
  accounts: [],
};

/** White space types map */
const UNICODE_WHITESPACE = new Set([
  '\u0009',
  '\u000A',
  '\u000B',
  '\u000C',
  '\u000D',
  '\u0020',
  '\u0085',
  '\u00A0',
  '\u1680',
  '\u2000',
  '\u2001',
  '\u2002',
  '\u2003',
  '\u2004',
  '\u2005',
  '\u2006',
  '\u2007',
  '\u2008',
  '\u2009',
  '\u200A',
  '\u2028',
  '\u2029',
  '\u202F',
  '\u205F',
  '\u3000',
]);

module.exports = {
  TOKEN_TYPE,
  ACTION,
  KEYWORD_TYPE,
  SUPPLEMENT_TYPE,
  COMPLEMENT_TYPE,
  BASE_ERROR,
  PAYMENT_CODES,
  UNICODE_WHITESPACE,
};
