const server = require('../public/index');

const contollerGetAdvanced = (data) => {
  const { query: { x } } = data;

  if (x === '1') {
    return { value: 1 };
  } else if (x === '2') {
    return { value: '2' };
  }

  return { reject: true };
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
  const { body, params, query } = data;
  body.time = +new Date();
  body.param1 = params.param1;
  body.param2 = params.param2;
  body.query1 = query.query1;
  body.query2 = query.query2;
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
      }
    },
    method: 'post',
    url: '/test/post/:param1/:param2?query1=&query2=',
    controller: controllerPost
  }
];

server.start({
  routes
});
