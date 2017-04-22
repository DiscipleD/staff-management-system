/**
 * Created by jack on 16-4-16.
 */
import 'babel-polyfill';

import Koa from 'koa';
import mount from 'koa-mount';
import rewrite from 'koa-rewrite';

import * as middleware from './middleware';
import staticServer from './staticServer';

const app = new Koa();

const PORT = parseInt(process.env.PORT || 8088);

app.use(middleware.serverErrorHandler);
app.use(middleware.pageNotFound);
app.use(middleware.responseTime);
app.use(middleware.logger);

app.use(rewrite(/^\/[^(.|_)]*$/, '/'));

app.use(mount('/', staticServer));

app.on('error', function(err){
	console.log('server error', err);
});

app.listen(PORT, () => {
	console.log(`Blog is running, port: ${PORT}`)
});
