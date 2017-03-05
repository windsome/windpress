# 许多图片预览时，加载慢导致浏览器卡死问题
主要原因在于许多图片一起加载导致内存消耗太大，可以使用promise或者回调函数中调用函数方式，一张张顺序加载图片。
[Reading the files sequentially using callbacks](http://stevehanov.ca/blog/index.php?id=127)
[Iteration with .reduce() that Resolves With Array](http://stackoverflow.com/questions/29880715/how-to-synchronize-a-sequence-of-promises) 
```
function processArray(array, fn) {
   var results = [];
   return array.reduce(function(p, item) {
       return p.then(function(data) {
           return fn(item).then(function(data) {
               results.push(data);
               return results;
           });
       });
   }, Promise.resolve());
}

var arr = [0,1,2,3];

function factory(idx) {
    
    return new Promise(function(resolve, reject) {
        // delayResolve it just here to make this actually be async for testing
        function delayResolve(data) {
            setTimeout(function() {
                resolve(data);
            }, 500);
        }
        
        switch (idx) {
            case 0:
                delayResolve("one");
                break;
            case 1:
                delayResolve("two");
                break;
            case 2:
                delayResolve("three");
                break;
            default:
                reject("invalid arg " + idx + " to factory");
                break;
        }
            
    });
}

processArray(arr, factory).then(function(result) {
    log(result);
}, function(reason) {
    log(reason);
});
```

