# 使用react-router时，首页跳转到某个子路由的页面去，要注意写法
当是jsx风格时，是用Redirect或IndexRedirect完成。当使用plain route时，是用onEnter()完成的，注意这个函数所写的位置，应该在indexRoute下。
```
正确：
export const createRoutes = (store) => ({
    path: '/',
    //component: EmptyLayout,
    //indexRoute: BlogRoute(store),
    indexRoute: {
        onEnter: (nextState, replace) => {
            replace ('/iot/');
        }   
    },
    childRoutes: [
    ...
    ...
    
错误写法（直接写到根路径上，会造成无限循环）：
export const createRoutes = (store) => ({
    path: '/',
    //component: EmptyLayout,
    //indexRoute: BlogRoute(store),
    onEnter: (nextState, replace) => {
        replace ('/iot/');
    },
    childRoutes: [
    ...
    ...
```

