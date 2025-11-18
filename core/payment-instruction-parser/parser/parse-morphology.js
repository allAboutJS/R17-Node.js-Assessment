const appError = require('@app-core/errors/app-error');
const { ERROR_CONTEXT } = require('./constants');

/** Parses and validates an entry in the grammar (morphology) against a token at the same position */
function parseMorphology(transactionType, morphRule, token, handleOptionalRule) {
  const {
    type: expectedType,
    keyword: expectedKeywordType,
    action: expectedAction,
    complement: expectedComplement,
    supplement: expectedSupplement,
    forProperty: propertyTarget,
    optional: optionalRules,
  } = morphRule;

  // TYPE CHECK
  if (expectedType && token.type !== expectedType) {
    appError('Malformed instruction', 'SYS03', {
      context: ERROR_CONTEXT,
    });
  }

  // KEYWORD TYPE CHECK
  if (expectedKeywordType && token.keywordType !== expectedKeywordType) {
    appError('Invalid keyword order', 'SYS02', {
      context: ERROR_CONTEXT,
    });
  }

  // COMPLEMENT / SUPPLEMENT CHECK
  if (expectedComplement || expectedSupplement) {
    if (expectedComplement) {
      const requiredComplement =
        typeof expectedComplement === 'function'
          ? expectedComplement(transactionType)
          : expectedComplement;

      if (requiredComplement !== token.complementType) {
        appError('Missing required keyword', 'SYS01', {
          context: ERROR_CONTEXT,
        });
      }
    } else {
      const requiredSupplement =
        typeof expectedSupplement === 'function'
          ? expectedSupplement(transactionType)
          : expectedSupplement;

      if (requiredSupplement !== token.supplementType) {
        appError('Missing required keyword', 'SYS01', {
          context: ERROR_CONTEXT,
        });
      }
    }
  }

  // ACTION CHECK
  if (expectedAction) {
    const requiredAction =
      typeof expectedAction === 'function' ? expectedAction(transactionType) : expectedAction;

    if (requiredAction !== token.action) {
      appError('Missing required keyword', 'SYS01', {
        context: ERROR_CONTEXT,
      });
    }
  }

  // OPTIONAL RULES
  if (optionalRules && token) {
    handleOptionalRule(optionalRules);
  }

  // ASSIGN VALUE TO OUTPUT
  if (propertyTarget) {
    const key =
      typeof propertyTarget === 'function' ? propertyTarget(transactionType) : propertyTarget;

    return { key, value: token.value };
  }
}

module.exports = parseMorphology;
