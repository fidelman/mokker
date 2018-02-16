# Mokker
[
    ![npm version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=0.1.1&x2=0)
](https://www.npmjs.com/package/mokker)

Mokker is a simple express RESTful API mock server, which also provides few methods to make your data emulating easier.

## Instalation
```
npm install --save-dev mokker
yarn add --save-dev mokker
```

## Dependencies
- body-parser
- express
- morgan
- query-string
- react-dev-utils

## Usage

```
// server.js
const mokker = require('mokker');

const routes = [{
    method: 'get',
    url: '/api',
    json: { is: 'done' }
}];

mokker.start({ routes });
// done 😍
```

`$ node server.js`

## API

### `.start({ routes, defaultPort })`

Run the server

- `routes: [{ method, url, json, controller }]` – router settings
  - `method: string` – the request [method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
  - `url: string` – the endpoint url
  - `json: object` – the response JSON object of the request
  - `controller: (data, req, res) => object` – the custom controller
    - `data: { body, params, query }`
      - `body: object` – the body of the request
      - `params: object` – [route parameters](http://expressjs.com/en/guide/routing.html#route-parameters) `/api/:id`
      - `query: object` – object containing a property for each [query parameter](http://expressjs.com/en/api.html#req.query) `/api?x=1`
    - `req: object` – [the request Exress object](http://www.murvinlai.com/req-and-res-in-nodejs.html)
    - `res: object` – [the response Exress object](http://www.murvinlai.com/req-and-res-in-nodejs.html)

## `.controllerQueryCondition({ req, key, reject, resolvers }) => object`

The custom controller suppots conditions for query parameters. This controller has to be set inside a controller method.

- `req: object` – [the request Exress object](http://www.murvinlai.com/req-and-res-in-nodejs.html)
- `key: string` – a key of a value from the query parameters
- `reject: object` – the response if the value is not matched to the resolvers values
- `resolvers: [{ value, resolver }]` – the list of the resolvers based on the condition
  - `value: string | number` – the matched value of the key
  - `resolve: object` – the response if the value is matched

## Examples
### Simple GET request
```
// server.js
const mokker = require('mokker');

const routes = [{
    method: 'get',
    url: '/api',
    json: { is: 'done' }
}];

mokker.start({ routes });
```

### GET request with query string conditions
```
// sever.js
// if the host url has ?x=1 it will get { 'value': 1 }
// if the host url has ?x=2 it will get { 'value': 2 }
// if the host url has ?x=3 it will get { 'message': 'reject' }

const mokker = require('mokker');

const controller = (data, req) => {
    return mokker.controllerQueryCondition({
        req,
        key: 'x',
        reject: { 'message': 'reject' },
        resolvers: [
            {
                value: 1,
                resolve: { 'value': 1 }
            },
            {
                value: 2,
                resolve: { 'value': 2 }
            }
        ]
    });
};

const routes = [{
    method: 'get',
    url: '/api',
    controller
}];

mokker.start({ routes });
```
### Simple POST request
```
// server.js

const mokker = require('mokker');

const controller = (data) => {
    const { body } = data;
    const newBody = Object.assign({}, body);
    newBody.id = +new Date;
    return newBody;
};

const routes = [{
    method: 'get',
    url: '/api',
    controller
}];

mokker.start({ routes });
```


## License
This project is licensed under [MIT License](https://github.com/fidelman/mokker/blob/master/LICENSE.md). See the license file for more details.
