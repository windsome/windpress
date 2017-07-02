### 使用pm2代替forever管理node服务运行，`npm install pm2 -g`
  + 开发过程中一般使用过程
   - `pm2 start sdist --name="coin"` 启动服务
   - `pm2 show coin` 查看运行状态
   - `pm2 monit` 查看实时运行状态
   - `pm2 stop coin`关闭coin
   - `pm2 stop all`关闭所有进程
  + 服务器部署
   - `pm2 save` 保存之前`pm2 start`启动的服务到`/home/windsome/.pm2/dump.pm2`，之后将作为系统服务
   - `pm2 startup` pm2会分析系统运行环境及node版本，生成一个需root身份运行的命令，此命令将生成服务脚本类似上面的node-forever.
   - 注意添加环境变量 DEBUG="app:*"到dump.pm2中，这样会将debug的日志打印出来。
```
windsome@windsome-ThinkPad-T400:/home/dev/frontend/windpress$ pm2 startup
[PM2] Init System found: upstart
[PM2] You have to run this command as root. Execute the following command:
sudo env PATH=$PATH:/home/windsome/.nvm/versions/node/v5.11.1/bin /home/windsome/.nvm/versions/node/v5.11.1/lib/node_modules/.pm2_npminstall/node_modules/.2.4.2@pm2/bin/pm2 startup upstart -u windsome --hp /home/windsome
```
   - `sudo env PATH=$PATH:/home/windsome/.nvm/versions/node/v5.11.1/bin /home/windsome/.nvm/versions/node/v5.11.1/lib/node_modules/.pm2_npminstall/node_modules/.2.4.2@pm2/bin/pm2 startup upstart -u windsome --hp /home/windsome`，此命令将生成脚本`pm2-windsome`及在rc*.d中的链接。
   ```
windsome@windsome-ThinkPad-T400:/home/dev/frontend/windpress$ sudo env PATH=$PATH:/home/windsome/.nvm/versions/node/v5.11.1/bin /home/windsome/.nvm/versions/node/v5.11.1/lib/node_modules/.pm2_npminstall/node_modules/.2.4.2@pm2/bin/pm2 startup upstart -u windsome --hp /home/windsome
[PM2] Init System found: upstart
Platform upstart
Template
#!/bin/bash
### BEGIN INIT INFO
# Provides:        pm2
# Required-Start:  $local_fs $remote_fs $network
# Required-Stop:   $local_fs $remote_fs $network
# Default-Start:   2 3 4 5
# Default-Stop:    0 1 6
# Short-Description: PM2 Init script
# Description: PM2 process manager
### END INIT INFO

NAME=pm2
PM2=/home/windsome/.nvm/versions/node/v5.11.1/lib/node_modules/.pm2_npminstall/node_modules/.2.4.2@pm2/bin/pm2
USER=windsome
DEFAULT=/etc/default/$NAME

export PATH=/home/windsome/.nvm/versions/node/v5.11.1/bin:$PATH
export PM2_HOME="/home/windsome/.pm2"

# The following variables can be overwritten in $DEFAULT

# maximum number of open files
MAX_OPEN_FILES=

# overwrite settings from default file
if [ -f "$DEFAULT" ]; then
	  . "$DEFAULT"
fi

# set maximum open files if set
if [ -n "$MAX_OPEN_FILES" ]; then
    ulimit -n $MAX_OPEN_FILES
fi

get_user_shell() {
    local shell=$(getent passwd ${1:-`whoami`} | cut -d: -f7 | sed -e 's/[[:space:]]*$//')

    if [[ $shell == *"/sbin/nologin" ]] || [[ $shell == "/bin/false" ]] || [[ -z "$shell" ]];
    then
      shell="/bin/bash"
    fi

    echo "$shell"
}

super() {
    local shell=$(get_user_shell $USER)
    su - $USER -s $shell -c "PATH=$PATH; PM2_HOME=$PM2_HOME $*"
}

start() {
    echo "Starting $NAME"
    super $PM2 resurrect
}

stop() {
    super $PM2 kill
}

restart() {
    echo "Restarting $NAME"
    stop
    start
}

reload() {
    echo "Reloading $NAME"
    super $PM2 reload all
}

status() {
    echo "Status for $NAME:"
    super $PM2 list
    RETVAL=$?
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    restart)
        restart
        ;;
    reload)
        reload
        ;;
    force-reload)
        reload
        ;;
    *)
        echo "Usage: {start|stop|status|restart|reload|force-reload}"
        exit 1
        ;;
esac
exit $RETVAL

Target path
/etc/init.d/pm2-windsome
Command list
[ 'chmod +x /etc/init.d/pm2-windsome',
  'mkdir -p /var/lock/subsys',
  'touch /var/lock/subsys/pm2-windsome',
  'update-rc.d pm2-windsome defaults' ]
[PM2] Writing init configuration in /etc/init.d/pm2-windsome
[PM2] Making script booting at startup...
>>> Executing chmod +x /etc/init.d/pm2-windsome
[DONE] 
>>> Executing mkdir -p /var/lock/subsys
[DONE] 
>>> Executing touch /var/lock/subsys/pm2-windsome
[DONE] 
>>> Executing update-rc.d pm2-windsome defaults
 Adding system startup for /etc/init.d/pm2-windsome ...
   /etc/rc0.d/K20pm2-windsome -> ../init.d/pm2-windsome
   /etc/rc1.d/K20pm2-windsome -> ../init.d/pm2-windsome
   /etc/rc6.d/K20pm2-windsome -> ../init.d/pm2-windsome
   /etc/rc2.d/S20pm2-windsome -> ../init.d/pm2-windsome
   /etc/rc3.d/S20pm2-windsome -> ../init.d/pm2-windsome
   /etc/rc4.d/S20pm2-windsome -> ../init.d/pm2-windsome
   /etc/rc5.d/S20pm2-windsome -> ../init.d/pm2-windsome
[DONE] 
+---------------------------------------+
[PM2] Freeze a process list on reboot via:
$ pm2 save

[PM2] Remove init script via:
$ pm2 unstartup upstart
   ```

