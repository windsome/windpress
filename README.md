## Project Introduction
The front-end code is located in src/routes/Coin, the backend uses the post to store the product information, order stores the order information, the corresponding lottery information for each item (lottery random number, the serial number should be placed in the postmeta table), see [ Treasure] (doc/api_coin.md)

## Setting

Change db, wechat, wechatPay in config/cfg.coin.lancertech.js

## Run

```
npm install
redis-server
npm start
```

then, you can open browser, and visit http://localhost:3000, http://yourlocalip:3000 is better.

## Problems encountered
1. Use npm to install some packages failed to see over (npm domestic mirror introduction)
     See [Taobao npm mirror registry and cnpm] (doc / tip_cnpm.md)
2. How to use node-inspector for nodejs debugging
3. React component attributes sometimes do not appear to see if the name of the property is not the size of the problem?


# 中文介绍

## 项目介绍
前端代码位于 src/routes/Coin， 后端使用post存储商品信息，order存储订单信息，每个商品对应的抽奖信息（抽奖随机数，抽中序号，应该放在postmeta表中），见 [一元夺宝](doc/api_coin.md)

## 设置
在config/cfg.coin.lancertech.js设置数据库，微信，微信支付

## 运行

```
npm install
redis-server
npm start
```

然后，你打开浏览器，浏览http://localhost:3000，最好用http://yourlocalip:3000。

## 遇到的问题
1. 使用npm安装一些包失败了的看过来（npm国内镜像介绍）
    见 [淘宝npm镜像registry及cnpm](doc/tip_cnpm.md)
2. 如何使用 node-inspector进行nodejs的调试
3. react组件属性有时总不出现，看看是不是属性名大小写出了问题？



