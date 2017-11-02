const runServer = require('./mock').runServer;

const routes = [
    {
        method: 'get',
        url: '/test',
        controller: (req, res) => res.json({ hi: 1 })
    }
]

runServer({ routes });