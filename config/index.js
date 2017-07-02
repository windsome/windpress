/* eslint key-spacing:0 spaced-comment:0 */
import path from 'path'
import _debug from 'debug'
import { argv } from 'yargs'
import ip from 'ip'
import fs from 'fs'

const localip = ip.address()
const debug = _debug('app:config')
debug('Creating default configuration. __dirname='+__dirname+', NODE_ENV='+process.env.NODE_ENV)

// ========================================================
// Default Configuration
// ========================================================
const config = {
  env : process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base  : path.resolve(__dirname, '..'),
  dir_client : 'src',
  dir_dist   : 'dist',
  dir_server : 'server',
  dir_sdist  : 'sdist',
  dir_test   : 'tests',
  dir_tmp    : 'tmp',
  dir_uploads: 'uploads',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host : localip, // use string 'localhost' to prevent exposure on local network
  server_port : process.env.PORT || 3000,
  server_port_https : process.env.PORT_HTTPS || 3001,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_css_modules     : true,
  compiler_devtool         : 'source-map',
  compiler_hash_type       : 'hash',
  compiler_fail_on_warning : false,
  compiler_quiet           : false,
  compiler_public_path     : '/',
  compiler_stats           : {
    chunks : false,
    chunkModules : false,
    colors : true
  },
  compiler_vendor : [
    'babel-polyfill',
    'history',
    'react',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux',
    'moment',
    'lodash',
  ],
  compiler_vendor2 : [
      'd3',
      'recharts',
  ],
  compiler_vendor3 : [
      'draft-js',
      'react-draft-wysiwyg'
  ],

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverage_reporters : [
    { type : 'text-summary' },
    { type : 'lcov', dir : 'coverage' }
  ],

  // ----------------------------------
  // Database Configuration
  // ----------------------------------
  // db : {
  //   database: "lock",
  //   username: null,
  //   password: null,
  //   options: {
  //     dialect: "sqlite",
  //     storage: "./tmp/db.development.sqlite"
  //   }
  // },
  db : {
    database: "wpcoin",
    username: "youruser",
    password: "yourpassword",
    options: {
      host: "localhost",
      port: 3306,
      dialect: "mysql",
      logging: function () {},
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      dialectOptions: {
        socketPath: "/var/run/mysqld/mysqld.sock"
      },
      define: {
        paranoid: true
      }
    }
  },

  // ----------------------------------
  // Https Configuration
  // ----------------------------------
  //https : {
  //  key: fs.readFileSync(__dirname + '/2_mp.lancertech.net.key'), 
  //  cert: fs.readFileSync(__dirname + '/1_mp.lancertech.net_cert.crt') 
  //}
}

/************************************************
-------------------------------------------------

All Internal Configuration Below
Edit at Your Own Risk

-------------------------------------------------
************************************************/

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env'  : {
    'NODE_ENV' : JSON.stringify(config.env)
  },
  'NODE_ENV'     : config.env,
  '__DEV__'      : config.env === 'development',
  '__PROD__'     : config.env === 'production',
  '__TEST__'     : config.env === 'test',
  '__DEBUG__'    : config.env === 'development' && !argv.no_debug,
  '__COVERAGE__' : !argv.watch && config.env === 'test',
  '__BASENAME__' : JSON.stringify(process.env.BASENAME || '')
}

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json')

config.compiler_vendor = config.compiler_vendor
  .filter((dep) => {
    if (pkg.dependencies[dep]) return true

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won''t be included in the webpack vendor bundle.
       Consider removing it from vendor_dependencies in ~/config/index.js`
    )
  })

config.compiler_vendor2 = config.compiler_vendor2
  .filter((dep) => {
    if (pkg.dependencies[dep]) return true

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won''t be included in the webpack vendor2 bundle.
       Consider removing it from vendor2_dependencies in ~/config/index.js`
    )
  })

config.compiler_vendor3 = config.compiler_vendor3
  .filter((dep) => {
    if (pkg.dependencies[dep]) return true

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won''t be included in the webpack vendor3 bundle.
       Consider removing it from vendor3_dependencies in ~/config/index.js`
    )
  })

// ------------------------------------
// Utilities
// ------------------------------------
const resolve = path.resolve
const base = (...args) =>
  Reflect.apply(resolve, null, [config.path_base, ...args])

config.utils_paths = {
  base   : base,
  client : base.bind(null, config.dir_client),
  dist   : base.bind(null, config.dir_dist),
  uploads: base.bind(null, config.dir_uploads),
  server : base.bind(null, config.dir_server),
  sdist  : base.bind(null, config.dir_sdist),
  tmp  : base.bind(null, config.dir_tmp),
}

// ========================================================
// Environment Configuration
// ========================================================
debug(`Looking for environment overrides for NODE_ENV "${config.env}".`)
const environments = require('./environments').default
const overrides = environments[config.env]
if (overrides) {
  debug('Found overrides, applying to default configuration.')
  Object.assign(config, overrides(config))
} else {
  debug('No environment overrides found, defaults will be used.')
}

var nextcfg = require('./cfg.coin.lancertech').default(config);
export default nextcfg;
//export default config
