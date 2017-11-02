const Router = require('express').Router();

Router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});

const createRouter = (routes) => {
    routes.forEach((route) => {
        const { method, url, controller } = route;
        const formatedMethod = method.toUpperCase();

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
            throw new Error(formatedMethod + 'is wrong method');
            break;
        }
    });

    return Router;
};

module.exports = createRouter;