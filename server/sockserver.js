import _debug from 'debug'
const debug = _debug('app:sockserver')

import config from '../config'
const path = require("path")
var fs = require('fs');
import crc from 'crc';
import _ from 'lodash';

var uploads = config.utils_paths && config.utils_paths.uploads && config.utils_paths.uploads() || path.join(process.cwd(), 'uploads');

export class FileBufferManager {
    constructor () {
        if (!FileBufferManager.gInstance) {
            debug ("FileBufferManager constructor! must be singleton!");
            this.filename = null;
            this.data = null;
            this.version = 0;
            FileBufferManager.gInstance = this;
        }
        return FileBufferManager.gInstance;
    }

    setFile (filename) {
        if (this.filename == filename) {
            debug ("warning! current update file is ", filename);
            return true;
        }
        var filepath = path.join(uploads, filename);
        var stat = fs.statSync(filepath);
        if (!stat.isFile()) {
            debug ("not a file! filepath=", filepath);
            return false;
        }
        this.version = 0;
        var tmps = filename.split('.');
        if (tmps.length >= 2)
            this.version = parseInt(tmps[tmps.length-2]) || 0;
        this.data = fs.readFileSync(filepath);
        this.filename = filename;
        debug ("update file:", filename, ", version:", this.version, ", data:", this.data);
        return true;
    }
}

export function setLatestUpdateFile (filename) {
    return (new FileBufferManager()).setFile (filename);
}

const XAA = parseInt ('AA', 16);
const X55 = parseInt ('55', 16);
const X01 = parseInt ('01', 16);
const X02 = parseInt ('02', 16);
const X03 = parseInt ('03', 16);
const XBB = parseInt ('BB', 16);
const XDD = parseInt ('DD', 16);
const XCC = parseInt ('CC', 16);
const XEE = parseInt ('EE', 16);

//const PACK_SIZE = 1400;
var PACK_SIZE = 1400;
function setPackSize (size) {
    PACK_SIZE = size;
}

class DeviceClient {
    constructor (sock, index) {
        this.sock = sock;
        this.index = index;
        this.key = sock.remoteAddress + ':' + sock.remotePort;
        
        this.pktSize = PACK_SIZE;
        this.deny = false;

        this.status = null;
        this.data = null;
        this.error = null;
        this.errcode = 0;
        this.addTime = new Date().getTime();
        debug (this.key, " DeviceClient created!");
        this.broadcastAdd ();

        this.sock.on('data', this.onData.bind(this));
        this.sock.on('error', this.onError.bind(this));
        this.sock.on('close', this.onClose.bind(this));
    }
    //die (errcode) {
    //    if (errcode) this.errcode = errcode;
    //    this.broadcastDel ();
    //}
    //ignore () {
    //    this.sendCmd (X02, XEE);
    //    this.deny = true;
    //    this.error = "ignored!";
    //    this.errcode = 13;
    //    this.broadcastUpdate ();
    //}
    onClose (data) {
        debug (this.key, " DeviceClient onClose ", data);
        //this.die ();
        this.broadcastDel ();
        new DeviceClientManager().del (this);
    }
    onError (err) {
        debug (this.key, " DeviceClient onError:", err);
        //this.errcode = 3;
        this.error = "socket error!";
        this.errcode = 1;
        this.broadcastUpdate ();
        this.sock.destroy();
    }
    onData (data) {
        console.log (this.key, "data:", data);
        if (this.deny) {
            debug (this.key, " deny!");
            return;
        }
        if (data[0] !== XAA && data[1] !== X55) {
            debug ("unrecognized header!");
            this.error = "unrecognized header!";
            this.errcode = 2;
            this.broadcastUpdate ();
            return false;
        }
        if (data[2] !== X01 && data[2] !== X02 && data[2] !== X03) {
            debug ("unsupport attribute!");
            this.error = "unsupport attribute!";
            this.errcode = 3;
            this.broadcastUpdate ();
            return false;
        }
        if (crc.crc16(data) != 0) {
            debug ("crc check fail!");
            this.error = "crc check fail!";
            this.errcode = 4;
            this.broadcastUpdate ();
            return false;
        }

        if (data[3] == XBB) {
            var version = (data[4] << 8) + data[5];
            return this.cmdVersion (version);
        } else if (data[3] == XCC) {
            return this.cmdReady ();
        } else if (data[3] == XEE) {
            return this.cmdError ();
        } else {
            debug ("unsupport cmd!");
            this.error = "unsupport cmd!";
            this.errcode = 5;
            this.broadcastUpdate ();
            return false;
        }
    }

    cmdVersion (version) {
        // receive VERSION, check version whether update, and send UPDATE.
        var fm = new FileBufferManager ();
        if (!fm.data) {
            debug ("no file buffer!");
            this.sendCmd (X02, XEE);
            this.error = 'no update file online!';
            this.errcode = 6;
            this.broadcastUpdate ();
            return false;
        }
        if (fm.version == version) {
            debug ("version same! no need to update! update to ", fm.version, ", client version:", version);
            this.sendCmd (X02, XEE);
            this.error = 'version same! not update!';
            this.errcode = 7;
            this.broadcastUpdate ();
            return false;
        }
        
        var pktCount = Math.floor((fm.data.length + this.pktSize - 1) / this.pktSize);
        this.status = { oldVersion: version, newVersion: fm.version, packSize: this.pktSize, count: pktCount, current: 0 };
        this.data = fm.data;
        debug ("need update. SEND 0xDD COMMAND!", this.status);

        this.error = null;
        this.errcode = 0;
        this.broadcastUpdate ();
        // send UPDATE cmd.
        return this.sendCmd (X01, XDD);
    }
    
    cmdReady () {
        // receive READY, send buffer.
        if (!this.status) {
            debug ("client status error! maybe command mismatch or disorder!");
            this.error = "client status error! maybe command mismatch or disorder!";
            this.errcode = 8;
            this.broadcastUpdate ();
            return false;
        }
        if (!this.status.count) {
            debug ("client status error! no pkt need send?");
            this.error = "client status error! no pkt need send?";
            this.errcode = 9;
            this.broadcastUpdate ();
            return false;
        }
        if (this.status.current < this.status.count) {
            this.sendCmd (X03, XDD);
            this.status.current ++;
            if (this.status.count > 0 && (Math.floor(100 * this.status.current/this.status.count) % 5 == 0)) {
                this.error = Math.floor(this.status.current*100/this.status.count)+"%";
                this.errcode = 0;
                this.broadcastUpdate ();
            }
            if (this.status.current == this.status.count){
                this.error = 'finish'
                this.errcode = 0;
                this.broadcastUpdate ();
                (new DeviceClientManager()).finishOne();
            }
            return true;
        } else if (this.status.current == this.status.count) {
            this.error = "finish";
            this.errcode = 0;
            this.broadcastUpdate ();
        } else {
            debug ("finish? client:", client);
            this.error = "overflow! should not happen!";
            this.errcode = 10;
            this.broadcastUpdate ();
            return this.sendCmd (X02, XEE);
        }
    }
    cmdError () {
        // receive ERROR, resend last data?
        debug ("cmdError: client report error!");
        this.error = "client report error!";
        this.errcode = 11;
        this.broadcastUpdate ();
        return true;
    }

    sendCmd (cmd1, cmd2) {
        if (this.deny) {
            debug (this.key, " deny!");
            return;
        }
        var buf1 = null;
        if (cmd1 == X01 && cmd2 == XDD) {
            // send update cmd.
            var version = this.status && this.status.newVersion || 0;
            buf1 = new Buffer (6);
            buf1[0] = XAA; buf1[1] = X55; buf1[2] = X01; buf1[3] = XDD;
            buf1[4] = (version >>> 8) & 255;
            buf1[5] = version & 255;
        } else if (cmd1 == X03) {
            // send data packet.
            var client = this.status;
            buf1 = new Buffer (this.pktSize + 9);
            buf1.fill (0);
            buf1[0] = XAA; buf1[1] = X55; buf1[2] = X03;
            buf1[3] = (client.count >>> 8) & 255;
            buf1[4] = client.count & 255;
            buf1[5] = (client.current >>> 8) & 255;
            buf1[6] = client.current & 255;
            var pktSize = this.pktSize;
            var start = client.current * this.pktSize;
            if (client.current >= (client.count - 1))
                pktSize = this.data.length - client.current * this.pktSize;
            buf1[7] = (pktSize >>> 8) & 255;
            buf1[8] = pktSize & 255;
            this.data.copy (buf1, 9, start, start+pktSize);
            //debug ("count:", client.count, ", current:",client.current, ", pktSize:", pktSize, ",packet:", buf2);
        } else if (cmd1 == X02 && cmd2 == XEE) {
            // send error cmd.
            var errcode = this.errcode || 0;
            buf1 = new Buffer (6);
            buf1[0] = XAA; buf1[1] = X55; buf1[2] = X02; buf1[3] = XEE;
            buf1[4] = (errcode >>> 8) & 255;
            buf1[5] = errcode & 255;
        }

        var crcRet = crc.crc16(buf1);
        var buf2 = new Buffer (buf1.length+2);
        buf1.copy (buf2);
        buf2[buf1.length] = crcRet & 255;
        buf2[buf1.length+1] = (crcRet >>> 8) & 255;
        this.sock.write (buf2);
        return true;
    }

    broadcastUpdate () {
        this.updTime = new Date().getTime();
        this.broadcastStatus ("update");
    }
    broadcastAdd () {
        this.broadcastStatus ("add");
    }
    broadcastDel () {
        this.updTime = new Date().getTime();
        this.broadcastStatus ("del");
    }
    broadcastStatus (cmd, args) {
        var status = {cmd: cmd, id: this.index, key: this.key, error: this.error, errcode: this.errcode, ...this.status, addTime: this.addTime, updTime: this.updTime, ...args };
        new MessageManager().addMessage (status);
    }
    
}

export class DeviceClientManager {
    constructor () {
        if (!DeviceClientManager.gInstance) {
            debug ("DeviceClientManager constructor! must be singleton!");
            this.list = [];
            this.index = 0;
            this.finish = 0;
            DeviceClientManager.gInstance = this;
        }
        return DeviceClientManager.gInstance;
    }
    add (sock) {
        var device = new DeviceClient(sock, this.index);
        this.list.push (device);
        this.index++;
        return device;
    }
    del (device) {
        _.remove (this.list, (item) => {
            return item == device;
        });
    }
    finishOne () {
        this.finish++;
    }
    endAll () {
        this.list.map ((device) => {
            device.sock.end();
        });
    }
}

export class MessageManager {
    constructor () {
        if (!MessageManager.gInstance) {
            debug ("MessageManager constructor! must be singleton!");
            this.list = [];
            // timely broadcast message.
            this.intervalId = setInterval(() => {
                this.broadcastMessages();
            }, 2000);
            //clearInterval (this.intervalId);
            MessageManager.gInstance = this;
        }
        return MessageManager.gInstance;
    }

    addMessage (msg) {
        //debug ("addMessage ", msg);
        if (msg.cmd == 'update') {
            // if message contain id, remove old update messages.
            _.remove (this.list, (item) => {
                return item.cmd == 'update' && item.id == msg.id;
            });
        }
        this.list.push(msg);
    }
    broadcastMessages () {
        if (this.list.length <= 0) {
            // no message in list.
            return false;
        }
        // add an extra cmd, show how many device.
        var dm = new DeviceClientManager();
        this.list.push({cmd:'status', total: dm.index, inprocess: dm.list.length, finish:dm.finish});
        debug ("broadcastMessages:", this.list.length);
        new WebSocketClientManager().broadcastText(JSON.stringify(this.list));
        this.list.length = 0;
        return true;
    }
}

class WebSocketClient {
    constructor (conn) {
        this.conn = conn;
        var sock = conn.socket;
        this.key = sock.remoteAddress + ':' + sock.remotePort;
        debug (this.key, " WebSocketClient created!");
        this.conn.on('text', this.onText.bind(this));
        this.conn.on('error', this.onError.bind(this));
        this.conn.on('close', this.onClose.bind(this));
    }
    onError (err) {
        debug (this.key, " WebSocketClient onError: ", err);
    }
    onClose (code, reason) {
        debug (this.key, " WebSocketClient onClose: " + code, ", ", reason);
        new WebSocketClientManager().del (this);
    }
    onText (text) {
        debug ("receive data: ", text);
        try {
            var obj = JSON.parse(text);
            switch (obj.cmd) {
            case 'update':
                setLatestUpdateFile (obj.file);
                var filename = (new FileBufferManager()).filename;
                //this.sendText (JSON.stringify({cmd:'current_file', file:filename}));
                this.broadcastMessage('current_file', {file:filename})
                break;
            case 'get_current_file':
                var filename = (new FileBufferManager()).filename;
                //this.sendText (JSON.stringify({cmd:'current_file', file:filename}));
                this.broadcastMessage('current_file', {file:filename})
                break;
            case 'set_pack_size':
                setPackSize (obj.size || PACK_SIZE);
                break;
            case 'clear_devices':
                new DeviceClientManager().endAll();
                break;
            default:
                debug ("unsupport command ", obj);
                break;
            }
        } catch (e) {
            debug ("websocket error! ", e);
        }
        return true;
    }
    sendText (msg) {
        this.conn.sendText (msg);
    }
    broadcastMessage (cmd, args) {
        var msg = {cmd: cmd, ...args };
        new MessageManager().addMessage (msg);
    }
}

export class WebSocketClientManager {
    constructor () {
        if (!WebSocketClientManager.gInstance) {
            debug ("WebSocketClientManager constructor! must be singleton!");
            this.list = [];
            WebSocketClientManager.gInstance = this;
        }
        return WebSocketClientManager.gInstance;
    }

    add (sock) {
        var client = new WebSocketClient(sock);
        this.list.push(client);
        return client;
    }
    del (client) {
        _.remove (this.list, (item) => {
            return item == client;
        });
    }

    broadcastText (msg) {
        //debug ("WebSocketClientManager.broadcastText ", msg);
        this.list.map ((client) => {
            client.sendText (msg);
        });
        return true;
    }
}

export function deviceConnected (sock) {
    var deviceManager = new DeviceClientManager();
    var key = sock.remoteAddress + ':' + sock.remotePort;
    debug ("device:", key + ' CONNECTED');

    if (deviceManager.list.length >= 40) {
        debug ("device:", key + " too many device! deny!");
        sock.on('error', (error) => {
            debug ("device:", key + " onError! ", error);
            sock.end();
        });
        sock.on ("close", (data) => {
            debug ("device:", key + " onClose! ", data);
            sock.destroy();
        });
        sock.end();
    } else {
        deviceManager.add(sock);
    }
}

export function webSocketServer (conn) {
    var sock = conn.socket;
    var key = sock.remoteAddress + ':' + sock.remotePort;
    debug ("websocket:", key + ' CONNECTED ');
    var clientManager = new WebSocketClientManager();

    if (clientManager.list.length >= 80) {
        debug ("websocket:", key + " too many client! deny!");
        conn.on ('error', (err) => {
            debug ("websocket:", key + " onError! ", err);
        });
        conn.on ('close', (code, reason) => {
            debug ("websocket:", key + " onClose! ", error, ", ", reason);
        });
        conn.close();
    } else {
        clientManager.add(conn);
    }
}

export default deviceConnected;

