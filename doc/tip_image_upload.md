## 图片上传
使用formdata方式上传或使用``` Content-Type: application/octet-stream ```方式上传
参考
[理解DOMString、Document、FormData、Blob、File、ArrayBuffer数据类型](http://www.zhangxinxu.com/wordpress/2013/10/understand-domstring-document-formdata-blob-file-arraybuffer/)
[Ajax file upload with pure JavaScript](http://igstan.ro/posts/2009-01-11-ajax-file-upload-with-pure-javascript.html)
[FileReader.readAsDataURL()](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL)
[使用 JavaScript File API 实现文件上传](http://www.ibm.com/developerworks/cn/web/1101_hanbf_fileupload/index.html)
[Canvas API](http://javascript.ruanyifeng.com/htmlapi/canvas.html)
[js图片压缩上传](http://www.cnblogs.com/tonyjude/p/4261930.html)
[Using files from web applications](https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications)
[File Uploading over AJAX using HTML5](http://www.nickdesteffen.com/blog/file-uploading-over-ajax-using-html5)
### 使用FormData对象
测试例子见 src/static/demos/fileupload_FormData.html
后台见 apis/upload/form
[FormData](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)
[HTMLFormElement](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLFormElement)
### 使用DataUrl来上传图片
测试例子见 src/static/demos/fileupload_base64.html
后台见 apis/upload/base64/a.png
[FileReader.readAsDataURL upload to express.js](http://stackoverflow.com/questions/13069769/filereader-readasdataurl-upload-to-express-js)
### 许多图片预览时，加载慢导致浏览器卡死问题
[许多图片预览时，加载慢导致浏览器卡死问题](tip_preview.md)

### 微信浏览器input[type='file']控件不支持multiple属性，不支持多文件上传
得使用微信jssdk的wx.chooseImage方法实现多图片上传
### XMLHttpRequest详细用法
[mozilla XMLHttpRequest用法](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest)

