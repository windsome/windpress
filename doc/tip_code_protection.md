# 使用webpack可以对代码进行压缩混淆，也支持node端代码的压缩

1. 对于本项目，复制webpack.config.js为webpack.servercfg.js，修改其内容为node端内容
2. 修改compile.js，加入对node端代码编译的支持。注意，node端部分文件是动态import进来的，需要拷贝到目的目录，还有__dirname相关的内容，改变量改为了sdist目录，需要改相关代码
3. 运行npm run deploy:prod，会同时创建dist和sdist目录，分别是客户端代码和服务器端代码
4. 修改package.json中npm run startprod命令，将server改成sdist，则直接从sdist启动服务器端


# 参考
1. [__dirname returns '/' when js file is built with webpack](https://github.com/webpack/webpack/issues/1599)
2. [Webpack not excluding node_modules](http://stackoverflow.com/questions/33001237/webpack-not-excluding-node-modules)
3. [Webpack: How to don't bundle node_modules, but use them normally in node.js?](https://github.com/webpack/webpack/issues/603)
