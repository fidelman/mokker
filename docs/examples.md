# Examples

## Simple Get request

```
// server.js
const mokker = require('mokker');

const routes = [{
    method: 'get',
    url: '/api',
    json: { is: 'done' }
}];

mokker.start({ routes });

// app.js
fetch('http://localhost:3000/api', {
	method: 'get'
});

// response
{
	"is": "done"
}
```

## Simple POST request

### Source code

```
// server.js
const mokker = require('mokker');

const controller = (data) => {
    const { body, query, params, hostQuery } = data;
    let response = {
	    error: 'No Token Found'
    };
    
    if (hostQuery.token) {
        response = Object.assign({}, body);
        response.id = params.id;
        response.date = query.date;
    }
    
    return response;
};

const routes = [{
    method: 'post',
    url: '/api/:id',
    controller
}];

mokker.start({ routes });
```

### Response

```
// the request from localhost:8000/152125?data=20181121
// body {
// 		name: 'John'
//		age: 20
// }
{
	error: 'No Token Found'
}

// the request from localhost:8000/152125?token=1&data=20181121
{
    name: 'John',
    age: 20,
    id: '152125',
    data: '20181121'
}
```

## The documented request

### Source code

```
// server.js
const mokker = require('mokker');

const controller = (data) => {
    const { body, query, params, hostQuery } = data;
    
    const response = Object.assign({}, body);
    response.id = params.id;
    response.date = query.date;
    response.token = hostQuery.token;
    
    return response;
};

const routes = [{
    method: 'post',
    url: '/api/:id',
    controller,
        docs: {
        title: 'Post Request',
        description: 'The example of a post request',
        fileName: 'post-request-docs',
        query: ['date'],
        hostQuery: ['token'],
        body: {
            name: '',
            age: 1
        }
	}
}];

mokker.start({ routes });
```



### Documentation

```
// ./docs/post-request-docs.md

# Post Request

> The example of a post request

## Method


POST

## URL

​```js
/api/:id
​```

## Host Query Parameters

> For mock development

​```js
[
  "token"
]
​```

## Query Parameters

​```js
[
  "date"
]
​```

## Body

​```js
{
  "name": "string",
  "age": "number"
}
​```

## Response

​```js
{
  "name": "string",
  "age": "number",
  "id": "string",
  "date": "string",
  "token": "string"
}
​```
```



## Ternary conroller

### Source code

```
// server.js
const mokker = require('mokker');

const controller = (data) => {
	const { ternary } = mokker;
	const { hostQuery: { token } } = data;
	return ternary({
        condition: !token,
        iftrue: {
            success: false,
            payload: null,
            errorMessage: 'No token found'
        },
        iffalse: ternary({
            condition: token === 'experimental'
            iftrue: {
                success: true,
                payload: {
                	token,
                	prop: true
                },
                errorMessage: null
            },
            iffalse: {
                success: true,
                payload: {
                	token
                },
                errorMessage: null
            }
        })
	})
};

const routes = [{
    method: 'get',
    url: '/api',
    controller,
    docs: {
        title: 'Ternary test',
        hostQuery: ['token']
    }
}];
```

### Response

```
// the request from localhost:8000
{
    success: false,
    payload: null,
    errorMessage: 'No token found'
}

// the request from localhost:8000?token=experimental
{
    success: true,
    payload: {
    	token: 'experimental',
    	prop: true
    },
    errorMessage: null
}

// the request from localhost:8000?token=1
{
    success: true,
    payload: {
    	token: 1
    },
    errorMessage: null
}
```

### Documentation

```
// ./docs/ternary-test.md
# Ternary test

## Method

GET

## URL
​```js
    /api
​```

## Host Query Parameters

> For mock development

​```js
    [
      "token"
    ]
​```

## Response

​```js
    {
      "success": "boolean",
      "?errorMessage": "string",
      "?payload": {
        "token": "string | number",
        "?prop": bool
      }
    }
​```

```























