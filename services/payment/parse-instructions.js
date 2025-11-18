const validator = require('@app-core/validator');
const { execute } = require('@app-core/payment-instruction-parser');

// Spec for login service
const paymentInstructionSpec = `root {
  accounts any
  instruction string
}`;

// Parse the spec outside the service function
const parsedSpec = validator.parse(paymentInstructionSpec);

function paymentInstructionService(serviceData) {
  // Validate incoming data
  const validatedData = validator.validate(serviceData, parsedSpec);
  const { accounts, instruction } = validatedData;
  return execute(instruction, accounts);
}

module.exports = paymentInstructionService;
