const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('../../docs/api/swagger.json');
const { getVersion } = require('../Services/InfoServiceProvider');

// disable swagger topbar
const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none; }',
  `,
};

swaggerDocument.info.version = getVersion();

const swagger = [swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions)];

const document = (_req, res) => {
  res.json(swaggerDocument);
};

module.exports = {
  swagger,
  document,
};
