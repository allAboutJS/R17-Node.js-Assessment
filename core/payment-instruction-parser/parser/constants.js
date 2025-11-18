/** Token type enum */
const TOKEN_TYPE = {
  KEYWORD: 0,
  VARIABLE: 1,
};

/** Transaction action type enum */
const ACTION = {
  DEBIT: 0,
  CREDIT: 1,
  CREATE: 2,
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
  SET: 3,
};

const ERROR_CONTEXT = {
  type: null,
  amount: null,
  currency: null,
  debit_account: null,
  credit_account: null,
  execute_by: null,
  accounts: [],
};

module.exports = {
  TOKEN_TYPE,
  ACTION,
  KEYWORD_TYPE,
  SUPPLEMENT_TYPE,
  COMPLEMENT_TYPE,
  ERROR_CONTEXT,
};
