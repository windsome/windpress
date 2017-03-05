#数据库操作
1. 命令行登录数据库
`mysql -u USERNAME -pPASSWORD -h HOST -P PORT DBNAME`
2. 备份数据库
`mysqldump -u USERNAME -pPASSWORD -h HOST -P PORT DBNAME > DBNAME.sql`
3. 恢复数据库
```
自动创建数据库
mysql -u root -p123456 < init.sql
已创建的数据库导入数据
mysql -u root -p123456 com_safety999_www < db.sql
```
4. 创建数据库
```
mysql -u root -p123456
CREATE DATABASE `com_safety999_www` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
```
5. 删除数据库
```
mysql -u root -p123456
drop database com_safety999_www;
```
6. 创建超级用户
GRANT ALL PRIVILEGES ON *.* TO admin@localhost IDENTIFIED BY 'ZMdoc@018' WITH GRANT OPTION;
FLUSH PRIVILEGES;

