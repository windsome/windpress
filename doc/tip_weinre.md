# 移动端页面调试

+ 首先安装weinre
+ 调试步骤：
  1. 终端运行：
    weinre --boundHost -all- --httpPort 9090
      or
    weinre --boundHost 192.168.1.7 --httpPort 9090

  2. 用基于webkit的浏览器如chrome打开如下链接
    http://192.168.1.7:9090/

  3. 点击如下连接进行调试
    http://192.168.1.7:9090/client/#anonymous

  4. 移动端页面需加入
    <script src="http://192.168.1.7:9090/target/target-script-min.js#anonymous"></script>

