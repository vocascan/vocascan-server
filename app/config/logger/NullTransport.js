const TransportStream = require('winston-transport');

class NullTransport extends TransportStream {
  constructor(opts) {
    super(opts);
    this.name = 'NullTransport';
  }

  log(...args) {
    const cb = args[args.length - 1];
    cb();

    return this;
  }
}

module.exports = NullTransport;
