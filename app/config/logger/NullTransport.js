const TransportStream = require('winston-transport');

class NullTransport extends TransportStream {
  constructor(opts) {
    super(opts);

    this.name = 'NullTransport';
  }

  log(...args) {
    // in winston >= 3 and winston < 3 callback is the last argument
    const callback = args[args.length - 1];
    callback();

    return this;
  }
}

module.exports = NullTransport;
