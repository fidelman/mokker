const path = require('path');
const server = require('../public/index');

const controllerQueryCondition = (data, req) => {
    return server.controllerQueryCondition({
        req,
        key: '@x',
        reject: { message: 'reject' },
        resolvers: [
            {
                value: 1,
                resolve: { value: 1 }
            },
            {
                value: 2,
                resolve: { value: 2 }
            }
        ]
    });
};

const controllerGet = () => ({ 'simple-json': true });

const controllerPost = data => data.body;

const routes = [
    {
        description: 'Test get condition',
        method: 'get',
        url: '/test/condition',
        controller: controllerQueryCondition
    },
    {
        description: 'Test get',
        method: 'get',
        url: '/test/get',
        json: controllerGet
    },
    {
        description: 'Test post',
        method: 'post',
        url: '/test/post',
        controller: controllerPost
    }
];

server.start({ 
    routes,
    docs: {
        url: path.resolve(process.cwd(), 'rest-docs.md'),
        description: 'Rest API'
    }
});
