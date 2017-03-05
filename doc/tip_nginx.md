## 通过apache代理访问nodejs
新建一个配置文件，将域名指向nodejs服务器
```
<VirtualHost *:80>
    ServerName mp.lancertech.net
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ServerAdmin webmaster@localhost
    #DocumentRoot /home/dev/frontend/test/ranzhi

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

    <Directory />
        Options FollowSymLinks
        AllowOverride None
        Order allow,deny
        Allow from all
        #Require all granted
    </Directory>
</VirtualHost>
```
注意：如果在局域网测试，则需要在/etc/hosts内增加一个域名。如：
```
127.0.0.1   mp.lancertech.net
127.0.0.1   mp.lancertech.net
```
## 通过ngnix代理访问nodejs
在/etc/nginx/sites-available/下建立一个配置文件nodejs.conf，并ln链接到/etc/nginx/sites-enabled/下，重启nginx即可，内容：
```
upstream nodejs__upstream {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 8000;
	server_name mp.lancertech.net;

    location / {
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header   Host             $http_host;
        proxy_set_header   X-NginX-Proxy    true;
        proxy_set_header   Connection       "";
        proxy_http_version 1.1;
        proxy_pass         http://nodejs__upstream;        
    }
}
```
## nginx代理nodejs时，上传文件报错
```
<html>
<head><title>413 Request Entity Too Large</title></head>
<body bgcolor="white">
<center><h1>413 Request Entity Too Large</h1></center>
<hr><center>nginx/1.4.6 (Ubuntu)</center>
</body>
</html>
```
解决： 在 nginx/nginx.conf 中的 http 下加入

http {
    ...
    client_max_body_size 64M;
}


