const server = require('../public/index');

const contollerGetAdvanced = (data) => {
  const { query: { x } } = data;
  const { ternary } = server;

  const result = ternary({
    condition: x === '1',
    iftrue: {
      success: true,
      errorMessage: {
        type: 1
      },
      payload: {
        id: +new Date()
      }
    },
    iffalse: ternary({
      condition: x === '2',
      iftrue: {
        success: 'true',
        errorMessage: {
          message: 'error',
          type: 'warning'
        },
        payload: {
          id: +new Date()
        }
      },
      iffalse: {
        success: 2,
        errorMessage: 'Error',
        payload: null
      }
    })
  });

  return result;
};

const controllerGet = {
  'simple-json': true,
  obj: {
    hi: '1',
    hello: {
      1: 'hi'
    }
  }
};
const controllerPost = (data) => {
  const { body, params, query } = data;
  return {
    ...body,
    id: params.id,
    token: +new Date(),
    sort: query.sort
  };
};

const routes = [
  {
    docs: {
      title: 'Test get advanced',
      description: 'Merged returns',
      fileName: 'advanced-get',
      query: {
        x: ''
      }
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
      query: ['sort', 'date'],
      body: ['name', 'surname']
    },
    method: 'post',
    url: '/test/post/:id',
    controller: controllerPost
  }
];

server.start({
  routes
});
