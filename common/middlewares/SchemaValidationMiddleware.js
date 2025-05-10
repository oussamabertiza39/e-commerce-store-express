const Ajv = require('ajv').default;
const ajv = new Ajv({ allErrors: true });

module.exports = {
  verify: (schema) => {
    if (!schema) throw new Error('Schema not provided');

    return (req, res, next) => {
      const validate = ajv.compile(schema);
      const isValid = validate(req.body);

      if (isValid) return next();

      return res.status(400).json({
        status: false,
        error: {
          message: `Invalid Payload: ${ajv.errorsText(validate.errors)}`,
          details: validate.errors,
        },
      });
    };
  },
};