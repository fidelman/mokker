const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const createRouter = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers',
      'Content-Type, Authorization, Content-Length, X-Requested-With, X-Redmine-API-Key');

    res.sendStatus(200);
  } else {
    next();
  }
});

const runServer = ({
  routes,
  port
}) => {
  const mockPort = port || 3000;

  app.use('/', createRouter(routes));
  app.listen(mockPort);
  console.log(`App started on port: ${mockPort}`);
};

module.exports.runServer = runServer;
