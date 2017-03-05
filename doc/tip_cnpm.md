# 使用淘宝镜像作为npm镜像
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
以后可以使用 cnpm替代npm，这在阿里云环境中特别好用。  
另外，某些情况下国内屏蔽了某些网站，导致npm会失败，特别是某个npm会从amazon的镜像下载phantomjs-2.1.1-linux-x86_64.tar.bz2文件，经常会超时导致失败，此时用cnpm将非常必要。cnpm可以与npm通用共用，都是下载npm包到node_modules目录。

# 还有其他方法，主要原理就是设置registry环境变量为淘宝的镜像，使用npm时，会优先使用环境变量中的registry，有如下三种操作方式，建议使用第三种，将配置写死，下次用的时候配置还在
## 1.通过config命令
```
npm config set registry https://registry.npm.taobao.org 
npm info underscore  （如果上面配置正确这个命令会有字符串response）
```
## 2.命令行指定
```
npm --registry https://registry.npm.taobao.org info underscore 
```
## 3.编辑 ~/.npmrc 加入下面内容
```
registry = https://registry.npm.taobao.org
```
搜索镜像: https://npm.taobao.org
建立或使用镜像,参考: https://github.com/cnpm/cnpmjs.org


# 某些云服务器不使用ubuntu的镜像，用apt-get install安装软件失败
今天安装nginx时候碰到一个问题
通过执行 ``` add-apt-repository ppa:ondrej/php5 ```命令来添加nginx 的ppa的时候发现 命令找不到
root@ubuntu:~# sudo add-apt-repository
ppa:nginx/stable
sudo: add-apt-repository: command not found
经过 搜索才知道 add-apt-repository 是由 Python-software-properties 这个工具包提供的
所以要先安装python-software-properties 才能使用 add-apt-repository
apt-get install python-software-properties
但有时腾讯云已经去掉原来的源了，设置成了腾讯云镜像，会找不到很多软件，这时连python-software-properties也装不了。
此时可以直接编辑/etc/apt/source.list这个文件
```
deb http://cn.archive.ubuntu.com/ubuntu/ trusty main restricted
deb-src http://cn.archive.ubuntu.com/ubuntu/ trusty main restricted
```
通过这中方式的话要要手工添加该源的keyserver
之后就是apt-get update ，如果没有添加keyserver会报错
```The following signatures couldn't be verified because the public key is not available: NO_PUBKEY 16126D3A3E5C1192 ```
这个非官方源是不可信任的，解决办法是导入该源的公钥。 
gpg --keyserver subkeys.pgp.net --recv 16126D3A3E5C1192 
gpg --export --armor 16126D3A3E5C1192 | sudo apt-key add - 
sudo apt-get update 
这里将subkeys.pgp.net换成keyserver.ubuntu.com
接下来就可以直接安装nginx了，apt-get install nginx 
如果有add-apt-repository命令，就不用经历上面复杂过程，可以运行命令把添加源和添加apt-key的工作全部做了。

