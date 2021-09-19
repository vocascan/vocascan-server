const drawers = [
  { stage: '0', queryInterval: 0 },
  { stage: '1', queryInterval: 1 },
  { stage: '2', queryInterval: 2 },
  { stage: '3', queryInterval: 3 },
  { stage: '4', queryInterval: 5 },
  { stage: '5', queryInterval: 10 },
  { stage: '6', queryInterval: 30 },
  { stage: '7', queryInterval: 60 },
  { stage: '8', queryInterval: 90 },
];

const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'magenta',
  },
};

const logTransportTypes = {
  FILE: 'file',
  CONSOLE: 'console',
};

module.exports = {
  drawers,
  logLevels,
  logTransportTypes,
};
