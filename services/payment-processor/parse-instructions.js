const validator = require('@app-core/validator');
const { execute } = require('@app-core/payment-instruction-parser');

// Spec for payment instructions service
const spec = `root {
  accounts[] {
    id string
    balance number
    currency string
  }
  instruction string
}`;

// Parse the spec outside the service function
const parsedSpec = validator.parse(spec);

function paymentInstructionService(serviceData) {
  const validatedData = validator.validate(serviceData, parsedSpec);
  const { accounts, instruction } = validatedData;
  const response = execute(instruction, accounts);

  return response;
}

module.exports = paymentInstructionService;
