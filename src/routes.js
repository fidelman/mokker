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

    const controller = controllerProvider(route.controller || route.json);

    try {
      Router[formatedMethod](route.url, controller);
    } catch (e) {
      throw new Error(`${formatedMethod} is a wrong method`);
    }
  });

  return Router;
};
