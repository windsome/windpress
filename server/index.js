/*
import config from '../config'
import server from '../server/main'
import _debug from 'debug'

const debug = _debug('app:bin:server')
const port = config.server_port
const host = config.server_host

server.listen(port)
debug(`Server is now running at http://${host}:${port}.`)
debug(`Server accessible via localhost:${port} if you are using the project defaults.`)
*/

///////////////////////////////////////////////////
// koa web server for all APPs.
///////////////////////////////////////////////////
var http = require("http");
var https = require('https');
  
import config from '../config'
import server from './mainserver'
import _debug from 'debug'
const debug = _debug('app:bin:server')

const host = config.server_host
const port = config.server_port
const port_https = config.server_port_https

http.createServer(server.callback()).listen(port);
//https.createServer( config.https, server.callback() ).listen(port_https);

debug(`Server is now running at http://${host}:${port}.`)
debug(`Https Server is now running at http://${host}:${port_https}.`)
debug(`Server accessible via localhost:${port} and  localhost:${port_https} if you are using the project defaults.`)

///////////////////////////////////////////////////
// socket server for firmware update of Xiexin Energy.
///////////////////////////////////////////////////
var net = require('net');
import sockserver, {webSocketServer} from './sockserver';
const PORT = 6969;
const HOST = '127.0.0.1';

net.createServer(sockserver).listen(PORT);
debug('sockServer listening on ' + HOST +':'+ PORT);

var ws = require("nodejs-websocket");
const PORT2 = 6970;
var serverWS = ws.createServer(webSocketServer).listen(PORT2);
debug('webSocketServer listening on ' + HOST +':'+ PORT2);

///////////////////////////////////////////////////
// mosac broker.
///////////////////////////////////////////////////
import createMosac from './mosca'
createMosac ();
debug ('mosca broker created!');
