const server = require('../index');

const controllerGet = (req, res) => {
    server.controllerQueryCondition({
        req,
        key: '@x',
        reject: () => res.json({ message: 'reject' }),
        resolvers: [
            {
                value: 1,
                resolve: () => res.json({ value: 1 })
            },
            {
                value: 2,
                resolve: () => res.json({ value: 2 })
            }
        ]
    });
};

const controllerPost = (req, res) => {
    const { body } = req;
    res.send(body);
};

const routes = [
    {
        method: 'get',
        url: '/test/condition',
        controller: controllerGet
    },
    {
        method: 'get',
        url: '/test/get',
        json: { 'simple-json': true }
    },
    {
        method: 'post',
        url: '/test/post',
        controller: controllerPost
    }
];

server.start({ routes });