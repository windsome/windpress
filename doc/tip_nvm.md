# 使用nvm管理npm版本
下载nvm-git代码到~/.nvm目录  
```
git clone https://github.com/creationix/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
```
编辑环境变量配置文件~/.bashrc,添加``` source ~/.nvm/nvm.sh ```到末尾，保存退出  
```
cd  
vim .bashrc  
+ source ~/.nvm/nvm.sh
```
+ 可以使用nvm list 查看本地当前安装的node版本  
+ 使用nvm ls-remote 查看可以安装的版本  
+ 使用nvm install 5.11.1安装指定版本号版本  

注意，因为nvm是装在用户家目录，所以不同的用户都要自己装，是不是有其他方案待实验。

