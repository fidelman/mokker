const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');
const json2md = require('json2md');
const fs = require('fs');
const path = require('path');
const createRouter = require('./routes');
const controller = require('./controller');
const generateDocumentation = require('./docs');

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
  docs = null
}) => {
  app.use('/', createRouter(routes));

  choosePort('0.0.0.0', defaultPort)
    .then((port) => {
      if (port == null) return;
      app.listen(port, () => console.log(`App started on port: ${port}`));
    });

    if (docs) {

      const documentation = [
        {h1: docs.description || 'Rest API documentation'}
      ];

      generateDocumentation(documentation, routes);

      fs.writeFile(docs.url || path.resolve(process.cwd(), 'rest-docs.md'), json2md(documentation) , (err) => {
        if(err) return console.log(err);
        console.log(`The docs has been updated ${docs.url}`);
      });
  }
};

module.exports = { 
  start,
  controllerQueryCondition: controller.queryCondition
};