## 服务器搭建过程
0. 从阿里云买来ECS服务器，获取ip地址，并设置root密码，重启服务器。
  + 安装需要的软件： git , mysql , redis-server , nginx
  + 建议使用nginx作为80入口，后面映射到nodejs，方便后面架设多个nodejs
1. 设置ssh不断开
  + vim /etc/ssh/sshd_config ，修改两处的值为： 
   - ClientAliveInterval 60
   - ClientAliveCountMax 10
  + 使修改的ssh配置文件生效： `service sshd reload`
    
2. 设置开发机免密登录服务器
  + 在开发机上给服务器设置一个别名，编辑/etc/hosts，增加一行 `47.92.65.233   dili`，设置服务器别名为dili
  + 将开发机的id_rsa.pub文件scp到服务器 `scp id_rsa.pub root@47.92.65.233:/root/`
  + 将id_rsa.pub内容增加到/root/.ssh/authorized_keys末尾。注意，如果不存在此文件或.ssh目录，则创建，.ssh的权限为700，authorized_keys文件权限为600 ，千万不能弄错，否则仍然不能免密登录。

3. 使用nvm管理node版本及npm环境
  + 安装nvm，（其实是clone一个github上的开源项目nvm），命令如下
  ```
  git clone https://github.com/creationix/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags` 
  ```
  + 设置环境变量， `vim .bashrc`，添加 `source ~/.nvm/nvm.sh`到末尾，保存退出vim。可以重新打开终端生效，或者运行`source .bashrc`在本终端马上生效。
  + 运行`nvm --version`查看当前版本，成功则表示nvm环境配置成功。
  + 不同的用户都得操作一遍，我没试过不同用户用同一套。。。

4. 使用nvm安装node
  + nvm ls-remote 查看可以使用的node版本
  + nvm list 查看本地已经安装的node版本及当前使用的版本
  + nvm install v5.11.1 安装某个版本的node
  + nvm use v5.11.1 有多个版本时，可用这个命令选择某个版本的npm
  + koa2需要node7.6.0版本以上，所以需要 nvm install v7.7.0
  + nvm alias default v7.7.4 设置默认版本为v7.7.4，设置之前可以先用 `nvm unalias default` 取消之前的默认版本
  + 将nvm安装的node作为系统默认的node，
   - <https://www.digitalocean.com/community/tutorials/how-to-install-node-js-with-nvm-node-version-manager-on-a-vps>
   - 上文建议的方法：`n=$(which node);n=${n%/bin/node}; chmod -R 755 $n/bin/*; sudo cp -r $n/{bin,lib,share} /usr/local`
   - 我建议的方法，找到相应的版本，并链接到/user/local相应目录，主要是bin/下面命令和lib下面node_modules。（注：我是以root用户操作）
   ```
   n=$(which node)
   n=${n%/bin/node}
   ln -s $n/bin/* /usr/local/bin/
   ln -s $n/lib/* /usr/local/lib/
   ```
5. 使用淘宝镜像作为npm镜像
  + 方法1：使用npm安装淘宝的cnpm命令`npm install -g cnpm --registry=https://registry.npm.taobao.org`，完成以后，可以用cnpm代替npm执行。
  + 方法2：通过config命令更改registry
    ```
    npm config set registry https://registry.npm.taobao.org 
    npm info underscore  （如果上面配置正确这个命令会有字符串response）
    ```
  + 方法3：命令行指定registry， `npm --registry https://registry.npm.taobao.org info underscore`
  + 方法4：编辑 ~/.npmrc 加入下面内容，指定registry，`registry = https://registry.npm.taobao.org`
  + cnpm对于某些需要翻墙的库特别有用，比如phantomjs-2.1.1-linux-x86_64.tar.bz2
  + 搜索镜像: https://npm.taobao.org，建立或使用镜像,参考: https://github.com/cnpm/cnpmjs.org
  + 切换npm，`npm config set registry https://registry.npmjs.org/`

7. 将windpress打包上传到服务器
6. forever部分参考 <tip_forerver.md>
  + 安装全局forever，要用root用户安装，因为系统服务是root用户在跑。
  ```
  su -
  npm install -g forever
  ```
  + 将windpress/build/node-forever文件拷贝到/etc/init.d/下，并相应修改
  + 添加rc*.d/目录的启动及关闭链接
  ```
    +edit node-forever
    sudo cp node-forever /etc/init.d/
    cd /etc/rc2.d
    ln -s ../init.d/node-forever S23node
    cd /etc/rc3.d
    ln -s ../init.d/node-forever S23node
    cd /etc/rc4.d
    ln -s ../init.d/node-forever S23node
    cd /etc/rc5.d
    ln -s ../init.d/node-forever S23node
    cd /etc/rc0.d
    ln -s ../init.d/node-forever K23node
    cd /etc/rc1.d
    ln -s ../init.d/node-forever K23node
    cd /etc/rc6.d
    ln -s ../init.d/node-forever K23node
  ```
  + 其他参考 <tip_forerver.md>
7. 使用pm2代替forever管理node服务运行，`npm install pm2 -g`
  + 开发过程中一般使用过程
   - `pm2 start sdist --name="coin"` 启动服务
   - `pm2 show coin` 查看运行状态
   - `pm2 monit` 查看实时运行状态
   - `pm2 stop coin`关闭coin
   - `pm2 stop all`关闭所有进程
  + 服务器部署
   - `pm2 save` 保存之前`pm2 start`启动的服务到`/home/windsome/.pm2/dump.pm2`，之后将作为系统服务
   - `pm2 startup` pm2会分析系统运行环境及node版本，生成一个需root身份运行的命令，此命令将生成服务脚本类似上面的node-forever.
   - `sudo env PATH=$PATH:/home/windsome/.nvm/versions/node/v5.11.1/bin /home/windsome/.nvm/versions/node/v5.11.1/lib/node_modules/.pm2_npminstall/node_modules/.2.4.2@pm2/bin/pm2 startup upstart -u windsome --hp /home/windsome`，此命令将生成脚本`pm2-windsome`及在rc*.d中的链接。
   - `pm2 unstartup systemd`命令删除之前生成的脚本（此命令为ubuntu16.04版本，16.04之前的为`pm2 unstartup upstart`，原因为服务系统不一样）。
   - 详见 <tip_pm2.md> 或pm2官网
8. 配置nginx
  - 在`/etc/nginx/sites-available/`下建立一个配置文件`nodejs-www.zdili.com`，内容如下：
```
upstream nodejs__upstream_www_zdili_com {
    server 127.0.0.1:3000;
    keepalive 64;
}
server {
    listen 80;
	  server_name www.zdili.com;
    location / {
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   Host             $http_host;
        proxy_set_header   X-NginX-Proxy    true;
        proxy_set_header   Connection       "";
        proxy_http_version 1.1;
        proxy_pass         http://nodejs__upstream_www_zdili_com;
    }
}
```
  - 链接配置文件到sites-enabled下，使其生效，`ln -s /etc/nginx/sites-available/nodejs-www.zdili.com /etc/nginx/sites-enabled/`
8. Mysql数据库相关
```
登录数据库
mysql -u root -p

创建Mysql超级用户：
GRANT ALL PRIVILEGES ON *.* TO admin@localhost IDENTIFIED BY '<this_is_password>' WITH GRANT OPTION;
FLUSH PRIVILEGES;

创建数据库：
CREATE DATABASE `wpcoin` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
```

9. 微信公众号配置
  + 设置
  
## 分析问题
1. 监视磁盘变动，安装inotify-tools工具，`apt-get install inotify-tools`，运行`inotifywait -r -m $HOME`监视$HOME目录，注意这个目录不能设置为/，否则文件太多，无法监视

