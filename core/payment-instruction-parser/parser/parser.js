const appError = require('@app-core/errors/app-error');
const GRAMMARS = require('../grammars');
const evalTransactionType = require('./eval-transaction-type');
const parseMorphology = require('./parse-morphology');
const { ERROR_CONTEXT } = require('./constants');

/** Parses a stream of tokens and verifies the instruction syntax based on the grammer */
function parse(tokenList) {
  let transactionType = null;
  let activeGrammar = null;
  const result = {};
  let index = 0;

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
        appError('Malformed instruction. Found extra tokens', 'SYS03', {
          context: ERROR_CONTEXT,
        });
      transactionType = token.action;
      activeGrammar = [...GRAMMARS[transactionType]];
      result[activeGrammar[index].forProperty] = evalTransactionType(token.action);
    } else {
      const morphRule = activeGrammar[index];
      if (!morphRule)
        appError('Malformed instruction. Found extra tokens', 'SYS03', {
          context: ERROR_CONTEXT, // Base error data for system errors
        });

      const morphResult = parseMorphology(transactionType, morphRule, token, handleOptionalRules);

      if (morphResult) {
        const { key, value } = morphResult;
        result[key] = value;
      }
    }

    index++;
  }

  if (!result.execute_by) result.execute_by = null;
  return result;
}

module.exports = parse;
