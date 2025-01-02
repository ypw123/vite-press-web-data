## 箭头函数

### 箭头函数与普通函数的区别

1) this 绑定：箭头函数没有自己的this绑定，它会捕获所在上下文的this值。而普通函数的this值根据函数调用方式动态绑定。

   在箭头函数中，this的值是词法上继承自外部作用域，也就是箭头函数所在的上下文。

```js

const obj = {
  name: "John",
  regularFunction: function () {
    console.log(this.name); // 正常输出 "John"
  },
  arrowFunction: () => {
    console.log(this.name); // 输出 undefined，因为箭头函数没有自己的 this 绑定
  },
};

obj.regularFunction();
obj.arrowFunction();

```

2) arguments 对象：箭头函数没有自己的arguments对象，而普通函数可以使用arguments对象获取所有传入的参数。

```js
function regularFunction() {
  console.log(arguments); // 输出传入的参数
}

regularFunction(1, 2, 3); // 输出 [1, 2, 3]

const arrowFunction = () => {
  console.log(arguments); // 抛出 ReferenceError，因为箭头函数没有 arguments 对象
};

arrowFunction(1, 2, 3);

```

3) 构造函数：箭头函数不能用做构造函数，不能用new关键字调用，并且没有自己的原型对象(prototype)

普通函数可以通过new关键字创建对象示例，并且有自己的原型对象。

```js
function RegularConstructor() {
  this.name = "John";
}

const regularInstance = new RegularConstructor();
console.log(regularInstance.name); // 输出 "John"

const arrowConstructor = () => {
  this.name = "John";
};

const arrowInstance = new arrowConstructor(); // 抛出 TypeError，箭头函数不能用作构造函数
```