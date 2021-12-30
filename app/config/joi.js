const Joi = require('joi')
  .extend((joi) => ({
    base: joi.array(),
    type: 'stringArray',
    coerce: (value) => ({
      value: value.split ? value.split(',') : value,
    }),
  }))
  .extend((joi) => ({
    base: joi.array(),
    type: 'keyArray',
    coerce: (value) => {
      if (typeof value === 'object') {
        return { value: Object.values(value) };
      }
      return { value: [value] };
    },
  }));

module.exports = Joi;
