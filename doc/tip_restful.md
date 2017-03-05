## RESTful API 开发
[RESTful API URI 设计: 查询（Query）和标识（Identify）](http://www.cnblogs.com/xishuai/p/designing-rest-api-uri-query-and-identify.html)
[REST简介](http://www.cnblogs.com/loveis715/p/4669091.html)
用户列表：(用正则表达式进行匹配分解解析字符串)
GET /wpapis/v1/users
GET /wpapis/v1/users/1
GET /wpapis/v1/users/,+,20; GET /wpapis/v1/users/,-,20; GET /wpapis/v1/users/100,+,20; GET /wpapis/v1/users/100,-,20
POST /wpapis/v1/users
PUT /wpapis/v1/users/1
DELETE /wpapis/v1/users/1
### 使用restclient插件进行API调试
如果是POST，PUT json数据，则需要在Headers菜单中加入custom header， Content-Type: application/json
1: users:
{
"email":"222",
"pass":"123456",
"displayName":"1"
}
2: roles:
{
        "role": "author1",
        "name": "author1",
        "capabilities":
        [
            "upload_files",
            "edit_posts",
            "edit_published_posts",
            "publish_posts",
            "read",
            "delete_posts",
            "delete_published_posts"
        ]
    }
## 

