# Mokker
Mokker is a simple express Reast API mock server, which also provides few methods to make your data emulating easier.

## Instalation
```
npm i --D mokker
yarn add -D mokker
```

## Dependencies
- nodemon !!!globally
- body-parser
- express
- morgan
- query-string

## Usage

```
// index.js
const mokker = require('mokker');

const routes = [{
    method: 'get',
    url: '/api',
    json: { is: 'done' }
}];

mokker.start({ routes });
// done 😍
```

`$ nodemon index.js`

## API

### .start(object)
Start the server

#### port
Type: `number`\
Default: `3000`\
Set the port number where the APi will accessible

#### routes
Type: `array`\
Default: `[]`\
Set endpoints and how they should response to a client request

##### method: string
A route method is derived from one of the HTTP methods.

##### url: string
A route path, define the endpoints at which requests can be made. Supports query parametres.

##### controller: function
A request method, how the endpoints should responde to the request. The same controller as in Express Routing.
```
const controller = (req, res) => {
    // params – params in query string /api/:id
    // query - vars in query string /api?x=1
    // body – body of the request

    const { params, query, body } = req;
    body.id = params.id;
    res.json(body); // send body as JSON
};
```

##### json: object
static JSON, which will be returned.

## License
MIT