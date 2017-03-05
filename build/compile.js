import fs from 'fs-extra'
import _debug from 'debug'
import webpackCompiler from './webpack-compiler'
import webpackConfig from './webpack.config'
//import webpackServerConfig from './webpack.servercfg'
import config from '../config'
import _ from 'lodash'

const debug = _debug('app:bin:compile')
const paths = config.utils_paths

;(async function () {
  try {
    let startTime = new Date().getTime() / 1000;
    debug('Start client compile at ', startTime, ", time:", new Date())
    const stats = await webpackCompiler(webpackConfig)
    if (stats.warnings.length && config.compiler_fail_on_warning) {
      debug('Config set to fail on warning, exiting with status code "1".')
      process.exit(1)
    }
    debug('Copy static assets to dist folder.')
    fs.copySync(paths.client('static'), paths.dist())
    let endTime = new Date().getTime() / 1000;
    debug ('Finish compile at ', endTime, ", time:", new Date(), ', time elapse ', _.round(endTime - startTime, 3));
  } catch (e) {
    debug('Compiler encountered an error.', e)
    process.exit(1)
  }
})()
