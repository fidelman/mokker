import createRouter from './routes';
import { ternary } from './controller';
import generateDocumentation from './docs';

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');
const json2md = require('json2md');
const fs = require('fs');
const path = require('path');
const colors = require('colors'); // eslint-disable-line no-unused-vars

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-Redmine-API-Key');

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
      app.listen(port, () => console.log(`🚀 App started on port: ${port}`.green)); // eslint-disable-line no-console
    });
  routes.forEach((route) => {
    if (route.docs) {
      const documentation = generateDocumentation(route);

      fs.writeFile(`${docsUrl}/${documentation.fileName}`, json2md(documentation.fileContent), (err) => {
        if (err) {
          console.log(err.red); // eslint-disable-line no-console
          return false;
        }
        console.log(`📄 ${docsUrl}/${documentation.fileName}`); // eslint-disable-line no-console
        return true;
      });
    }
  });
};

module.exports = {
  start,
  ternary
};

