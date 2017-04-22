/**
 * Created by jack on 16-8-27.
 */

import Koa from 'koa';
import serve from 'koa-static';

const app = new Koa();
const config = require('../../config/webpack/entry');

if (process.env.NODE_ENV !== 'production') {
	const webpack = require('webpack');
	const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware');

	const compile = webpack(config);

	app.use(devMiddleware(compile, {
		// display no info to console (only warnings and errors)
		noInfo: false,
		stats: {
			colors: true,
			cached: false
		},
		contentBase: config.output.path,
		publicPath: config.output.publicPath
	}));
	app.use(hotMiddleware(compile, {}));
}

// koa static server
const staticServer = serve(config.output.path);
app.use(staticServer);

export default app;
