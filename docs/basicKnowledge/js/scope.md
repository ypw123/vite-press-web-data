## 作用域

作用域：可访问变量的集合

作用域最大的用处就是 <span class="fontRed">隔离变量</span>,不同作用域下同名变量不会有冲突 

### 作用域类型 

<span class="fontRed">全局作用域</span>、<span class="fontRed">函数作用域</span>、ES6中新增了<span class="fontRed">块级作用域</span>

#### 函数作用域

是指声明在函数内部的变量，函数的作用域在函数定义时就决定了

#### 块级作用域

1) 块级作用域由 <span class="fontRed">{ }</span>包括，if和for语句里面的<span class="fontRed">{ }</span>也属于块作用域

2) 在块级作用域中，可通过let和const声明变量，该变量在指定块的作用域外无法被访问

### var、let、const的区别

1) var定义的变量，没有块的概念，可以跨块访问，可以变量提升

2) let定义的变量，只能在块作用域里访问，不能跨块访问，也不能跨函数访问，无变量提升，不可以重复声明

3) const用来定义常量，使用时必须初始化(必须赋值)，只能在块作用域里访问，而且不能修改，无变量提升，不可以重复声明

#### let和const声明的变量只在块级作用域里内有效，示例

 ```js
function func() {
  if (true) {
    let i = 3;
  }
  console.log(i); // 报错 "i is not defined"
}
func();
```

### var与let的经典案例

1) 用var定义i变量，循环后打印i的值

 ```js
// 案例1
// i是var声明的，在全局范围内都有效，全局只有一个变量i，输出的是最后一轮的i值，也就是 10

var a = [];
for (var i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i);
  };
}
a[0]();  // 10
```

2) 用let定义i变量，循环后打印i的值

 ```js
// 案例2
// 用let声明i，for循环体内部是一个单独的块级作用域，相互独立，不会相互覆盖
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i);
  };
}
a[0](); // 0
```
### let的实现原理

借助闭包和函数作用域来实现块级作用域的效果

 ```js
// 用var实现案例2的效果
var a = [];

var _loop = function _loop(i) {
  a[i] = function() {
    console.log(i);
  };
};

for (var i = 0; i < 10; i++) {
  _loop(i);
}
a[0](); // 0
```
### 作用域链

当查找变量的时候,首先会从当前上下文的变量对象中查找，如果没有找到，就会从父级执行上下文的变量对象中查找，
如果还没有找到，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表
就叫做<span class="fontRed">作用域链</span>
