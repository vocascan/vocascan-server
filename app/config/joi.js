const Joi = require('joi').extend((joi) => ({
  base: joi.array(),
  type: 'stringArray',
  coerce: (value) => ({
    value: value.split ? value.split(',') : value,
  }),
}));

module.exports = Joi;
