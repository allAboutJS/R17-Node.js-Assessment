const {
  TOKEN_TYPE,
  KEYWORD_TYPE,
  SUPPLEMENT_TYPE,
  ACTION,
  COMPLEMENT_TYPE,
} = require('../parser/constants');

const CREATE_ACCOUNT_GRAMMAR = [
  {
    type: TOKEN_TYPE.KEYWORD,
    keyword: KEYWORD_TYPE.ACTION,
    action: ACTION.CREATE,
    forProperty: 'type',
  },
  {
    type: TOKEN_TYPE.KEYWORD,
    keyword: KEYWORD_TYPE.SUPPLEMENTARY,
    supplement: SUPPLEMENT_TYPE.ACCOUNT,
  },
  {
    type: TOKEN_TYPE.VARIABLE,
    forProperty: 'account_id',
  },

  {
    type: TOKEN_TYPE.KEYWORD,
    keyword: KEYWORD_TYPE.COMPLEMENTARY,
    complement: COMPLEMENT_TYPE.SET,
  },
  {
    type: TOKEN_TYPE.KEYWORD,
    keyword: KEYWORD_TYPE.SUPPLEMENTARY,
    supplement: SUPPLEMENT_TYPE.BALANCE,
  },
  {
    type: TOKEN_TYPE.KEYWORD,
    keyword: KEYWORD_TYPE.COMPLEMENTARY,
    complement: COMPLEMENT_TYPE.TO,
  },
  {
    type: TOKEN_TYPE.VARIABLE,
    forProperty: 'balance',
  },
  {
    type: TOKEN_TYPE.VARIABLE,
    forProperty: 'currency',
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

module.exports = CREATE_ACCOUNT_GRAMMAR;
