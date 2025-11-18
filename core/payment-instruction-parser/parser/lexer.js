const {
  TOKEN_TYPE,
  KEYWORD_TYPE,
  SUPPLEMENT_TYPE,
  COMPLEMENT_TYPE,
  ACTION,
} = require('../constants');
const { isWhitespace } = require('../helpers');

/** Recieves the raw instruction and returns a stream of tokens */
function lex(sourceText) {
  const tokenList = [];

  // Lookup maps
  const ACTION_MAP = {
    CREDIT: ACTION.CREDIT,
    DEBIT: ACTION.DEBIT,
    CREATE: ACTION.CREATE,
  };

  const SUPPLEMENT_MAP = {
    ACCOUNT: SUPPLEMENT_TYPE.ACCOUNT,
    ON: SUPPLEMENT_TYPE.ON,
    BALANCE: SUPPLEMENT_TYPE.BALANCE,
  };

  const COMPLEMENT_MAP = {
    FROM: COMPLEMENT_TYPE.FROM,
    FOR: COMPLEMENT_TYPE.FOR,
    TO: COMPLEMENT_TYPE.TO,
    SET: COMPLEMENT_TYPE.SET,
  };

  for (let i = 0; i < sourceText.length; i++) {
    const char = sourceText[i];

    // Skip whitespace
    if (isWhitespace(char)) {
      // eslint-disable-next-line no-continue
      continue;
    }
    const startIndex = i;
    while (!isWhitespace(sourceText[i]) && i < sourceText.length) {
      i++;
    }

    const word = sourceText.substring(startIndex, i);
    const upper = word.toUpperCase();

    switch (upper) {
      case 'DEBIT':
      case 'CREDIT':
      case 'CREATE':
        tokenList.push({
          type: TOKEN_TYPE.KEYWORD,
          keywordType: KEYWORD_TYPE.ACTION,
          action: ACTION_MAP[upper],
        });
        break;

      case 'ACCOUNT':
      case 'ON':
      case 'BALANCE':
        tokenList.push({
          type: TOKEN_TYPE.KEYWORD,
          keywordType: KEYWORD_TYPE.SUPPLEMENTARY,
          supplementType: SUPPLEMENT_MAP[upper],
        });
        break;

      case 'FROM':
      case 'TO':
      case 'FOR':
      case 'SET':
        tokenList.push({
          type: TOKEN_TYPE.KEYWORD,
          keywordType: KEYWORD_TYPE.COMPLEMENTARY,
          complementType: COMPLEMENT_MAP[upper],
        });
        break;

      default:
        tokenList.push({
          type: TOKEN_TYPE.VARIABLE,
          value: word,
        });
        break;
    }
  }

  return tokenList;
}

module.exports = lex;
