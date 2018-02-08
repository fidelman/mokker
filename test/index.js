const server = require('../index');

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
        method: 'get',
        url: '/test/condition',
        controller: controllerQueryCondition
    },
    {
        method: 'get',
        url: '/test/get',
        json: controllerGet
    },
    {
        method: 'post',
        url: '/test/post',
        controller: controllerPost
    }
];

server.start({ routes });
