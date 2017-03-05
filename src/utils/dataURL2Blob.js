var xdebug = window.myDebug('Utils:dataURL2Blob');

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

export default dataURL2Blob;
