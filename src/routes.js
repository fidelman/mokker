import controllerProvider from './controller';

const Router = require('express').Router();

Router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

export default (routes) => {
  routes.forEach((route) => {
    const formatedMethod = route.method.toLowerCase();

    const controller = route.controller || route.json;
    const delay = route.delay || 0;

    try {
      Router[formatedMethod](route.url, controllerProvider(controller, delay));
    } catch (e) {
      throw new Error(`${formatedMethod} is a wrong method`);
    }
  });

  return Router;
};
