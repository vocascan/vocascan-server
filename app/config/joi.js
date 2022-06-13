const ms = require('ms');

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
  }))
  .extend((joi) => ({
    base: joi.number(),
    type: 'ms',
    coerce: (value) => {
      return { value: ms(value) };
    },
    overrides: {
      default(...args) {
        const value = this.$_parent('default', ...args).$_getFlag('default');
        return this.$_setFlag('default', ms(value));
      },
    },
  }));

module.exports = Joi;
