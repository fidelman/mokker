const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');

import createRouter from './routes';
import { queryCondition } from './controller';

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

const start = ({
  routes = [],
  defaultPort = 3000
}) => {
  app.use('/', createRouter(routes));

  choosePort('0.0.0.0', defaultPort)
    .then((port) => {
      if (port == null) return;
      app.listen(port, () => console.log(`App started on port: ${port}`));
    });  
};

module.exports = { 
  start,
  controllerQueryCondition: queryCondition
};
