import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import { choosePort } from 'react-dev-utils/WebpackDevServerUtils';
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import * as config from "./webpack.dev.config.js";
import createRouter from './routes';
import controller from './controller';

const app = express();
const isDevelopment = process.env.NODE_ENV !== "production";
const DIST_DIR = path.join(__dirname, "dist");
const compiler = webpack(config);

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

if (isDevelopment) {
  app.use(webpackDevMiddleware(compiler, {
		publicPath: config.output.publicPath
	}));

  app.use(webpackHotMiddleware(compiler));
} else {
  app.use(express.static(DIST_DIR));
}

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
  controllerQueryCondition: controller.queryCondition
};
