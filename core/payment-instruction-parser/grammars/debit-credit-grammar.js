const {
  TOKEN_TYPE,
  KEYWORD_TYPE,
  ACTION,
  COMPLEMENT_TYPE,
  SUPPLEMENT_TYPE,
} = require('../parser/constants');

/** The grammar outline for credit/debit transactions */
const DEBIT_CREDIT_GRAMMAR = [
  {
    type: TOKEN_TYPE.KEYWORD,
    keyword: KEYWORD_TYPE.ACTION,
    forProperty: 'type',
  },
  {
    type: TOKEN_TYPE.VARIABLE,
    forProperty: 'amount',
  },
  {
    type: TOKEN_TYPE.VARIABLE,
    forProperty: 'currency',
  },
  {
    type: TOKEN_TYPE.KEYWORD,
    keyword: KEYWORD_TYPE.COMPLEMENTARY,
    complement: (a) => (a === ACTION.DEBIT ? COMPLEMENT_TYPE.FROM : COMPLEMENT_TYPE.TO),
  },
  {
    type: TOKEN_TYPE.KEYWORD,
    keyword: KEYWORD_TYPE.SUPPLEMENTARY,
    supplement: SUPPLEMENT_TYPE.ACCOUNT,
  },
  {
    type: TOKEN_TYPE.VARIABLE,
    forProperty: (a) => (a === ACTION.DEBIT ? 'debit_account' : 'credit_account'),
  },
  {
    type: TOKEN_TYPE.KEYWORD,
    keyword: KEYWORD_TYPE.COMPLEMENTARY,
    complement: COMPLEMENT_TYPE.FOR,
  },
  {
    type: TOKEN_TYPE.KEYWORD,
    keyword: KEYWORD_TYPE.ACTION,
    action: (a) => (a === ACTION.DEBIT ? ACTION.CREDIT : ACTION.DEBIT),
  },
  {
    type: TOKEN_TYPE.KEYWORD,
    keyword: KEYWORD_TYPE.COMPLEMENTARY,
    complement: (a) => (a === ACTION.DEBIT ? COMPLEMENT_TYPE.TO : COMPLEMENT_TYPE.FROM),
  },
  {
    type: TOKEN_TYPE.KEYWORD,
    keyword: KEYWORD_TYPE.SUPPLEMENTARY,
    supplement: SUPPLEMENT_TYPE.ACCOUNT,
  },
  {
    type: TOKEN_TYPE.VARIABLE,
    forProperty: (a) => (a === ACTION.DEBIT ? 'credit_account' : 'debit_account'),
  },
  {
    optional: [
      {
        type: TOKEN_TYPE.KEYWORD,
        keyword: KEYWORD_TYPE.SUPPLEMENTARY,
        supplement: SUPPLEMENT_TYPE.ON,
      },
      {
        type: TOKEN_TYPE.VARIABLE,
        forProperty: 'execute_by',
      },
    ],
  },
];

module.exports = DEBIT_CREDIT_GRAMMAR;
