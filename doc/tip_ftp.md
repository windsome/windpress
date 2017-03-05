# vsftp虚拟用户配置
[vsftp虚拟用户配置](http://www.cnblogs.com/allenjin/archive/2011/12/03/2274542.html)

本文主要介绍一下VSFTP虚拟用户模式配置方法：
安装VSFTP：sudo apt-get install vsftpd
安装DB软件包:sudo apt-get install db-util
配置虚拟用户（进入/etc/vsftpd下操作）
1. 建立虚拟用户口令库文件
# vim vusers.list （第一行写 用户名，第二行写 密码，保存退出）
user1
user1pwd
user2
user2pwd
2. 生成vsftpd的认证文件
# db_load -T -t hash -f vusers.list /etc/vsftpd/vsftpd_login.db （生成认证文件）
# chmod 600 /etc/vsftpd/vsftpd_login.db （赋权）
3. 建立虚拟用户所需的PAM配置文件
# vim /etc/pam.d/vsftpd （加入下面内容，其他全部注释。）
auth required pam_userdb.so db=/etc/vsftpd/vsftpd_login
account required pam_userdb.so db=/etc/vsftpd/vsftpd_login
4. 建立虚拟用户要访问的目录并设置权限
# useradd -d /home/ftp -s /sbin/nologin virtual
# chmod 777 /home/ftp/
在 vsftpd.conf 添加以下参数配置项：
guest_enable=YES
guest_username=virtual
5. 对不同虚拟用户设置不同权限
# mkdir /etc/vsftpd/vsftpd_user_conf
# vim /etc/vsftpd/vsftpd_user_conf/user1 （建立用户单独配置文件，文件名就是用户名）
local_root=/home/ftp/user1 #这里的虚拟用户目录可以根据实际情况修改
write_enable=YES
virtual_use_local_privs=YES #虚拟用户具有写权限（上传、下载、删除、重命名）
在 vsftpd.conf 添加以下参数配置项：
user_config_dir=/etc/vsftpd/vsftpd_user_conf
6. 禁锢FTP用户在宿主目录
将需要禁锢的用户名写入“vsftpd.chroot_list”文件
# vim /etc/vsftpd.chroot_list
user1
user2
在 vsftpd.conf 添加以下参数配置项：
chroot_list_enable=YES
chroot_list_file=/etc/vsftpd.chroot_list
