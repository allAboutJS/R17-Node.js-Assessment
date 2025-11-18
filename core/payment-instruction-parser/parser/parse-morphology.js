const { PaymentMessages } = require('@app/messages');
const { throwAppError } = require('@app-core/errors');
const { PAYMENT_CODES, BASE_ERROR } = require('../constants');

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
    throwAppError(PaymentMessages.MALFORMED_INSTRUCTION, PAYMENT_CODES.MALFORMED, {
      details: BASE_ERROR,
    });
  }

  // KEYWORD TYPE CHECK
  if (expectedKeywordType && token.keywordType !== expectedKeywordType) {
    throwAppError(PaymentMessages.INVALID_KEYWORD_ORDER, PAYMENT_CODES.BAD_KEYWORD_ORDER, {
      details: BASE_ERROR,
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
        throwAppError(PaymentMessages.MISSING_KEYWORD, PAYMENT_CODES.MISSING_KEYWORD, {
          details: BASE_ERROR,
        });
      }
    } else {
      const requiredSupplement =
        typeof expectedSupplement === 'function'
          ? expectedSupplement(transactionType)
          : expectedSupplement;

      if (requiredSupplement !== token.supplementType) {
        throwAppError(PaymentMessages.MISSING_KEYWORD, PAYMENT_CODES.MISSING_KEYWORD, {
          details: BASE_ERROR,
        });
      }
    }
  }

  // ACTION CHECK
  if (expectedAction) {
    const requiredAction =
      typeof expectedAction === 'function' ? expectedAction(transactionType) : expectedAction;

    if (requiredAction !== token.action) {
      throwAppError(PaymentMessages.MISSING_KEYWORD, PAYMENT_CODES.MISSING_KEYWORD, {
        details: BASE_ERROR,
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
