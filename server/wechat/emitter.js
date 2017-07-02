import { EventEmitter } from 'events';

export class SvrEmitter extends EventEmitter {
    constructor () {
        super ();
    }

    wechatSendOut (obj) {
        this.emit('wechatout', obj);
    }
    onFromWechat (fn) {  
        this.on('wechatout', fn);
    }

    sendToWechat (obj) {
        this.emit('intowechat', obj);
    }
    onWechatRecv (fn) {  
        this.on('intowechat', fn);
    }
}

const globalEmitter = new SvrEmitter ();

export default globalEmitter;
