import { createActions } from 'redux-actions';
const { uploadRequest, uploadOk, uploadFail, uploadProgress, uploadListRequest, upload2Ok, upload2Fail, upload2Progress, hashRequest, hashOk, hashFail, hashProgress } = createActions('UPLOAD_REQUEST', 'UPLOAD_OK', 'UPLOAD_FAIL', 'UPLOAD_PROGRESS', 'UPLOAD_LIST_REQUEST', 'UPLOAD2_OK', 'UPLOAD2_FAIL', 'UPLOAD2_PROGRESS', 'HASH_REQUEST', 'HASH_OK', 'HASH_FAIL', 'HASH_PROGRESS');
import SparkMD5 from 'spark-md5';

const UPLOAD_URL='/apis/upload/form';
const CHUNKED_UPLOAD_URL='/apis/upload/chunk';

export const uploadFile1 = (evt) => {
    var filelist = [];
    for (var i = 0; i < evt.target.files.length; i++) {
        filelist.push(evt.target.files[i]);
    }
    var file = filelist[0];
    var filename = file && file.name;
    console.log ("file:", file);
    return (dispatch) => {
        // dispatch image names.
        dispatch (uploadRequest(filename));

        var formData = new FormData();
        formData.append("userfile", file);

        var xhr = new XMLHttpRequest;
        xhr.open("POST", UPLOAD_URL, true);
        xhr.upload.addEventListener("progress", (evt) => {
            var percent = 0;
            if (evt.lengthComputable) {
                percent = Math.floor(evt.loaded * 100 / evt.total);
                // ...
            } else {
                // Unable to compute progress information since the total size is unknown
            }
            dispatch (uploadProgress(percent));
        });
        xhr.upload.addEventListener("load", (evt) => {
            console.log("The transfer is complete.", evt);
            dispatch (uploadProgress(100));
            //dispatch (uploadOk());
        });
        xhr.upload.addEventListener("error", (evt) => {
            console.log("An error occurred while transferring the file.", evt);
            dispatch (uploadFail(evt.message));
        });
        xhr.upload.addEventListener("abort", (evt) => {
            console.log("The transfer has been canceled by the user.", evt);
            dispatch (uploadFail("user abort!"));
        });
        //// One can also detect all three load-ending conditions (abort, load, or error) using the loadend event:
        //xhr.addEventListener("loadend", (evt) => {
        //    console.log("The transfer finished (although we don't know if it succeeded or not).");
        //});

        xhr.onreadystatechange = () => {
            console.log(xhr.response);
            console.log(xhr.responseText);
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                try {
                    var res = JSON.parse(xhr.responseText);
                    if (res.errcode == 0) {
                        dispatch (uploadOk(res.files[filename]));
                        return;
                    }
                } catch (e) {
                    console.log ("error:", e);
                }
            } else {
                console.log("what's wrong?", xhr);
            }
            //dispatch (uploadFail("fail!"));
        };

        xhr.send(formData);
    }
}

//export const uploadFiles = (evt) => {
export const uploadFile = (evt) => {
    var filelist = [];
    for (var i = 0; i < evt.target.files.length; i++) {
        filelist.push(evt.target.files[i]);
    }
    return uploadFilesChunked (filelist);
}

const DEF_OPTS = {
    chunkSize: 1048576, // 1M every chunk.
    checkHash: true, // use MD5SUM check first.
}
export const uploadFilesChunked = (filelist, opts) => {
    // 用reduce,promise方式，图片一张张加载，节省资源
    return (dispatch) => {
        // dispatch image names.
        var db = {};
        var fileinfos = filelist.map ( (file) => {
            var opts = { ...DEF_OPTS, ...opts, size: file.size, filename: file.name, mimetype: file.type, file: file };
            var count = Math.ceil(opts.size / opts.chunkSize);
            //return { ...opts, count: count, current: 0 };
            db[file.name] = { ...opts, count: count, current: 0 };
            return file.name;
        } );
        dispatch ( uploadListRequest({db, list: fileinfos}) );

        // 形成一个promise的链式调用，太费解了！！！
        const processArray = (array, fn) => {
            var results = [];
            console.log ("array:::", array);
            return array.reduce((p, item) => {
                //console.log ("p", p, "item", item);
                return p.then(() => {
                    return fn(item).then(function(data) {
                        console.log ("item:", item, ",data:", data);
                        results.push(data);
                        return results;
                    });
                });
            }, Promise.resolve());
        }

        const calMd5sum = (opts1) => {
            return new Promise(function(resolve, reject) {
                var totalSize = opts1.size;
                var count = opts1.count;
                var current = 0;
                var chunkSize = opts1.chunkSize;
                var file = opts1.file;

                var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
                var startTime = new Date().getTime();
                var spark = new SparkMD5.ArrayBuffer();
                var reader = new FileReader();
                reader.onerror = function (e) {
                    console.log ("file read error!");
                    dispatch (hashFail("file read error!"));
                    dispatch (upload2Fail({filename: opts1.filename, errcode:1, msg:'file read error!'}));
                    reject (new Error("file read error!"));
                }
                reader.onload = function (e) {
                    spark.append( e.target.result);                 // append array buffer
                    console.log ("e:",e);
                    var percent = Math.floor(100 * (current * chunkSize + e.loaded) / opts1.size);
                    dispatch (upload2Progress({ filename: opts1.filename, progress: percent }));
                    dispatch (hashProgress(percent));

                    current += 1;
                    if (current < count) {
                        loadNext();
                    } else {
                        var hash = spark.end().toUpperCase();
                        var endTime = new Date().getTime();
                        console.log ("md5sum:", hash, ", time:", endTime-startTime);
                        dispatch (upload2Progress({ filename: opts1.filename, hash:hash }));
                        dispatch (hashOk(hash));
                        resolve(hash);
                    }
                };
                const loadNext = () => {
                    var start = current * chunkSize;
                    var end = start + chunkSize;
                    if (end > totalSize) end = totalSize;
                    reader.readAsArrayBuffer(blobSlice.call(file, start, end))
                }
                dispatch (hashRequest(opts1.filename));
                loadNext();
            });
        }

        const uploadOneChunk = (opts1) => {
            return new Promise(function(resolve, reject) {
                var start = opts1.current * opts1.chunkSize;
                var end = (opts1.current + 1) * opts1.chunkSize;
                if (end > opts1.size) end = opts1.size;

                var formData = new FormData();
                formData.append("name", opts1.filename);
                formData.append("hash", opts1.hash||opts1.filename);
                formData.append("count", opts1.count);
                formData.append("current", opts1.current);
                formData.append("chunk", opts1.file.slice(start, end));
                formData.append("size", opts1.size);
                formData.append("chunkSize", opts1.chunkSize);
                formData.append("start", start);
                formData.append("end", end);
                console.log ("start:", start, ", end:", end);
                var xhr = new XMLHttpRequest;
                xhr.open("POST", CHUNKED_UPLOAD_URL, true);
                xhr.upload.addEventListener("progress", (evt) => {
                    if (evt.lengthComputable) {
                        console.log ("progress:", evt);
                        //opts1[opts1.current] = evt.loaded;
                        if (opts1.size > 0 && evt.total > 0) {
                            var percent = Math.floor(100 * (opts1.current * opts1.chunkSize /opts1.size + (end-start) / opts1.size * evt.loaded / evt.total));
                            //var percent = Math.floor(100 * ( opts1.current / opts1.count + evt.loaded / evt.total / opts1.count));
                            dispatch (upload2Progress({ filename: opts1.filename, progress: percent }));
                            dispatch (uploadProgress(percent));

                        }
                        // ...
                    } else {
                        // Unable to compute progress information since the total size is unknown
                    }
                });
                xhr.upload.addEventListener("load", (evt) => {
                    console.log("load ", opts1.current, ": The transfer is complete.", evt);
                    if (opts1.size > 0 && evt.total > 0) {
                        var percent = Math.floor(100 * (opts1.current * opts1.chunkSize /opts1.size + (end-start) / opts1.size * evt.loaded / evt.total));
                        //var percent = Math.floor(100 * ( (opts1.current + 1) / opts1.count));
                        dispatch (upload2Progress({ filename: opts1.filename, progress: percent }));
                        dispatch (uploadProgress(percent));
                    }
                    //opts1[opts1.current] = { loaded: evt.loaded, total: evt.total };
                    //dispatch (uploadProgress(100));
                    //resolve(true);
                });
                xhr.upload.addEventListener("error", (evt) => {
                    console.log("error: An error occurred while transferring the file.", evt);
                    dispatch (upload2Fail({filename: opts1.filename, errcode:3, msg:'upload error'}));
                    resolve(new Error('upload error'));
                });
                xhr.upload.addEventListener("abort", (evt) => {
                    console.log("abort: The transfer has been canceled by the user.", evt);
                    //dispatch (uploadFail("user abort!"));
                    dispatch (upload2Fail({filename: opts1.filename, errcode:4, msg:'user abort'}));
                    resolve(new Error('user abort'));
                });
                xhr.onreadystatechange = (evt) => {
                    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                        try {
                            console.log (opts1.current, " onreadystatechange: 200 DONE!", evt);
                            var res = JSON.parse(xhr.responseText);
                            if (res.errcode == 0) {
                                //dispatch (uploadOk(res.files[filename]));
                                opts1.current++;
                                resolve(res);
                                return;
                            } else {
                                dispatch (upload2Fail({filename: opts1.filename, errcode:5, msg:res.msg}));
                                console.log ("upload error!", xhr.responseText);
                                reject(new Error(res.msg));
                            }
                        } catch (e) {
                            console.log ("upload error!", e);
                            dispatch (upload2Fail({filename: opts1.filename, errcode:6, msg:'upload error!'}));
                            reject(new Error ('upload error!'));
                        }
                    }
                };

                xhr.send(formData);
            });
        }

        const processFile = (filename) => {
            dispatch (uploadRequest(filename));
            var opts1 = db[filename];
            return new Promise(function(resolve, reject) {
                calMd5sum (opts1).then ( (result) => {
                    opts1.hash = result;
                    var arr = [];
                    var count = opts1.count;
                    while (count-- > 0) 
                        arr.push (opts1);
                    console.log ("processArray arr:", arr, ", opts1", opts1);
                    return processArray (arr, uploadOneChunk);
                } ).then ( (result) => {
                    console.log ("resolve", result, ", opts1:", opts1);
                    dispatch (upload2Ok({filename: opts1.filename, url: result[0].url}));
                    dispatch (uploadOk(result[0].url));
                    resolve (result)
                } ).catch ( (reason) => {
                    console.log ("reject:", reason);
                    //dispatch (upload2Fail({filename: opts1.filename, errcode:7, msg:'upload error!'}));
                    dispatch (uploadFail("upload error!"));
                    reject (reason);
                } );
            });
        }

        const processFile2 = (filename) => {
            var opts1 = db[filename];
            var arr = [];
            var count = opts1.count;
            while (count-- > 0) 
                arr.push (opts1);
            console.log ("processArray arr:", arr, ", opts1", opts1);
            return processArray (arr, uploadOneChunk).then(function(result) {
                console.log ("resolve", result);
            }, function(reason) {
                console.log ("reject:", reason);
            });
        }
        
        console.log ("processArray fileinfos:", fileinfos);
        return processArray(fileinfos, processFile).then(function(result) {
            console.log ("resolve", result);
        }, function(reason) {
            console.log ("reject:", reason);
        });
    }
}


const ACTION_HANDLERS = {
    ['UPLOAD_REQUEST']: (state, action) =>  ({ ...state, fetching: true, error:null, progress: 0, name: action.payload, url: null }),
    ['UPLOAD_OK']: (state, action) => { 
        var db = { ...state.db, [state.name]:action.payload }
        return ({ ...state, db: db, fetching:false, error:null, url: action.payload }) },
    ['UPLOAD_FAIL']: (state, action) => ({ ...state, fetching: false, error: action.payload }),
    ['UPLOAD_PROGRESS']: (state, action) => ({ ...state, fetching: true, progress: action.payload }),
    ['UPLOAD2_OK']: (state, action) => { 
        var opts = state.db[action.payload.filename];
        var db = { ...state.db, [action.payload.filename]: {...opts, ...action.payload} }
        return ({ ...state, db: db }) },
    ['UPLOAD2_FAIL']: (state, action) => { 
        var opts = state.db[action.payload.filename];
        var db = { ...state.db, [action.payload.filename]: {...opts, ...action.payload} }
        return ({ ...state, db: db }) },
    ['UPLOAD2_PROGRESS']: (state, action) => { 
        var opts = state.db[action.payload.filename];
        var db = { ...state.db, [action.payload.filename]: {...opts, ...action.payload} }
        return ({ ...state, db: db }) },
    ['UPLOAD_LIST_REQUEST']: (state, action) => { 
        var db = { ...state.db, ...action.payload.db }
        return ({ ...state, db: db, list: action.payload.list }) },

    ['HASH_REQUEST']: (state, action) => ({ ...state, hashing:true, error:null, name: action.payload }),
    ['HASH_OK']: (state, action) => ({ ...state, hashing:false, error:null, hash: action.payload }),
    ['HASH_FAIL']: (state, action) => ({ ...state, hashing: false, error: action.payload }),
    ['HASH_PROGRESS']: (state, action) => ({ ...state, hashing: true, progress: action.payload }),
}

const initialState = { db: {}, fetching: false, hashing: false, error: null, progress: 0, name: null, url: null, list:[] }
export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

