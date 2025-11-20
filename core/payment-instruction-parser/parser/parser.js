const { PaymentMessages } = require('@app/messages');
const { throwAppError } = require('@app-core/errors');
const GRAMMARS = require('../grammars');
const parseMorphology = require('./parse-morphology');
const { evalTransactionType } = require('../helpers');
const { PAYMENT_CODES, BASE_ERROR } = require('../constants');

/** Parses a stream of tokens and verifies the instruction syntax based on the grammer */
function parse(tokenList) {
  let transactionType = null;
  let activeGrammar = null;
  let index = 0;
  const result = {};

  function handleOptionalRules(optionalRules) {
    // Replace the current rule with optional rules
    if (index === activeGrammar.length - 1) activeGrammar.pop();
    activeGrammar.splice(index, 1, ...optionalRules);
  }

  while (index < tokenList.length) {
    const token = tokenList[index];

    // FIRST TOKEN → DETERMINE GRAMMAR
    if (index === 0) {
      if (token.action === undefined)
        throwAppError(PaymentMessages.MALFORMED_INSTRUCTION, PAYMENT_CODES.MALFORMED, {
          details: BASE_ERROR,
        });
      transactionType = token.action;
      activeGrammar = [...GRAMMARS[transactionType]];
      result[activeGrammar[index].forProperty] = evalTransactionType(token.action);
    } else {
      const morphRule = activeGrammar[index];
      if (!morphRule)
        throwAppError(PaymentMessages.MALFORMED_INSTRUCTION, PAYMENT_CODES.MALFORMED, {
          details: BASE_ERROR, // Base error data for system errors
        });

      const morphResult = parseMorphology(transactionType, morphRule, token, handleOptionalRules);

      if (morphResult) {
        const { key, value } = morphResult;
        result[key] = value;
      }
    }

    index++;
  }

  return result;
}

module.exports = parse;
