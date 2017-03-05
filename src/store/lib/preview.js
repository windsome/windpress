import { createActions } from 'redux-actions';
const { appendImageList, scaleImageOk, scaleImageFail, deleteImage } = createActions('APPEND_IMAGE_LIST', 'SCALE_IMAGE_OK', 'SCALE_IMAGE_FAIL', 'DELETE_IMAGE');


export const addImage4 = (evt) => {
    // 用回调函数方式，一张张加载图片，比较节省资源，不会卡死
    var filelist = [];
    for (var i = 0; i < evt.target.files.length; i++) {
        filelist.push(evt.target.files[i]);
    }

    return (dispatch) => {
        // dispatch image names.
        var imginfos = filelist.map ( (file) => {
            //console.log ("file:",file);
            return { filename: file.name, mimetype: file.type, file: file };
        } );
        dispatch ( appendImageList(imginfos) );

        // dispatch image data.
        var reader = new FileReader();
        var image = new Image();
        var canvas = document.createElement("canvas");
        var ctxt = canvas.getContext("2d");

        // This function repeatedly calls itself until the files are all read.
        const readFiles = (index) => {
            if ( index == filelist.length ) {
                // we are done.
                console.log( "Done reading images!", index );
            } else {
                var file = filelist[index];
                console.log ("readImage:", index, " file:", file);
                reader.onerror = function (e) {
                    console.log ("image load error!");
                    dispatch(scaleImageFail({filename:file.name, status:false}));
                    readFiles (index+1);
                }
                reader.onload = function (e) {
                    //uploader.imgdatas[file.name] = e.target.result;
                    image.src = e.target.result;
                    image.onerror = () => {
                        console.log ("image load error!");
                        dispatch(scaleImageFail({filename:file.name, status:false}));
                        readFiles (index+1);
                    }
                    image.onload = () => {
                        console.log ("image ", file.name, "info:", image.width, "x", image.height);
                        if (image.width <= 0 || image.height <= 0) {
                            dispatch(scaleImageFail({filename:file.name, status:false}));
                            readFiles (index+1);
                        }
                        var maxWidth=1280, maxHeight=960;
                        if (image.width <= maxWidth && image.height <= maxHeight) {
                            dispatch(scaleImageOk({filename:file.name, src:image.src}));
                            readFiles (index+1);
                        }

                        var scaleWidth = image.width;
                        var scaleHeight = image.height;
                        if(scaleWidth > maxWidth) {
                            scaleHeight = parseInt(scaleHeight*maxWidth/scaleWidth);
                            scaleWidth = maxWidth;
                        }
                        if (scaleHeight > maxHeight) {
                            scaleWidth = parseInt(scaleWidth*maxHeight/scaleHeight);
                            scaleHeight = maxHeight;
                        }
                        canvas.width = scaleWidth;
                        canvas.height = scaleHeight;
                        ctxt.clearRect(0, 0, scaleWidth, scaleHeight);
                        ctxt.drawImage(image, 0, 0, scaleWidth, scaleHeight);
                        dispatch( scaleImageOk({filename:file.name, src:canvas.toDataURL()}) );
                        readFiles (index+1);
                    };
                }
                reader.readAsDataURL(file);
            }
        };
        readFiles(0);
    }
}



export const addImage = (evt) => {
    // 用reduce,promise方式，图片一张张加载，节省资源
    //var filelist = evt.target.files;
    var filelist = [];
    for (var i = 0; i < evt.target.files.length; i++) {
        filelist.push(evt.target.files[i]);
    }

    return (dispatch) => {
        // dispatch image names.
        var imginfos = filelist.map ( (file) => {
            console.log ("file:",file);
            return { filename: file.name, mimetype: file.type, file: file };
        } );
        dispatch ( appendImageList(imginfos) );

        // dispatch image data.
        var reader = new FileReader();
        var image = new Image();
        var canvas = document.createElement("canvas");
        var ctxt = canvas.getContext("2d");
        //console.log ("");

        const processArray = (array, fn) => {
            var results = [];
            console.log ("array:::", array);
            return array.reduce(function(p, item) {
                console.log ("p", p, "item", item);
                return p.then(function(data1) {
                    console.log ("data1", data1);
                    return fn(item).then(function(data) {
                        console.log ("fuck", item, "data", data);
                        results.push(data);
                        return results;
                    });
                });
            }, Promise.resolve());
        }

        const processImage = (file) => {
            return new Promise(function(resolve, reject) {
                // delayResolve it just here to make this actually be async for testing
                reader.onerror = function (e) {
                    console.log ("image load error!");
                    dispatch(scaleImageFail({filename:file.name, status:false}));
                    resolve (false);
                }
                reader.onload = function (e) {
                    //uploader.imgdatas[file.name] = e.target.result;
                    image.src = e.target.result;
                    image.onerror = () => {
                        console.log ("image load error!");
                        dispatch(scaleImageFail({filename:file.name, status:false}));
                        resolve (false);
                    }
                    image.onload = () => {
                        console.log ("image ", file.name, "info:", image.width, "x", image.height);
                        if (image.width <= 0 || image.height <= 0) {
                            dispatch(scaleImageFail({filename:file.name, status:false}));
                            resolve (false);
                        }
                        var maxWidth=640; //1280;
                        var maxHeight=480; //960;
                        if (image.width <= maxWidth && image.height <= maxHeight) {
                            dispatch(scaleImageOk({filename:file.name, src:image.src}));
                            resolve (true);
                        }

                        var scaleWidth = image.width;
                        var scaleHeight = image.height;
                        if(scaleWidth > maxWidth) {
                            scaleHeight = parseInt(scaleHeight*maxWidth/scaleWidth);
                            scaleWidth = maxWidth;
                        }
                        if (scaleHeight > maxHeight) {
                            scaleWidth = parseInt(scaleWidth*maxHeight/scaleHeight);
                            scaleHeight = maxHeight;
                        }
                        canvas.width = scaleWidth;
                        canvas.height = scaleHeight;
                        ctxt.clearRect(0, 0, scaleWidth, scaleHeight);
                        ctxt.drawImage(image, 0, 0, scaleWidth, scaleHeight);
                        dispatch( scaleImageOk({filename:file.name, src:canvas.toDataURL()}) );
                        resolve (true);
                    };
                }
                reader.readAsDataURL(file);
            });
        }

        return processArray(filelist, processImage).then(function(result) {
            console.log ("resolve", result);
        }, function(reason) {
            console.log ("reject:", reason);
        });
    }
}

export const addImage2 = (evt) => {
    // 所有图片一起加载，非常耗资源，容易卡死
    //var filelist = evt.target.files;
    var filelist = [];
    for (var i = 0; i < evt.target.files.length; i++) {
        filelist.push(evt.target.files[i]);
    }
    return (dispatch) => {
        // dispatch image names.
        var imginfos = filelist.map ( (file) => {
            console.log ("file:",file);
            return { filename: file.name, mimetype: file.type, file: file };
        } );
        dispatch ( appendImageList(imginfos) );
        // dispatch image data.
        setTimeout( () => {
        filelist.map ( (file) => {
            var reader = new FileReader();
            reader.onerror = function (e) {
                console.log ("image load error!");
                return dispatch(scaleImageFail({filename:file.name, status:false}));
                
            }
            reader.onload = function (e) {
                //uploader.imgdatas[file.name] = e.target.result;
                var image = new Image();
                image.src = e.target.result;
                image.onerror = () => {
                    console.log ("image load error!");
                    return dispatch(scaleImageFail({filename:file.name, status:false}));
                }
                image.onload = () => {
                    console.log ("image ", file.name, "info:", image.width, "x", image.height);
                    if (image.width <= 0 || image.height <= 0) {
                        return dispatch(scaleImageFail({filename:file.name, status:false}));
                    }
                    var maxWidth=1280, maxHeight=960;
                    if (image.width <= maxWidth && image.height <= maxHeight) {
                        return dispatch(scaleImageOk({filename:file.name, src:image.src}));
                    }

                    var scaleWidth = image.width;
                    var scaleHeight = image.height;
                    if(scaleWidth > maxWidth) {
                        scaleHeight = parseInt(scaleHeight*maxWidth/scaleWidth);
                        scaleWidth = maxWidth;
                    }
                    if (scaleHeight > maxHeight) {
                        scaleWidth = parseInt(scaleWidth*maxHeight/scaleHeight);
                        scaleHeight = maxHeight;
                    }
                    var canvas = document.createElement("canvas");
                    var ctxt = canvas.getContext("2d");
                    canvas.width = scaleWidth;
                    canvas.height = scaleHeight;
                    ctxt.clearRect(0, 0, scaleWidth, scaleHeight);
                    ctxt.drawImage(image, 0, 0, scaleWidth, scaleHeight);
                    return dispatch( scaleImageOk({filename:file.name, src:canvas.toDataURL()}) );
                };
            }
            reader.readAsDataURL(file);
        } );
        }, 100);
    }
}

export const removeImage = (image) => {
    return (dispatch) => {
        console.log ("delete", image);
        dispatch(deleteImage(image))
    }
}

const ACTION_HANDLERS = {
    ['APPEND_IMAGE_LIST']: (state, action) => { 
        console.log ("infos:",state.info);
        return ({ ...state, info: state.info.concat(action.payload) })},
    ['SCALE_IMAGE_OK']: (state, action) => { 
        return ({ ...state, data: { ...state.data, [action.payload.filename]:action.payload.src } });
    },
    ['SCALE_IMAGE_FAIL']: (state, action) => {
        return ({ ...state, data: { ...state.data, [action.payload.filename]:false } });
    },
    ['DELETE_IMAGE']: (state, action) => {
        var index = -1;
        for (var i = 0; i<state.info.length; i++) {
            if (state.info[i].filename == action.payload.filename) {
                index = i;
                break;
            }
        }
        console.log ("index", index);
        //var i = state.info.indexOf(action.payload);
        if (index > -1) {
            var arr = state.info.slice(0,index).concat(state.info.slice(index+1,state.info.length));
            return ({ ...state, info: arr})
        }
        return ({ ...state })
    }
}

const initialState = { info: [], data: {} }
export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

