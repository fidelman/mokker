# Mokker
[
    ![npm version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=0.3.2&x2=0)
](https://www.npmjs.com/package/mokker)

Mokker is a simple express RESTful API mock server, which also provides few methods to make your data emulating easier.

## Installation
```
npm install --save-dev mokker
yarn add --dev mokker
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



## Docs

- [API](https://github.com/fidelman/mokker/blob/master/docs/api.md)
- [Examples](https://github.com/fidelman/mokker/blob/master/docs/examples.md)

## License

This project is licensed under [MIT License](https://github.com/fidelman/mokker/blob/master/LICENSE.md). See the license file for more details.
