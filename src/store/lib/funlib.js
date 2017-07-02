import Errcode from 'Errcode';
import SparkMD5 from 'spark-md5';
import _ from 'lodash';

const UPLOAD_URL='/apis/upload/form';
const CHUNKED_UPLOAD_URL='/apis/upload/chunk';


export const calMd5sum = (file, progressCB = null, chunkSize = 1024*1024) => {
    return new Promise(function(resolve, reject) {
        var totalSize = file.size;
        var count = Math.ceil(totalSize / chunkSize);
        var current = 0;

        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        var startTime = new Date().getTime();
        var spark = new SparkMD5.ArrayBuffer();
        var reader = new FileReader();
        reader.onerror = function (e) {
            console.error ("file read error!");
            reject (new Errcode("file read error!", Errcode.ERR_FILE_READ_FAIL));
        }
        reader.onload = function (e) {
            spark.append( e.target.result);                 // append array buffer
            console.debug ("e:",e);
            var percent = Math.floor(100 * (current * chunkSize + e.loaded) / totalSize);
            progressCB && progressCB ({percent});
            current += 1;
            if (current < count) {
                loadNext();
            } else {
                var hash = spark.end().toUpperCase();
                var endTime = new Date().getTime();
                console.log ("md5sum:", hash, ", time:", endTime-startTime);
                progressCB && progressCB ({percent: 100});
                resolve({hash, time: (endTime-startTime)});
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

export const uploadChunk = (file, current, progressCB = null, hash='', chunkSize = 1024*1024) => {
    return new Promise(function(resolve, reject) {
        var totalSize = file.size;
        var count = Math.ceil(totalSize / chunkSize);
        var startTime = new Date().getTime();
        var start = 0;
        var end = 0;

        start = current * chunkSize;
        end = (current + 1) * chunkSize;
        if (end > totalSize) end = totalSize;
        
        console.debug ("size:"+totalSize+", count="+count+", start at:", startTime);
        var xhr = new XMLHttpRequest;
        xhr.open("POST", CHUNKED_UPLOAD_URL, true);
        xhr.upload.addEventListener("progress", (evt) => {
            if (evt.lengthComputable) {
                console.debug ("progress:", evt);
                if (totalSize > 0 && evt.total > 0) {
                    var percent = Math.floor(100 * (current * chunkSize /totalSize + (end-start) / totalSize * evt.loaded / evt.total));
                    progressCB && progressCB({percent});
                }
                // ...
            } else {
                // Unable to compute progress information since the total size is unknown
            }
        });
        xhr.upload.addEventListener("load", (evt) => {
            console.debug("load ", current, ": The transfer is complete.", evt);
            if (totalSize > 0 && evt.total > 0) {
                var percent = Math.floor(100 * (current * chunkSize /totalSize + (end-start) / totalSize * evt.loaded / evt.total));
                progressCB && progressCB({percent});
            }
        });
        xhr.upload.addEventListener("error", (evt) => {
            console.error("error: An error occurred while transferring the file.", evt);
            //dispatch (upload2Fail({filename: opts1.filename, errcode:3, msg:'upload error'}));
            reject(new Errcode('upload error', Errcode.ERR_UPLOAD_FAIL));
        });
        xhr.upload.addEventListener("abort", (evt) => {
            console.error("abort: The transfer has been canceled by the user.", evt);
            //dispatch (uploadFail("user abort!"));
            //dispatch (upload2Fail({filename: opts1.filename, errcode:4, msg:'user abort'}));
            reject(new Errcode('user abort', Errcode.ERR_UPLOAD_USER_ABORT));
        });
        xhr.onreadystatechange = (evt) => {
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                try {
                    console.debug (current, " onreadystatechange: 200 DONE!", evt);
                    var res = JSON.parse(xhr.responseText);
                    if (res.errcode == 0) {
                        //dispatch (uploadOk(res.files[filename]));
                        //opts1.current++;
                        var endTime = new Date().getTime();
                        console.log ("res:", res, ", time:", endTime-startTime);
                        progressCB && progressCB ({percent: 100});
                        resolve({...res, time: (endTime-startTime)});

                        // current ++;
                        // if (current < count) {
                        //     sendChunk();
                        // } else {
                        //     var endTime = new Date().getTime();
                        //     console.log ("res:", res, ", time:", endTime-startTime);
                        //     progressCB && progressCB ({percent: 100});
                        //     resolve({...res, time: (endTime-startTime)});
                        // }
                        //resolve(res);
                        return;
                    } else {
                        //dispatch (upload2Fail({filename: opts1.filename, errcode:5, msg:res.msg}));
                        console.error ("upload error!", xhr.responseText);
                        reject(new Errcode(res.msg, Errcode.ERR_UPLOAD_FAIL));
                    }
                } catch (e) {
                    console.error ("upload error!", e);
                    //dispatch (upload2Fail({filename: opts1.filename, errcode:6, msg:'upload error!'}));
                    reject(new Errcode (e.message, Errcode.ERR_UPLOAD_FAIL));
                }
            }
        };

        var formData = new FormData();
        formData.append("name", file.name);
        formData.append("hash", hash||'');
        formData.append("count", count);
        formData.append("current", current);
        formData.append("chunk", file.slice(start, end));
        formData.append("size", totalSize);
        formData.append("chunkSize", chunkSize);
        formData.append("start", start);
        formData.append("end", end);
        console.debug ("chunk:"+current+", start:"+start+", end:"+end);
        xhr.send(formData);
    });
}

export const uploadFile = (file, progressCB = null, hash='', chunkSize = 1024*1024) => {
    var totalSize = file.size;
    var count = Math.ceil(totalSize / chunkSize);
    var arr = new Array(count);
    _.fill (arr, 0);
    // 形成一个promise的链式调用，太费解了！！！
    const processArray = (array) => {
        var results = [];
        return array.reduce((p, item, index) => {
            console.debug ("index:", index);
            return p.then(() => {
                return uploadChunk(file, index, progressCB, hash, chunkSize).then(function(data) {
                    console.debug ("chunk index:"+index+", result:", data);
                    results.push(data);
                    return results;
                });
            });
        }, Promise.resolve());
    }

    return processArray (arr).then ((results) => {
        console.debug ("upload ok!", results);
        return _.last(results);
    });
}
