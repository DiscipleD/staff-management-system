## INSTALL
npm i

## RUN
npm start

## BUILD
npm run build

## Start server
npm run start:server

## Stop server
npm run stop:server

Fix koa-webpack-middleware. https://github.com/leecade/koa-webpack-middleware/pull/38/files

```
// node_modules/koa-webpack-middleware/lib/devMiddleware.js #29
- ctx.headers[name] = value

+ ctx.set(name, value)

```
