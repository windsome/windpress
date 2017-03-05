# 大文件分块上传的库
PHP版本打文件分块上传库：
[ajaxuploader](http://www.albanx.com/ajaxuploader/pricing.php)
[plupload](http://www.plupload.com/download/)
Nodejs未找到好的
[nodejs 大文件断点续传](http://www.qdfuns.com/notes/18061/401bd2e8689bcc1ca3003873b06d4ec3:storey-3.html)
js-spark-md5用做前台md5计算， crypto用在后台
[FILE API 之 FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
[JS Buffer之atob](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/atob)
<http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript>

# XMLHttpRequest详细用法
[mozilla XMLHttpRequest用法](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest)

# 将base64转为binary.
## browser端将dataURL(base64编码)转为Blob，一般用于上传，比base64上传会省一部分流量
```
export const dataURL2Blob = (dataURL) => {
    var dataArray = dataURL.split(',');

    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataArray[1]);

    // separate out the mime component
    var mimeString = dataArray[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], {type: mimeString});
}
```

## nodejs端一般用file解析库busboy解析到一个Buffer
```
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

        return;
    }
```

## 后续工作，尝试使用 canvas.toBlob()得到图片的二进制数据，减少从base64到blob的开销试试。

