import _debug from 'debug'
const debug = _debug('app:server:main')
import 'isomorphic-fetch';
import Koa from 'koa'
import convert from 'koa-convert'
import mount from 'koa-mount';
import serve from 'koa-static'
import proxy from 'koa-proxy'
import historyApiFallback from 'koa-connect-history-api-fallback'
import webpack from 'webpack'

import webpackConfig from '../build/webpack.config'
import config from '../config'
import webpackDevMiddleware from './middleware/webpack-dev'
import webpackHMRMiddleware from './middleware/webpack-hmr'

const paths = config.utils_paths
const app = new Koa()

var session = require('koa-generic-session');
var RedisStore = require('koa-redis');
var rstore = new RedisStore();
rstore._redisClient.del('qrscene');
//rstore._redisClient.flushdb( function (err, succeeded) {
//    console.log("clear redis database ", succeeded); // will be true if successfull
//});

app.keys = ['keys', 'keykeys'];
app.use(convert(session({
  store: rstore
})));

app.use(async (ctx, next) => {
    console.log ("["+ctx.method+"] "+ctx.path+", query=", ctx.query);
    //console.log ("["+ctx.method+"] "+ctx.path+", query=", ctx.query, ", session=", ctx.session);
    await next();
})

var bodyParser = require('koa-bodyparser');
app.use(convert(bodyParser()));

//var json = require('koa-json'); // response json body.
//app.use(convert(json()));

import UploaderApis from './uploader';
var uploader = new UploaderApis(app);

import WxoauthApis from './wxoauth';
var Wxoauth = new WxoauthApis(app);
import CoinApis from './coin';
var Coin = new CoinApis(app);

// Enable koa-proxy if it has been enabled in the config.
if (config.proxy && config.proxy.enabled) {
  app.use(convert(proxy(config.proxy.options)))
}

// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement isomorphic
// rendering, you'll want to remove this middleware.
app.use(convert(historyApiFallback({
  verbose: false
})))

// uploads folder, for upload/download.
app.use(serve(paths.uploads()))
app.use(mount('/uploads', serve(paths.uploads())));

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
  const compiler = webpack(webpackConfig)

  // Enable webpack-dev and webpack-hot middleware
  const { publicPath } = webpackConfig.output

  app.use(webpackDevMiddleware(compiler, publicPath))
  app.use(webpackHMRMiddleware(compiler))

  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(serve(paths.client('static')))
} else {
  debug(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  )

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(serve(paths.dist()))
}

app.use(function (ctx, next) {
    var rawText = "";
    console.log ("not done! ["+ctx.req.method+"]["+ctx.path+"]["+ctx.req.url+"] ");
    //this.request.body = JSON.parse(rawText);
})

export default app
