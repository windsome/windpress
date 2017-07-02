import path from 'path'
import webpack from 'webpack'
import config from '../config'
import _debug from 'debug'
var nodeExternals = require('webpack-node-externals');

const debug = _debug('app:webpack:config')
const paths = config.utils_paths
const {__DEV__, __PROD__, __TEST__} = config.globals

debug('Create configuration. __DEV__='+__DEV__+',__PROD__='+__PROD__+',__TEST__='+__TEST__)
const webpackConfig = {
  name: 'server',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  devtool: config.compiler_devtool,
  resolve: {
    root: paths.server(),
    extensions: ['', '.js', '.jsx']
  },
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  module: {}
}
// ------------------------------------
// Entry Points
// ------------------------------------
const SERVER_ENTRY_PATHS = [
    paths.server('index.js')
]

webpackConfig.entry = {
  server: SERVER_ENTRY_PATHS,
}

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
//  filename: `[name].[${config.compiler_hash_type}].js`,
  filename: "index.js",
  path: paths.sdist(),
  publicPath: config.compiler_public_path
}
debug('windsome:filename='+webpackConfig.output.filename+",path="+webpackConfig.output.path+",publicPath="+webpackConfig.output.publicPath);

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin(config.globals),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      unused: true,
      dead_code: true,
      warnings: false
    }
  })
]


// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.loaders = [{
  test: /\.(js|jsx)$/,
  exclude: [/node_modules/, 'src'],
  //include: [paths.server()],
  loader: 'babel',
  query: {
    cacheDirectory: true,
    plugins: ['transform-decorators-legacy', 'transform-runtime'],
    presets: ['es2015', 'react', 'stage-0']
  }
},
{
  test: /\.json$/,
  exclude: ['package.json'],
  //include: [paths.server()],
  loader: 'json'
}]


export default webpackConfig
