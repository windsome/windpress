# 使用forever作为linux开机服务
可以参考：[使用forever将nodejs设置成开机服务](https://www.exratione.com/2011/07/running-a-nodejs-server-as-a-service-using-forever/)  
在bin/下有一个文件node-forever，根据自己的目录不同适当修改后拷贝到/etc/init.d/下，并链接到rc*.d中控制在开机时启动，关机时关闭，如下所示：  
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
注意要安装forever, ``` sudo npm install -g forever ```，用sudo可能不成功，可以su -,进入root再操作  

附 /etc/init.d/node-forever内容：  
```
NAME=IOT_WECHAT
SOURCE_DIR=/home/ubuntu/node/iot-starter
SOURCE_FILE=bin/forever_deamon.js

user=ubuntu
pidfile=/var/run/$NAME.pid
logfile=/var/log/$NAME.log
forever_dir=/var/run/forever

node=node
forever=forever
sed=sed

 #PATH=$PATH:/home/node/local/node/bin
 #NODE_PATH=$NODE_PATH:/home/node/local/node/lib/node_modules

WORKING_DIR=$SOURCE_DIR
export NODE_ENV='production'
export DEBUG='app:*'
export PORT=3000
export PORT_HTTPS=443

#mkdir $forever_dir

start() {
  echo "Starting $NAME node instance: "

  if [ "$foreverid" == "" ]; then
    # Create the log and pid files, making sure that
    # the target use has access to them
    touch $logfile
    chown $user $logfile

    touch $pidfile
    chown $user $pidfile

    echo "$forever start -p $forever_dir --pidFile $pidfile -l $logfile -a -d --sourceDir=$SOURCE_DIR $SOURCE_FILE"
    # Launch the application
    #daemon --user=root \
      $forever start -p $forever_dir --pidFile $pidfile -l $logfile -a -d --sourceDir=$SOURCE_DIR --workingDir=$WORKING_DIR $SOURCE_FILE
    RETVAL=$?
  else
    echo "Instance already running"
    RETVAL=0
  fi
}

stop() {
  echo -n "Shutting down $NAME node instance : "
  #$forever stop $SOURCE_FILE
  if [ "$foreverid" != "" ]; then
    $forever stop $foreverid
  #  #$node $SOURCE_DIR/prepareForStop.js
  #  $forever stop -p $forever_dir $id
  else
    echo "Instance is not running";
  fi
  RETVAL=$?
}

if [ -f $pidfile ]; then
  read pid < $pidfile
  foreverid=$pid;
else
  pid=""
  foreverid=""
fi
echo "foreverid=$foreverid"

case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  status)
    status -p ${pidfile}
    ;;
  *)
    echo "Usage:  {start|stop|status}"
    exit 1
    ;;
esac
exit $RETVAL
```

