const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()
var Minio = require('minio')


//create client for minio files storage server
global.fileStorage = new Minio.Client({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: 'minio',
    secretKey: 'minio123'
});

global.db = require("./database/models");

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