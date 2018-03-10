const server = require('../public/index');

const { ternary } = server;

const controller = ({ data }) => ternary({
  condition: true,
  iftrue: {
    success: true,
    payload: [
      {
        id: 1,
        name: 'andrei'
      },
      {
        id: 1,
        name: 'andrei'
      },
      {
        id: 1,
        name: 'andrei'
      },
      {
        id: 1,
        name: 'andrei'
      }
    ],
    errorMessage: null
  },
  iffalse: {
    success: false,
    payload: null,
    errorMessage: 'Error'
  }
});

const testRoute = {
  method: 'post',
  url: 'test',
  controller,
  docs: {
    title: 'Hello'
  }
};

const routes = [
  testRoute
];
server.start({
  routes
});
