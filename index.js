const server = require('./mock');

const controller = (req, res) => {
    server.controller.queryCondition({
        req,
        key: '@x',
        reject: () => res.json({ 'message': 'reject' }),
        resolvers: [
            {
                value: 1,
                resolve: () => res.json({ 'value': 1 })
            },
            {
                value: 2,
                resolve: () => res.json({ 'value': 2 })
            }
        ]
    });
};

const routes = [
    {
        method: 'get',
        url: '/test',
        controller
    },
    {
        method: 'get',
        url: '/test2',
        json: { 'simple-json': true }
    }
];

server.start({ routes });