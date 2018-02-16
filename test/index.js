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

const controllerGet = {
    'simple-json': true,
    'obj': {
        'hi': '1',
        'hello': {
            '1': 2
        }
    }
};

const controllerPost = data => {
    const { body, params } = data;
    body.time = +new Date;
    body.id = params.id;
    return body;
};

const routes = [
    {
        method: 'get',
        url: '/test/condition',
        controller: controllerQueryCondition
    },
    {
        docs: {
            title: 'Test get',
            description: '',
            fileName: 'simple-get'
        },
        method: 'get',
        url: '/test/get',
        json: controllerGet
    },
    {
        docs: {
            title: 'Test post',
            description: '',
            fileName: 'simple-post',
            parameters: {
                name: '',
                surname: ''
            }
        },
        method: 'post',
        url: '/test/post/:id',
        controller: controllerPost
    }
];

server.start({ 
    routes
});