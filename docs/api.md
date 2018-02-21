# API

### `.start({ routes [, defaultPort, docsUrl] })`

Run the server

- `routes: [{ method, url, json, controller }]` – **required**, router settings
  - `method: string` – the request [method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
  - `url: string` – the endpoint url
  - `json: object` – the response JSON object of the request
  - `controller: (data, req, res) => object` – the custom controller
    - `data: { body, params, query, hostQuery }`
      - `body: object` – the body of the request
      - `params: object` – [route parameters](http://expressjs.com/en/guide/routing.html#route-parameters) `/api/:id`
      - `query: object` – object containing a property for each [query parameter](http://expressjs.com/en/api.html#req.query) `/api?x=1`
      - `hostQuery: object` – object containing of query properties from a host or to an endpoint
    - `req: object` – [the request Exress object](http://www.murvinlai.com/req-and-res-in-nodejs.html)
    - `res: object` – [the response Exress object](http://www.murvinlai.com/req-and-res-in-nodejs.html)
  - `docs: { title, description, fileName, query, body, hostQuery }` – for initialisation the docs-generation algorithm
    - `title: string ` – **required**
    - `description: string`
    - `fileName: string = title `
    - `query: string[]` – the list of queries which planned to use
    - `body: object` – the body structure which planned to use
    - `hostQuery: string[]` – the list of host queries which planned to use
- `defaultPort: nuber = 3000`
- `docsUrl: string = path.resolve(process.cwd(), 'docs') ` – the absolute path to keep the docs

### `.ternary({ condition, iftrue, iffalse }) => object`

The method to write a controller with conditions, if the documentation is **required**. [Example](https://github.com/fidelman/mokker/blob/master/docs/examples.md#ternary-conroller)

- `condtition: bool`
- `iftrue: object` – is returned when condition is true
- `iffalse: object`  – is returned when condition is false

