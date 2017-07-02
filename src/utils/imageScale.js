var xdebug = window.myDebug('Utils:imageScale');

const calcDestRect = (srcRect, opts) => {
    var destWidth = srcRect.width;
    var destHeight = srcRect.height;
    var keepRatio = !!(opts && opts.keepRatio);
    if (keepRatio) {
        if (opts && opts.maxWidth && opts.maxHeight) {
            var ratio  = opts.maxWidth / srcRect.width;
            var ratioH = opts.maxHeight / srcRect.height;
            if (ratioH < ratio) ratio = ratioH;
            destWidth  = srcRect.width * ratio;
            destHeight = srcRect.height * ratio;
        } else if (opts && opts.maxWidth) {
            var ratio  = opts.maxWidth / srcRect.width;
            destWidth  = srcRect.width * ratio;
            destHeight = srcRect.height * ratio;
        } else if (opts && opts.maxHeight) {
            var ratio = opts.maxHeight / srcRect.height;
            destWidth  = srcRect.width * ratio;
            destHeight = srcRect.height * ratio;
        }
    } else {
        if (opts && opts.maxWidth && opts.maxHeight) {
            destWidth  = opts.maxWidth;
            destHeight = opts.maxHeight;
        } else if (opts && opts.maxWidth) {
            destWidth  = opts.maxWidth;
        } else if (opts && opts.maxHeight) {
            destHeight = opts.maxHeight;
        }
    }
    return { width: Math.floor(destWidth), height: Math.floor(destHeight) };
}

const getFileDataURL = (file) => {
    return new Promise ( (resolve, reject) => {
        var reader = new FileReader ();
        reader.onload = function (e) {
            resolve (e.target.result);
        }
        reader.onerror = function (e) {
            xdebug ("getFileDataURL error:", e);
            reject (e);
        }
        reader.readAsDataURL(file);
    } );
}

const getFilename = (url) => {
    if (url) {
        var m = url.toString().match(/.*\/(.+?)\./);
        if (m && m.length > 1) {
            return m[1];
        }
    }
    return null;
}

const basename = (name) => {
    if (name && name.lastIndexOf('.') > 0)
        return name.substr(0,name.lastIndexOf('.'));
    else
        return name;
}

export const imageUrlScale = (url, opts) => {
    /* 
       url: DataURL or string url
       opts: { 
       maxWidth=image.width, 
       maxHeight=image.height, 
       keepRatio=false,
       [filename] = file.name or none.
       }
    */
    // output: { width, height, dataURL, [filename] }
    return new Promise ( (resolve, reject) => {
        var img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = function () {
            var filename = null;
            if (url.indexOf (";base64,") < 0) {
                filename = getFilename (url) || 'noname';
                //filename = url;
            } else {
                filename = opts.filename || 'noname';
            }

            var destRect = calcDestRect ( { width: this.width, height: this.height }, opts);
            var canvas = document.createElement("canvas");
            canvas.width = destRect.width;
            canvas.height = destRect.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0, destRect.width, destRect.height);
            
            //var dataURL = canvas.toDataURL("image/png");
            //filename = basename(filename) + '.png';
            var dataURL = canvas.toDataURL("image/jpeg", 0.2);
            filename = basename(filename) + '.jpg';

            //var blob = canvas.toBlob("image/png");
            //var blob = canvas.toBlob("image/jpeg", 0.5);
            //xdebug ("dataURL:", dataURL);
            resolve ({ filename, dataURL, width: destRect.width, height: destRect.height });
            //alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
        };
        img.onerror = function (e) {
            xdebug ("error:", e);
            reject (e);
        };

        img.src = url;
    } );
}

export const imageFileScale = async (file, opts) => {
    // output: { width, height, dataURL, filename }
    var dataURL = await getFileDataURL (file);
    return await imageUrlScale (dataURL, { ...opts, filename:file.name });
}

export const imageFileScaleWrapper = async (file, opts) => {
    // opts: { maxWidth, maxHeight, keepRatio=true/false }
    // output: { width, height, dataURL, filename }
    return await imageFileScale (file, opts);
}


export const imageFileScale2 = (file, opts) => {
    return getFileDataURL (file)
        .then ((dataURL) => imageUrlScale (dataURL, opts))
}

export const imageFileListScale = async (files, opts) => {
    /* 
       opts: { 
       maxWidth=image.width, 
       maxHeight=image.height, 
       keepRatio=false,
       onProgress = (percent) => { xdebug (percent); }
       }
       
       output: [{ width, height, dataURL, filename }]
    */
    var list = [];
    for  (var i = 0; i < files.length; i++) {
        //var dataURL = await getFileDataURL (files[i]);
        //var dest = await imageUrlScale (dataURL, opts);
        var dest = await imageFileScale (files[i], opts);
        list.push (dest);
        var percent = 100 * (i+1) / files.length;
        opts && opts.onProgress && opts.onProgress (percent);
    }
    return list;
}

