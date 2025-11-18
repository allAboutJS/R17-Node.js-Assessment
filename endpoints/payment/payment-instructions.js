const { createHandler } = require('@app-core/server');
const { appLogger } = require('@app-core/logger');
const paymentInstructionService = require('@app/services/payment/parse-instructions');

module.exports = createHandler({
  path: '/payment-instructions',
  method: 'post',
  middlewares: [],
  async onResponseEnd(rc, rs) {
    appLogger.info({ requestContext: rc, response: rs }, 'payment-instructions-completed');
  },
  handler(rc, helpers) {
    const payload = rc.body;
    const parsed = paymentInstructionService(payload);
    return {
      status: helpers.http_statuses.HTTP_200_OK,
      data: parsed,
    };
  },
});
