const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);

let db = {};

// initialize sequelize instance
let sequelize = new Sequelize({
   username: "vocascan", 
   password: "vocascan", 
   database: "vocascan", 
   port: 7654, 
   host: "localhost", 
   dialect: "postgres" 
  });

// get all models
fs.readdirSync(path.resolve('database', 'models'))
  // filter by models
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  // import model
  .forEach((file) => {
    // eslint-disable-next-line global-require
    const model = require(path.resolve('database', 'models', file))(sequelize);
    db[model.name] = model;
  });

// associate models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// define db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;