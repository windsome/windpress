curl 'http://localhost:3000/apis/db/create_user?openid=1&info=a'
echo ' '
curl 'http://localhost:3000/apis/db/create_user?openid=2&info=b'
echo ' '
curl 'http://localhost:3000/apis/db/create_user?openid=3&info=c'
echo ' '
curl 'http://localhost:3000/apis/db/create_user?openid=4&info=d'
echo ' '

#curl http://localhost:3000/apis/db/update_user?id=29b1cda2-09a5-46dd-88ad-e3e6ea280fe2&info=f
#curl http://localhost:3000/apis/db/list_user

echo 'create lock: '
curl 'http://localhost:3000/apis/db/create_lock?thing=\{"info":"d","owner":"247f215e-31cc-4648-8eb4-b3c913ac67b6"\}'

echo 'update lock: '
curl 'http://localhost:3000/apis/db/update_lock?thing=\{"id":"fcacd15d-7fdf-406d-a82e-e50864fa0e9a","info":"d"\}'

echo 'list all locks '
curl 'http://localhost:3000/apis/db/list_lock'

echo 'list lock of user:'
curl 'http://localhost:3000/apis/db/list_lock?where=\{"owner":"247f215e-31cc-4648-8eb4-b3c913ac67b6"\}'
echo ' '
echo ' '
