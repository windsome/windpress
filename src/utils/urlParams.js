var xdebug = window.myDebug('Utils:urlParams');

export const urlParams = (queryString) => {
    /*
      see: https://developer.mozilla.org/en-US/docs/Web/API/Location
      Location.search
      eg: ?a=1&b=2&c=3
    */
    var qsObj = {};
    var qs = queryString.substring(1);
    var qsArr = qs && qs.split('&');
    for (var i = 0; i < qsArr.length; i++) {
        var arr2 = qsArr[i].split('=');
        var name = arr2[0];
        qsObj[name] = arr2[1];
    }
    return qsObj;
}

