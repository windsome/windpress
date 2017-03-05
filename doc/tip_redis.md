# 使用node-redis时，默认是使用callback的异步模式，怎么改成async/await模式？
参考 [极品好文：Tips for using async functions](http://www.2ality.com/2016/10/async-function-tips.html)
```
1, callback模式：
    redis._redisClient.hget ([hkey], [key], function(err,res){
        if (err) {
            console.log('Error:'+ err);
            return;
        }
        console.dir(res);
    });

    redis._redisClient.del ([hkey],key);
    这种模式查询或处理结果从异步的callback返回，对于koa2的服务器来说编程很困难。
2, async/await模式，写一个通用的用来处理redis方法的函数，并调用此函数返回一个Promise，特别适合koa2
const redis_fn = function (fn, arg) {
    if (arguments.length > 2) arg = Array.prototype.slice.call(arguments, 1);
    return new Promise(function (resolve, reject) {
        fn.apply (redis._redisClient, arg.concat( function (err, res) {
            console.log ("redis_fn result", err, res);
            if (err) return reject(err);
            if (arguments.length > 2) res = slice.call(arguments, 1);
            resolve(res);
        }));
    });
}
用法：
    var scene_value = await redis_fn(redis._redisClient.hget, 'qrscene',qrscene);
    console.log ("scene_value", scene_value);
    await redis_fn(redis._redisClient.del, 'qrscene',qrscene);
```
参考：
[thunkify和co的结合](http://www.cnblogs.com/wofeiwofei/p/5462387.html)  
[JavaScript里function函数实现可变参数(多态）](http://www.oschina.net/question/54100_15938)  

#  Error: session store is unavailable
```
  Error: session store is unavailable
      at Object.getSession (/data/nodejs/windpress/node_modules/.1.11.4@koa-generic-session/lib/session.js:181:13)
      at next (native)
      at onFulfilled (/data/nodejs/windpress/node_modules/.4.6.0@co/index.js:65:19)
      at /data/nodejs/windpress/node_modules/.4.6.0@co/index.js:54:5
      at new Promise (/data/nodejs/windpress/node_modules/.2.4.1@core-js/modules/es6.promise.js:191:7)
      at Object.co (/data/nodejs/windpress/node_modules/.4.6.0@co/index.js:50:10)
      at Object.toPromise (/data/nodejs/windpress/node_modules/.4.6.0@co/index.js:118:63)
      at next (/data/nodejs/windpress/node_modules/.4.6.0@co/index.js:99:29)
      at onFulfilled (/data/nodejs/windpress/node_modules/.4.6.0@co/index.js:69:7)
      at /data/nodejs/windpress/node_modules/.4.6.0@co/index.js:54:5
      at new Promise (/data/nodejs/windpress/node_modules/.2.4.1@core-js/modules/es6.promise.js:191:7)
      at Object.co (/data/nodejs/windpress/node_modules/.4.6.0@co/index.js:50:10)
      at converted (/data/nodejs/windpress/node_modules/.1.2.0@koa-convert/index.js:17:15)
      at dispatch (/data/nodejs/windpress/node_modules/.3.2.1@koa-compose/index.js:44:32)
      at /data/nodejs/windpress/node_modules/.3.2.1@koa-compose/index.js:36:12
      at Server.<anonymous> (/data/nodejs/windpress/node_modules/.2.0.0@koa/lib/application.js:135:7)
```
需要安装redis，```apt-get install redis-server```

