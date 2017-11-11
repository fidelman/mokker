const path = require('path');
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
        description: 'Test get condition',
        method: 'get',
        url: '/test/condition',
        controller: controllerGet
    },
    {
        description: 'Test get',
        method: 'get',
        url: '/test/get',
        json: { 
            x: 1,
            y: 'Hi',
            z: [1, 2, 3],
            h: {
                x: 1,
                y: 2
            }
        }
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