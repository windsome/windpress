## javascript中的singleton
[JS中singleton](https://www.sitepoint.com/javascript-design-patterns-singleton/)
```
ES5中写法：
var UserStore = (function(){
  var _data = [];

  function add(item){
    _data.push(item);
  }

  function get(id){
    return _data.find((d) => {
        return d.id === id;
    });
  }

  return {
    add: add,
    get: get
  };
}());

ES6写法1：
const _data = [];

const UserStore = {
  add: item => _data.push(item),
  get: id => _data.find(d => d.id === id)
}

Object.freeze(UserStore);
export default UserStore;

ES6写法2：
class UserStore {
  constructor(){
    this._data = [];
  }

  add(item){
    this._data.push(item);
  }

  get(id){
    return this._data.find(d => d.id === id);
  }
}

const instance = new UserStore();
Object.freeze(instance);

export default instance;
ES6写法3（更加OO化）：
class UserStore {
  constructor(){
   if(! UserStore.instance){
     this._data = [];
     UserStore.instance = this;
   }

   return UserStore.instance;
  }

 //rest is the same code as preceding example

}

const instance = new UserStore();
Object.freeze(instance); // 这一步可以不要，只是确保不修改instance下属性，但子属性的子属性可以修改。

export default instance;
```
[ES6中singleton写法](http://amanvirk.me/singleton-classes-in-es6/)
```
let instance = null;

class Cache{  
    constructor() {
        if(!instance){
              instance = this;
        }

        // to test whether we have singleton or not
        this.time = new Date()

        return instance;
      }
}
注意 instance不能写在Cache内部
```
ES7中singleton（ES7中能用static，用babel可以转成ES5），
```
export class FileBufferManager {
    static gInstance;
    constructor () {
        if (gInstance) return gInstance;
        debug ("FileBufferManager constructor! must be singleton!");
        this.filename = null;
        this.data = null;
        this.version = 0;
        this.gInstance = this;
    }
    static getInstance () {
        return new FileBufferManager();
    }
    ...
}
```

