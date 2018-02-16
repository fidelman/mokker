const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');
const json2md = require('json2md');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

import createRouter from './routes';
import { queryCondition } from './controller';
import generateDocumentation from './docs';

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
  defaultPort = 3000,
  docsUrl = path.resolve(process.cwd(), 'docs')
}) => {
  app.use('/', createRouter(routes));

  choosePort('0.0.0.0', defaultPort)
    .then((port) => {
      if (port == null) return;
      app.listen(port, () => console.log(`App started on port: ${port}`.green));
    });
  routes.forEach((route) => {
    if (route.docs) {
      const documentation = generateDocumentation(route);

      fs.writeFile(`${docsUrl}/${documentation.fileName}`, json2md(documentation.file) , (err) => {
        if(err) return console.log(err);
        console.log(`The docs has been updated ${docsUrl}/${documentation.fileName}`.green);
      });
    }
  });
};

module.exports = { 
  start,
  controllerQueryCondition: queryCondition
};