## this

this的指向，始终坚持一个原理：__this永远指向最后调用它的那个对象__

### this的5种绑定方式

1) 默认绑定(非严格模式下this指向全局对象，严格模式下函数内的this指向<span class="fontRed">undefined</span>)

2) 隐式绑定(当函数引用有上下文对象时，如<span class="fontRed">obj.foo()</span>的调用方式，foo内的this指向obj)

3) 显示绑定(通过call或者apply方法直接指定this的绑定对象，如foo.call(obj))

4) new构造函数绑定，this指向新生成的对象

5) 箭头函数绑定，this指向的是定义该函数时，外层环境中的this，__箭头函数的this在定义时就决定了,不能改变__

### this 题目1

 ```js
 "use strict";
var a = 10; // var定义的a变量挂载到window对象上
function foo () {
  console.log('this1', this)  // undefined
  console.log(window.a)  // 10
  console.log(this.a)  //  报错，Uncaught TypeError: Cannot read properties of undefined (reading 'a')
}
console.log('this2', this)  // window
foo();
```

注意：开启了严格模式，只是使得函数内的this指向<span class="fontRed">undefined</span>，它并不会改变全局中this的指向。
因此<span class="fontRed">this1</span>中打印的<span class="fontRed">undefined</span>，
而<span class="fontRed">this2</span>还是<span class="fontRed">window</span>对象

### this 题目2

 ```js
let a = 10
const b = 20
function foo () {
  console.log(this.a)  // undefined
  console.log(this.b)  // undefined
}
foo();
console.log(window.a) // undefined  
```

如果把var改成了let或const，变量是不会被绑定到window对象上的,所以此时会打印出三个undefined

### this 题目3

 ```js
var a = 1
function foo () {
  var a = 2
  console.log(this)  // window
  console.log(this.a) // 1
}
foo()
d  
```
foo()函数内this指向的时window对象，因为window调用的foo，打印出的<span class="fontRed">this.a</span>是1，而不是2

### this 题目4

 ```js
var obj2 = {
    a: 2,
    foo1: function () {
      console.log(this.a) // 2
    },
    foo2: function () {
      setTimeout(function () {
        console.log(this) // window
        console.log(this.a) // 3
      }, 0)
    }
  }
  var a = 3
  
  obj2.foo1()
  obj2.foo2() 
```

对于<span class="fontRed">setTimeout</span>中的函数，这里存在隐式绑定的this丢失，也就是当我们将函数作为参数传递时，会被隐式赋值
，回调函数丢失this绑定，因此这时候setTimeout中函数内的this指向<span class="fontRed">window</span>

### this题目5

```js
var obj = {
 name: 'obj',
 foo1: () => {
   console.log(this.name) // window
 },
 foo2: function () {
   console.log(this.name) // obj
   return () => {
     console.log(this.name) // obj
   }
 }
}
var name = 'window'
obj.foo1()
obj.foo2()()

```

这道题证明了 __箭头函数内的this是由外层作用域决定的__

#### 题目5解析

1) 对于<span class="fontRed">obj.foo1()</span>函数的调用，foo1是一个箭头函数，箭头函数的this指向外层作用域，也就是window对象，因此打印出<span class="fontRed">window</span>


2) <span class="fontRed">obj.foo2()</span>是一个普通函数，普通函数的this指向调用它的对象，因此打印出<span class="fontRed">obj</span>,然后返回一个箭头函数，
因此在执行返回的箭头函数时，this也指向外层作用域，也就是<span class="fontRed">obj</span>

## apply、call、bind 函数
 
 用于改变this的指向

### 使用apply

```js
var a = {
    name : "Cherry",

    func1: function () {
        console.log(this.name)
    },

    func2: function () {
        setTimeout(  function () {
            this.func1()
        }.apply(a),100);
    }

};

a.func2()            // Cherry

``` 
### 使用call

```js

var a = {
    name : "Cherry",

    func1: function () {
        console.log(this.name)
    },

    func2: function () {
        setTimeout(  function () {
            this.func1()
        }.call(a),100);
    }

};

a.func2()            // Cherry

```

### 使用bind

```js
var a = {
    name : "Cherry",

    func1: function () {
        console.log(this.name)
    },

    func2: function () {
        setTimeout(  function () {
            this.func1()
        }.bind(a)(),100);
    }

};

a.func2()            // Cherry
```

### apply和call的区别

其实apply和call基本类似，他们的区别只是传入的参数不同。

apply 的语法为：

```js

fun.apply(thisArg, [argsArray])

```

call 的语法为：

```js

fun.call(thisArg[, arg1[, arg2[, ...]]])

```

所以apply和call的区别是call方法接受的若干个参数列表，而apply接收的是一个包含多个参数的数组

```js

var a ={
    name : "Cherry",
    fn : function (a,b) {
        console.log( a + b)
    }
}

var b = a.fn;
b.apply(a,[1,2])     // 3
b.call(a,1,2)  // 3

```

### bind 和 apply、call 的区别

我先来将刚刚的例子使用bind试下

```js

var a ={
    name : "Cherry",
    fn : function (a,b) {
        console.log( a + b)
    }
}

var b = a.fn;
b.bind(a,1,2)

```
发现并没有输出，这是为什么呢？
这是因为bind()方法创建一个新的函数，当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。
所以我们可以看出，bind是创建一个新的函数，我们必须手动去调用：

```js
var a ={
    name : "Cherry",
    fn : function (a,b) {
        console.log( a + b)
    }
}

var b = a.fn;
b.bind(a,1,2)()
```
### 总结

1) 三者都可以显式绑定函数的this指向

2) 三者第一个参数都是this要指向的对象，如果如果没有传入的话，默认指向window。

3) 传参不用：aplly是数组、call是参数列表，而bind可以分为多次传入，实现参数的合并

4) bind是返回对应函数，便于稍后调用；apply、call则是立即调用。

### 手写 call apply bind

```js

// 手写call
Function.prototype.Call = function(context, ...args) {
  // context为undefined或null时，则this默认指向全局window
  if (context === undefined || context === null) {
    context = window;
  }
  // 利用Symbol创建一个唯一的key值，防止新增加的属性与obj中的属性名重复
  let fn = Symbol();
  // this指向调用call的函数
  context[fn] = this; 
  // 隐式绑定this，如执行obj.foo(), foo内的this指向obj
  let res = context[fn](...args);
  // 执行完以后，删除新增加的属性
  delete context[fn]; 
  return res;
};

// apply与call相似，只有第二个参数是一个数组，
Function.prototype.Apply = function(context, args) {
  if (context === undefined || context === null) {
    context = window;
  }
  let fn = Symbol();
  context[fn] = this;
  let res = context[fn](...args);
  delete context[fn];
  return res;
};

// bind要考虑返回的函数，作为构造函数被调用的情况
Function.prototype.Bind = function(context, ...args) {
  if (context === undefined || context === null) {
    context = window;
  }
  let fn = this;
  let f = Symbol();
  const result = function(...args1) {
    if (this instanceof fn) {
      // result如果作为构造函数被调用，this指向的是new出来的对象
      // this instanceof fn，判断new出来的对象是否为fn的实例
      this[f] = fn;
      let res = this[f](...args, ...args1);
      delete this[f];
      return res;
    } else {
      // bind返回的函数作为普通函数被调用时
      context[f] = fn;
      let res = context[f](...args, ...args1);
      delete context[f];
      return res;
    }
  };
  // 如果绑定的是构造函数 那么需要继承构造函数原型属性和方法
  // 实现继承的方式: 使用Object.create
  result.prototype = Object.create(fn.prototype);
  return result;
};


```













