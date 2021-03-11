const express = require('express');
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
require('dotenv').config()


//make global handler for sequelize database


const sequelize = new Sequelize({
   username: "vocascan", 
   password: "vocascan", 
   database: "vocascan", 
   port: 7654, 
   host: "localhost", 
   dialect: "postgres" 
  });

const umzug = new Umzug({
  migrations: { glob: './database/migrations/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

(async () => {
  // Checks migrations and run them if they are not already applied. To keep
  // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
  // will be automatically created (if it doesn't exist already) and parsed.
  await umzug.up();
})();

const app = express();

const routes = require("./routes/api");

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json())
// Use Routes
app.use("/", routes)


const PORT = process.env.PORT || 5000;

app.listen(PORT, "192.168.178.58", console.log(`Server started on port ${PORT}`));