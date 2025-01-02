## 浅拷贝/深拷贝

- 浅拷贝是创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址，所以 **如果其中一个
对象改变了这个地址，就会影响到另一个对象。**

- 深拷贝是将一个对象从内存中完整的拷贝一份出来，从堆内存中开辟一个新的区域存放新对象，且 **修改新对象不会影响原对象**。
  
```js
var a1 = {b: {c: {}};

var a2 = shallowClone(a1); // 浅拷贝方法
a2.b.c === a1.b.c // true 新旧对象还是共享同一块内存

var a3 = deepClone(a3); // 深拷贝方法
a3.b.c === a1.b.c // false 新对象跟原对象不共享内存

```

![浅拷贝](/public/jsBasic/浅拷贝.png)
![深拷贝](/public/jsBasic/深拷贝.png)
*
总而言之，浅拷贝只复制指向某个对象的指针，而不是复制对象本身，**新旧对象还是共享同一个内存**。但深拷贝会另外创造一个一模一样的对象，**新对象跟原对象不共享内存**，
修该新对象不会改到原对象。

### 赋值和深/浅拷贝的区别

这三者的区别如下，不过比较的前提都是**针对引用类型:**

- 当我们把一个对象赋值给一个新的变量时，**赋的其实时该对象的在栈中的地址，而不是推中的数据。** 也就是两个对象指向的是同一个内存空间，无论哪个对象发生改变，其实都是改变的存储空间的内容，因此，两个对象是联动的。
- 浅拷贝：重新在堆中创建内存，拷贝前后对象的基本数据类型互不影响，但拷贝前后对象的引用类型因共享一块内存，会相互影响。
- 深拷贝：从堆内存中开辟一个新的区域存放新对象，对对象中的子对象进行递归拷贝，拷贝前后的两个对象互不影响。
  
```js

// 对象赋值
let obj1 = {
    name : '浪里行舟',
    arr : [1,[2,3],4],
};
let obj2 = obj1;
obj2.name = "阿浪";
obj2.arr[1] =[5,6,7] ;
console.log('obj1',obj1) // obj1 { name: '阿浪', arr: [ 1, [ 5, 6, 7 ], 4 ] }
console.log('obj2',obj2) // obj2 { name: '阿浪', arr: [ 1, [ 5, 6, 7 ], 4 ] }

// 浅拷贝
let obj1 = {
    name : '浪里行舟',
    arr : [1,[2,3],4],
};
let obj3=shallowClone(obj1)
obj3.name = "阿浪";
obj3.arr[1] = [5,6,7] ; // 新旧对象还是共享同一块内存
// 这是个浅拷贝的方法
function shallowClone(source) {
    var target = {};
    for(var i in source) {
        if (source.hasOwnProperty(i)) {
            target[i] = source[i];
        }
    }
    return target;
}
console.log('obj1',obj1) // obj1 { name: '浪里行舟', arr: [ 1, [ 5, 6, 7 ], 4 ] }
console.log('obj3',obj3) // obj3 { name: '阿浪', arr: [ 1, [ 5, 6, 7 ], 4 ] }

// 深拷贝
let obj1 = {
    name : '浪里行舟',
    arr : [1,[2,3],4],
};
let obj4=deepClone(obj1)
obj4.name = "阿浪";
obj4.arr[1] = [5,6,7] ; // 新对象跟原对象不共享内存
// 这是个深拷贝的方法
function deepClone(obj) {
    if (obj === null) return obj; 
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    if (typeof obj !== "object") return obj;
    let cloneObj = new obj.constructor();
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 实现一个递归拷贝
        cloneObj[key] = deepClone(obj[key]);
      }
    }
    return cloneObj;
}
console.log('obj1',obj1) // obj1 { name: '浪里行舟', arr: [ 1, [ 2, 3 ], 4 ] }
console.log('obj4',obj4) // obj4 { name: '阿浪', arr: [ 1, [ 5, 6, 7 ], 4 ] 
```

### 浅拷贝的实现方式

#### 1.Object.assign()

Object.assign() 方法可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回对象。

```js

let obj1 = { person: {name: "kobe", age: 41},sports:'basketball' };
let obj2 = Object.assign({}, obj1);
obj2.person.name = "wade";
obj2.sports = 'football'
console.log(obj1); // { person: { name: 'wade', age: 41 }, sports: 'basketball' }

```

#### 2.展开运算符

```js

let obj1 = { name: 'Kobe', address:{x:100,y:100}}
let obj2= {... obj1}
obj1.address.x = 200;
obj1.name = 'wade'
console.log('obj2',obj2) // obj2 { name: 'Kobe', address: { x: 200, y: 100 } }

```
#### 3.Array.prototype.concat()

```js

let arr = [1, 3, {
    username: 'kobe'
    }];
let arr2 = arr.concat();    
arr2[2].username = 'wade';
console.log(arr); //[ 1, 3, { username: 'wade' } ]
``` 

#### 4.Array.prototype.slice()

```js

let arr = [1, 3, {
    username: ' kobe'
    }];
let arr3 = arr.slice();
arr3[2].username = 'wade'
console.log(arr); // [ 1, 3, { username: 'wade' } ]

```

### 深拷贝的实现

#### 1.JSON.parse(JSON.stringify())

```js

let arr = [1, 3, {
    username: ' kobe'
}];
let arr4 = JSON.parse(JSON.stringify(arr));
arr4[2].username = 'duncan'; 
console.log(arr, arr4)

```

这也是利用JSON.stringify将对象转成JSON字符串，在JSON.parse把字符串解析成对象，一去一来，新的对象产生了，而且对象会开辟新的栈，实现深拷贝。

**这种方法虽然可以实现数组或对象深拷贝，但不能处理函数和正则**

```js
let arr = [1, 3, {
    username: ' kobe'
},function(){}];
let arr4 = JSON.parse(JSON.stringify(arr));
arr4[2].username = 'duncan'; 
console.log(arr, arr4)
```
#### 2.手写深拷贝

```js

// 使用hash 存储已拷贝过的对象，避免循环拷贝和重复拷贝
function deepClone(target, hash = new WeakMap()) {
  if (!isObject(target)) return target;
  if (hash.get(target)) return hash.get(target);
  // 兼容数组和对象
  let newObj = Array.isArray(target) ? [] : {};
  // 关键代码，解决对象的属性循环引用 和 多个属性引用同一个对象的问题，避免重复拷贝
  hash.set(target, newObj);
  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      if (isObject(target[key])) {
        newObj[key] = deepClone(target[key], hash); // 递归拷贝
      } else {
        newObj[key] = target[key];
      }
    }
  }
  return newObj;
}
function isObject(target) {
  return typeof target === "object" && target !== null;
}

// 示例
let info = { item: 1 };
let obj = {
  key1: info,
  key2: info,
  list: [1, 2]
};

// 循环引用深拷贝示例
obj.key3 = obj;
let val = deepClone(obj);
console.log(val);


```

使用 <span class='fontRed'>WeakMap</span>的好处，WeakMap储存的key必须是对象，并且key都是 <span class='fontRed'>弱引用</span>，便于垃圾回收