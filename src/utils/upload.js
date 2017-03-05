import SparkMD5 from 'spark-md5';
import dataURL2Blob from './dataURL2Blob';
var xdebug = window.myDebug('Utils:upload');

const CHUNKED_UPLOAD_URL='/apis/v2/upload/chunk';
const DEFAULT_CHUNK_SIZE = (1024 * 1024);

export const calMd5sum = (src, opts) => {
    /*
      src: File or Blob.
      opts: {
      chunkSize: 1024*1024,
      onProgress: (percent)=>{xdebug(percent);}
      }
      output: md5sum
      fail: Error
     */

    return new Promise(function(resolve, reject) {
        var totalSize = src.size;
        var chunkSize = opts && opts.chunkSize || DEFAULT_CHUNK_SIZE;
        var file = src;
        var count = Math.ceil (totalSize/chunkSize);
        var current = 0;

        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        var startTime = new Date().getTime();
        var spark = new SparkMD5.ArrayBuffer();
        var reader = new FileReader();
        reader.onerror = function (e) {
            reject (new Error("file read error!"));
        }
        reader.onload = function (e) {
            spark.append( e.target.result);                 // append array buffer
            //xdebug ("e:",e);
            var percent = Math.floor(100 * (current * chunkSize + e.loaded) / src.size);
            if (opts && opts.onProgress) opts.onProgress (percent);

            current += 1;
            if (current < count) {
                loadNext();
            } else {
                var hash = spark.end().toUpperCase();
                var endTime = new Date().getTime();
                xdebug ("md5sum:", hash, ", time:", endTime-startTime);
                //if (opts && opts.onProgress) opts.onProgress (100);
                resolve(hash);
            }
        };
        const loadNext = () => {
            var start = current * chunkSize;
            var end = start + chunkSize;
            if (end > totalSize) end = totalSize;
            reader.readAsArrayBuffer(blobSlice.call(file, start, end))
        }
        loadNext();
    });
}


const uploadOneChunk = (src, opts) => {
    /*
      src: File or Blob.
      opts: {
      chunkSize:1024*1024,
      chunkCount: 1,
      chunkCurrent: 0
      onProgress: (percent)=>{xdebug(percent);}
      filename:'noname',
      hash:'nohash',
      }
      output: md5sum
      fail: Error
     */
    const onProgress = (percent) => {
        opts && opts.onProgress && opts.onProgress (percent);
    }

    return new Promise(function(resolve, reject) {
        var opt = { 
            chunkSize: DEFAULT_CHUNK_SIZE, 
            chunkCount: 1, 
            chunkCurrent: 0, 
            filename: 'noname', 
            hash:'nohash',
                ...opts
        }
        xdebug ("uploadOneChunk:", src, opts, opt);
        var start = opt.chunkCurrent * opt.chunkSize;
        var end = start + src.size;

        var formData = new FormData();
        formData.append("name", opt.filename);
        formData.append("hash", opt.hash||opt.filename);
        formData.append("count", opt.chunkCount);
        formData.append("current", opt.chunkCurrent);
        formData.append("chunk", src);
        //formData.append("size", src.size);
        formData.append("chunkSize", opt.chunkSize);
        formData.append("start", start);
        formData.append("end", end);
        xdebug ("formData:", formData);
        var xhr = new XMLHttpRequest;
        xhr.open("POST", CHUNKED_UPLOAD_URL, true);
        xhr.upload.addEventListener("progress", (evt) => {
            if (evt.lengthComputable) {
                xdebug ("progress:", evt);
                if (evt.total > 0) {
                    var percent = Math.floor(100 * evt.loaded / evt.total);
                    onProgress (percent);
                }
                // ...
            } else {
                // Unable to compute progress information since the total size is unknown
            }
        });
        xhr.upload.addEventListener("load", (evt) => {
            xdebug ("load ", opt.chunkCurrent, ": The transfer is complete.", evt);
            //if (evt.total > 0) {
                //onProgress (100);
            //}
        });
        xhr.upload.addEventListener("error", (evt) => {
            xdebug ("error: An error occurred while transferring the file.", evt);
            reject(new Error('upload error'));
        });
        xhr.upload.addEventListener("abort", (evt) => {
            xdebug("abort: The transfer has been canceled by the user.", evt);
            reject(new Error('user abort'));
        });
        xhr.onreadystatechange = (evt) => {
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                try {
                    xdebug ("onreadystatechange: 200 DONE! ", evt);
                    var res = JSON.parse(xhr.responseText);
                    if (res.errcode == 0) {
                        resolve(res);
                        return;
                    } else {
                        xdebug ("upload error!", xhr.responseText);
                        reject(new Error(res.message));
                    }
                } catch (e) {
                    xdebug ("upload error!", e);
                    reject(new Error ('upload error!'));
                }
            }
        };

        xhr.send(formData);
    });
}

export const uploadFile = async (src, opts) => {
    /*
      src: File or Blob.
      opts: {
      chunkSize:1024*1024,
      onProgress: (percent)=>{xdebug(percent);}
      filename:'noname',
      hash:'nohash',
      }
      output: md5sum
      fail: Error
     */
    
    var opt = { 
        chunkSize: DEFAULT_CHUNK_SIZE, 
        filename: src.name || 'noname', 
        hash:'nohash',
            ...opts
    }
    var chunkCount = Math.ceil (src.size / opt.chunkSize);
    opt.chunkCount = chunkCount;

    xdebug ("uploadFile:", opt);
    var ret = null;
    for (var i = 0; i < chunkCount; i++) {
        var start = i * opt.chunkSize;
        var end = start + opt.chunkSize;
        if (end > src.size) end = src.size;
        var chunk = src.slice (start, end);
        
        const onProgress = (percent) => {
            var loaded = i * opt.chunkSize + percent * chunk.size / 100;
            opt && opt.onProgress && opt.onProgress(loaded * 100 / src.size);
        }
        ret = await uploadOneChunk (chunk, { ...opt, chunkCurrent:i, onProgress });
    }

    return ret;
}

export const hash$UploadFile = async (src, opts) => {
    /*
      src: File or Blob.
      opts: {
      chunkSize:1024*1024,
      onProgress: (percent)=>{xdebug(percent);}
      filename:'noname',
      }
      output: md5sum
      fail: Error
     */
    const onProgress1 = (percent) => {
        xdebug ("hash$UploadFile", parseInt(percent*0.5));
    }
    const onProgress2 = (percent) => {
        xdebug ("hash$UploadFile", parseInt(50+percent*0.5));
    }
    var hash = await calMd5sum (src, { onProgress: onProgress1 })
    var ret2 = await uploadFile (src, { ...opts, hash, onProgress: onProgress2 });
    return ret2;
}

export const hash$UploadDataURLs = async (srcList, opts) => {
    /*
      src: DataURL List.
      [{dataURL, filename, width, height} ... ]
      opts: {
      chunkSize:1024*1024,
      onProgress: (percent)=>{xdebug(percent);}
      }
      output: md5sum
      fail: Error
     */
    var retList = [];
    for (var i = 0; i < srcList.length; i++) {
        var src = srcList[i];
        var blob = dataURL2Blob (src.dataURL);
        const onProgress = (percent) => {
            xdebug ("hash$UploadFile", parseInt(percent*(i+1)/srcList.length));
        }
        var ret = await hash$UploadFile (blob, {filename: src.filename, onProgress});
        retList.push (ret);
    }
    return retList;
}

