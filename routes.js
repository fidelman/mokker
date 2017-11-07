const Router = require('express').Router();

Router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});

const createRouter = (routes) => {
    routes.forEach((route) => {
        const { url } = route;
        const formatedMethod = route.method.toUpperCase();
        const returnJSON = (req, res) => res.json(route.json);

        const controller = route.controller || returnJSON;

        switch (formatedMethod) {
        case 'GET': 
            Router.get(url, controller);
            break;
        case 'POST': 
            Router.post(url, controller);
            break;
        case 'PUT': 
            Router.put(url, controller);
            break;
        case 'DELETE': 
            Router.delete(url, controller);
            break;
        default:
            throw new Error(`${formatedMethod} is wrong method`);
            break;
        }
    });

    return Router;
};

module.exports = createRouter;