import _debug from 'debug'
const debug = _debug('app:mosca')

var mosca = require('mosca')

var ascoltatore = {
    type: 'redis',
    redis: require('redis'),
    db: 12,
    port: 6379,
    return_buffers: true, // to handle binary payloads
    host: "localhost"
};

var moscaSettings = {
    port: 3883,
    backend: ascoltatore,
    persistence: {
        factory: mosca.persistence.Redis
    }
};

const createServer = () => {
    var server = new mosca.Server(moscaSettings);
    server.on('ready', () => {
        debug('Mosca server is up and running')
    });
    
    server.on('clientConnected', function(client) {
        debug('client connected', client.id);     
    });
    
    // fired when a message is received
    server.on('published', function(packet, client) {
        debug('Published', packet.topic, packet.payload);
    });
}

export default createServer;
