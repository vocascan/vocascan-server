const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('../../docs/api/swagger.json');

// disable swagger topbar
const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none; }',
  `,
};

const injectHostMiddleware = (req, _res, next) => {
  req.swaggerDoc = swaggerDocument;

  // get url
  const currentURL = `${req.protocol}://${req.get('host')}/api`;

  // inject host
  if (req.swaggerDoc.servers[0].description !== 'current') {
    req.swaggerDoc.servers = [{ description: 'current', url: currentURL }, ...req.swaggerDoc.servers];
  }

  next();
};

const swagger = [injectHostMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions)];

const document = [
  injectHostMiddleware,
  (req, res) => {
    res.json(req.swaggerDoc);
  },
];

module.exports = {
  swagger,
  document,
};
