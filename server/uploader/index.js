import _debug from 'debug'
const debug = _debug('app:server:uploader')

const uuid = require("uuid")
const path = require("path")
//const mount = require("koa-mount")
const parse = require("async-busboy")
const dateformat = require("dateformat")
const fs = require("fs")
const mkdirp = require("mkdirp")
const getRawBody = require('raw-body')
const contentType = require('content-type')
const crypto = require('crypto');

import config from '../../config'

export default class Uploader {
    constructor (app) {
        // save opts.
        this.app = app;
        this.uploads = config.utils_paths && config.utils_paths.uploads && config.utils_paths.uploads() || path.join(process.cwd(), 'uploads');
        debug ("init uploader! uploads in ", this.uploads);
        if (!fs.existsSync(this.uploads)) mkdirp.sync(this.uploads);
        // init router for apis.
        this.router = require('koa-router')({ prefix: '/apis' });
        this.registerServices();
    }

    registerServices() {
        var router = this.router;
        // database/user
        router.post('/upload/base64/:filename', this.uploadBase64.bind(this));
        router.post('/upload/form', this.uploadForm.bind(this));
        router.post('/upload/chunk', this.uploadChunked.bind(this));
        router.post('/v2/upload/chunk', this.uploadChunkedV2.bind(this));

        this.app.use(router.routes()).use(router.allowedMethods());
        // save router.
        //this.router = router;
    }

    async uploadBase64 (ctx, next) {
        //console.log (ctx.req);
        var filename = ctx.params.filename;
        var charset = 'utf-8';
        try {
            charset = contentType.parse(ctx.req).parameters.charset;
            //console.log ("get charset", charset);
        } catch (e) {
            console.log ("parse charset error!", e);
            charset = 'utf-8';
        }
        var rawText = await getRawBody(ctx.req, {
            encoding: charset
        });
        var destfile = this.genFileName(filename);

        // get image base64 data.
        var pos1 = rawText.indexOf (";base64,");
        if (pos1 < 0) {
            ctx.body = { errcode:-1, errmsg: "image content wrong!" };
            return;
        }
        pos1 = pos1 + ";base64,".length;
        var base64_data = rawText.substr (pos1);
        // // care!!! regular match() expend too much time, change to indexOf().
        // var matches = rawText.match(/^data:.+\/(.+);base64,(.*)$/);
        // var ext = matches[1];
        // var base64_data = matches[2];
        var buffer = new Buffer(base64_data, 'base64');

        const filepath = path.join(this.uploads, destfile);
        fs.writeFileSync (filepath, buffer);
        ctx.body = { errcode:0, file: destfile };

/*
        var data_url = req.body.file;
        var matches = data_url.match(/^data:.+\/(.+);base64,(.*)$/);
        var ext = matches[1];
        var base64_data = matches[2];
        var buffer = new Buffer(base64_data, 'base64');

        fs.writeFile(__dirname + '/media/file', buffer, function (err) {
            res.send('success');
        });
        var filename = ctx.params.filename;
        ctx.body = { errcode:0, filename: filename };
*/
        return;
    }

    async uploadForm (ctx, next) {
        // Validate Request
        if (!ctx.request.is("multipart/*")) {
            return await next()
        }

        // Parse request for multipart
        const {files, fields} = await parse(ctx.req)

        // Generate oss path
        let result = {}
        files.forEach(file => {
            result[file.filename] = this.genFileName(file.filename);
        })
        
        // Upload to OSS or folders
        try {
            await Promise.all(files.map(file => { return this.put(this.uploads, result[file.filename], file) }))
        } catch (err) {
            ctx.status = 500
            //ctx.body = `Error: ${err}`
            ctx.body = {errcode: -1, errmsg: err.message};
            return
        }
        //ctx.res.setHeader("Content-Type", "application/json")
        ctx.status = 200;
        ctx.body = { errcode: 0, files: result };
        // // Return result
        // ctx.status = 200
        // // Support < IE 10 browser
        // ctx.res.setHeader("Content-Type", "text/html")
        // ctx.body = JSON.stringify(store.get(result))
        return
    }

    async uploadChunked (ctx, next) {
        // Validate Request
        if (!ctx.request.is("multipart/*")) {
            return await next()
        }
        var msg = "";
        var errcode = 0;

        // Parse request for multipart
        const {files, fields} = await parse(ctx.req)
        debug ("uploadChunked:", fields);

        var file = files[0];

        var name = fields.name || file.filename;
        var hash = fields.hash || 'none';
        var count = parseInt(fields.count);
        var current = parseInt(fields.current);
        var size = parseInt(fields.size) || 0;
        var chunkSize = parseInt(fields.chunkSize);
        var start = parseInt(fields.start) || 0;
        var end = parseInt(fields.end) || 0;

        var destname = hash+"."+size+"."+name;
        const filepath = path.join(this.uploads, destname);
        var flags = 'r+'
        if (!fs.existsSync(filepath)) {
            flags = 'w+';
            debug ("exist ", filepath);
        }
        //debug ("file:",file);
        var serverfile = await this.write (filepath, file, start, flags);
        //ctx.res.setHeader("Content-Type", "application/json")
        if (current == count-1) {
            // finish. combine files.
            debug ("end of receiving file! check hash!");
            var hash2 = await this.hash (filepath);
            if (hash != hash2) {
                msg = "hash mismatch!"
                errcode = 1;
                debug ("error! hash mismatch! delete file?", "hash:", hash, ",cal:", hash2);
            }
        }
        ctx.status = 200;
        ctx.body = { errcode: errcode, msg, url: destname, current, count };
        return
    }

    async uploadChunkedV2 (ctx, next) {
        // Validate Request
        if (!ctx.request.is("multipart/*")) {
            return await next()
        }
        var msg = "";
        var errcode = 0;

        // Parse request for multipart
        const {files, fields} = await parse(ctx.req)
        debug ("uploadChunkedV2:", fields);

        var file = files[0];

        var name = fields.name || file.filename;
        var hash = fields.hash || 'none';
        var count = parseInt(fields.count);
        var current = parseInt(fields.current);
        //var size = parseInt(fields.size) || 0;
        var chunkSize = parseInt(fields.chunkSize);
        var start = parseInt(fields.start) || 0;
        var end = parseInt(fields.end) || 0;

        name = decodeURIComponent(name || '');
        //var destname = hash+"."+size+"."+name;
        var destname = hash+"."+name;
        const filepath = path.join(this.uploads, destname);
        var flags = 'r+'
        if (!fs.existsSync(filepath)) {
            flags = 'w+';
            debug ("exist ", filepath);
        }
        //debug ("file:",file);
        debug ("uploadChunkedV2:", filepath, start, flags);
        var serverfile = await this.write (filepath, file, start, flags);
        //ctx.res.setHeader("Content-Type", "application/json")
        if (current == count-1) {
            // finish. combine files.
            debug ("end of receiving file! check hash!");
            var hash2 = await this.hash (filepath);
            if (hash != hash2) {
                msg = "hash mismatch!"
                errcode = 1;
                debug ("error! hash mismatch! delete file?", "hash:", hash, ",cal:", hash2);
            }
        }
        ctx.status = 200;
        ctx.body = { errcode: errcode, msg, url: '/uploads/'+destname, current, count };
        return
    }

    hash (filepath) {
        return new Promise((resolve, reject) => {
            var start = new Date().getTime();
            var md5sum = crypto.createHash('md5');
            var stream = fs.createReadStream(filepath);
            stream.on('data', function(chunk) {
                md5sum.update(chunk);
            });
            stream.on('error', () => {
                reject (false);
            });
            stream.on('end', () => {
                var str = md5sum.digest('hex').toUpperCase();
                console.log('文件:'+filepath+',MD5签名为:'+str+'.耗时:'+(new Date().getTime()-start)/1000.00+"秒");
                resolve(str);
            });
        })
    }
    write (filepath, file, start, flags) {
        return new Promise((resolve, reject) => {
            const stream = fs.createWriteStream(filepath, {flags:flags, start:start})
            file.pipe(stream)
            file.on("error", (e) => { 
                debug ("error:",e);
                return reject(null) 
            })
            file.on("end", (e) => { 
                //debug ("end:",start);
                stream.end();
            })
            stream.on("close", (e)=> {
                //debug ("close:",e);
                return resolve(filepath) 
            })
        })
    }
    put (folder, filename, file) {
        return new Promise((resolve, reject) => {
            const filepath = path.join(folder, filename)
            mkdirp.sync(path.dirname(filepath))
            const stream = fs.createWriteStream(filepath)
            file.pipe(stream)
            file.on("end", () => { stream.end(); return resolve(filename) })
        })
    }

    genFileName (filename) {
        var destfile = `${path.basename(filename, path.extname(filename))}.${dateformat(new Date(), "yyyymmddHHMMss")}-${uuid.v4()}${path.extname(filename)}`
        return destfile;
    }
}
