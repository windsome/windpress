# What's This?
This is a (React + Redux + Router + isomorphic + SASS/SCSS + webpack + nodejs + express) starter kit, base from [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit). It saves your life in construct a base runnable suit. I need your help to improve it.

Our backend conception comes from WordPress, database tables almost same as WordPress, MetaData, Post, User.
clone project: `git clone https://github.com/windsome/airbnb-starter.git`

# structure
1. `/server` contains server side code.
2. `/src` contains client side code.
3. `/bin /config /build`, contains build code.
4. `/doc` contains more doc. [read more tips](doc/tips.md)


# usage1: development use
same as original [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit).
```
cd airbnb-starter
npm install  #(in china, when install scss-node, may face a timeout problem, you can use taobao mirror. see [cnpm](doc/tip_cnpm.md) )
npm start
```
then, you can open browser, and visit http://localhost:3000

# usage2: build frontend code to /dist, run server code in /server
same as original [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit).
```
npm install
npm run deploy:prod
npm run startprod
```

# usage3: build frontend code to /dist, build server code to /sdist. really deploy to remote cloud.
difference with original [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit).
```
 npm install
 npm run deploy:prod
 # compile servercode to /sdist.
 npm run deploy:prodserver
 # run from sdist
 npm run startprod2
```

# Tips, see all tips.
[read all tips](doc/tips.md)

# 问题一：使用npm安装一些包失败了的看过来（npm国内镜像介绍）
见 [淘宝npm镜像registry及cnpm](doc/tip_cnpm.md)

# 问题二：如何使用 node-inspector进行nodejs的调试

# 问题三：react组件属性有时总不出现，看看是不是属性名大小写出了问题？

# 一元夺宝项目
前端代码位于 src/routes/Coin， 后端使用post存储商品信息，order存储订单信息，每个商品对应的抽奖信息（抽奖随机数，抽中序号，应该放在postmeta表中），见 [一元夺宝](doc/api_coin.md)

# 协鑫储能监控项目
前端代码位于 src/routes/Energy， 后端API使用energyApi，见 [协鑫储能](doc/api_xiexin.md)



