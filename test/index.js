const server = require('../public/index');

const contollerGetAdvanced = (data) => {
  const { query: { x } } = data;
  const { ternary } = server;

  const result = ternary({
    condition: x === '1',
    iftrue: { value: 1 },
    iffalse: ternary({
      condition: x === '2',
      iftrue: { value: 2 },
      iffalse: { value: 3 }
    })
  });

  return result;
};

const controllerGet = {
  'simple-json': true,
  obj: {
    hi: '1',
    hello: {
      1: 2
    }
  }
};

const controllerPost = (data) => {
  const { body } = data;
  return body;
};

const routes = [
  {
    docs: {
      title: 'Test get advanced',
      description: 'Merged returns',
      fileName: 'advanced-get'
    },
    method: 'get',
    url: '/test/condition',
    controller: contollerGetAdvanced
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
      },
      query: {
        x: ''
      }
    },
    method: 'post',
    url: '/test/post',
    controller: controllerPost
  }
];

server.start({
  routes
});
