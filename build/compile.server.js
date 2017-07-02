import fs from 'fs-extra'
import _debug from 'debug'
import webpackCompiler from './webpack-compiler'
import webpackServerConfig from './webpack.servercfg'
import config from '../config'
import _ from 'lodash'

const debug = _debug('app:bin:compile')
const paths = config.utils_paths

;(async function () {
  try {
    let startTime = new Date().getTime() / 1000;
    debug('Start server compile at ', startTime)
    const stats2 = await webpackCompiler(webpackServerConfig)
    if (stats2.warnings.length && config.compiler_fail_on_warning) {
      debug('Config set to fail on warning, exiting with status code "1".')
      process.exit(1)
    }
    debug('Copy static assets to sdist folder.')
    fs.copySync(paths.base('config/1_mp.lancertech.net_cert.crt'), paths.sdist('1_mp.lancertech.net_cert.crt'))
    fs.copySync(paths.base('config/2_mp.lancertech.net.key'), paths.sdist('2_mp.lancertech.net.key'))
    fs.copySync(paths.base('config/ca.mqtt.lock.cer'), paths.sdist('ca.mqtt.lock.cer'))
    fs.copySync(paths.base('config/apiclient_cert_1440629702.p12'), paths.sdist('apiclient_cert_1440629702.p12'))
    fs.copySync(paths.base('config/apiclient_cert_1454160902.p12'), paths.sdist('apiclient_cert_1454160902.p12'))
    fs.copySync(paths.base('config/apiclient_cert_1411146202.p12'), paths.sdist('apiclient_cert_1411146202.p12'))

    //fs.copySync(paths.server('windpress/models'), paths.sdist('models/'))
    //fs.copySync(paths.server('smartlock/slmodels'), paths.sdist('slmodels/'))
    //fs.copySync(paths.server('xxenergy/xxemodels'), paths.sdist('xxemodels/'))
    //fs.copySync(paths.server('coin/coinmodels'), paths.sdist('coinmodels/'))
    let endTime = new Date().getTime() / 1000;
    debug ('Finish compile at ', endTime, ', time elapse ', _.round(endTime - startTime, 3));

  } catch (e) {
    debug('Compiler encountered an error.', e)
    process.exit(1)
  }
})()
