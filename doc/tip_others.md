## html编辑页面控件相关
[relax](http://demo.getrelax.io/admin)  
[tsurupin](http://staging.tsurupin.com/cms/posts/1/edit)  
## 下拉加载，上拉刷新
[react + iscroll5 实现完美 下拉刷新，上拉加载](http://www.cnblogs.com/qq120848369/p/5920420.html)  
## window.getComputedStyle()获取计算后的元素样式
语法如下：
var style = window.getComputedStyle("元素", "伪类");
例如：
var dom = document.getElementById("test"),
    style = window.getComputedStyle(dom , ":after");

## 动态加载css/js到页面
公司网站需要使用bootstrap.css，而公众号页面需要weui.css，我们不能将其写在index.html中，需要动态加载  
[dynamic load javascript/css 1](http://www.javascriptkit.com/javatutors/loadjavascriptcss.shtml)  
[dynamic load javascript/css 2](http://www.javascriptkit.com/javatutors/loadjavascriptcss2.shtml)    
[React中动态加载css文件](http://stackoverflow.com/questions/28386125/dynamically-load-a-stylesheet-with-react)  

## WYSIWYG-editor react所见即所得编辑器
[react-rte](https://react-rte.org/demo)(https://github.com/sstur/react-rte/)
[比较好的一个， react-draft-wysiwyg](https://jpuri.github.io/react-draft-wysiwyg/)
[react-quill](https://zenoamaro.github.io/react-quill/)
## react-redux-nodejs-koa 授权相关
[react中添加授权](https://auth0.com/blog/adding-authentication-to-your-react-flux-app/)  
[授权](https://scotch.io/tutorials/build-a-react-flux-app-with-user-authentication)  
## 微信填坑
1, pushState不支持问题，因Android6.2以下浏览器版本低的原因， [Android6.2以下浏览器版本低](http://www.jianshu.com/p/c4f216b0c080)  
2, invalid signature问题，可能是时间戳基准不一样 [第三方后台时间与微信服务器时间](http://m.blog.csdn.net/article/details?id=49451359)  
## emacs中以utf-8编码读取文件
查看当前buffer的编码：M-x　describe-coding-system  
按C-x <RET> r <TAB> 列出所有编码  
以指定编码重读当前buffer：C-x <RET> r utf-8，(revert-buffer-with-coding-system)  
改变当前buffer的编码：C-x <RET> f uft-8，(set-buffer-file-coding-system)  
## ES6中class类详解
[ES6 — classes and inheritance](https://medium.com/ecmascript-2015/es6-classes-and-inheritance-607804080906#.3hmmv9jrf)

## CSS中px, em, rem用处
rem为相对页面根元素的大小，一般为html元素
[CSS3的REM设置字体大小 ](https://www.w3cplus.com/css3/define-font-size-with-css3-rem)

## react-datepicker组件获取日期时间
[react-datepicker](https://github.com/Hacker0x01/react-datepicker/)
```npm install react-datepicker --save```

## webpack, js解析模块某个目录下除去某个子目录的其余子目录，How to exclude node_modules but one
<https://github.com/webpack/webpack/issues/2031>
```
{
  test: /\.js$/,
  exclude: /node_modules\/(?!(MY-MODULE|ANOTHER-ONE)\/).*/,
},
```

## chrome repsonsive design restricts. (Size Content to The Viewport)
<https://www.w3schools.com/css/css_rwd_viewport.asp>
Users are used to scroll websites vertically on both desktop and mobile devices - but not horizontally!  

So, if the user is forced to scroll horizontally, or zoom out, to see the whole web page it results in a poor user experience.  

Some additional rules to follow:  
1. Do NOT use large fixed width elements - For example, if an image is displayed at a width wider than the viewport it can cause the viewport to scroll horizontally. Remember to adjust this content to fit within the width of the viewport.

2. Do NOT let the content rely on a particular viewport width to render well - Since screen dimensions and width in CSS pixels vary widely between devices, content should not rely on a particular viewport width to render well.

3. Use CSS media queries to apply different styling for small and large screens - Setting large absolute CSS widths for page elements, will cause the element to be too wide for the viewport on a smaller device. Instead, consider using relative width values, such as width: 100%. Also, be careful of using large absolute positioning values. It may cause the element to fall outside the viewport on small devices.


