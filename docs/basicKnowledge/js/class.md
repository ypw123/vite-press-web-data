## Class类

1) Class类可以看作构造函数的语法糖

```js

class Point {}
console.log(typeof Point); // "function"
console.log(Point === Point.prototype.constructor); // true

```

2) Class类中的定义方法，都是定义在该构造函数的原型上

```js

class Point {
  constructor() {}
  toString() {}
}
// 等同于
Point.prototype = { constructor() {}, toString() {} };

```
3) 使用 <span class='fontRed'>static</span>关键字，作为静态方法(静态方法，只能通过类调用，实例不能调用)

```js
class Foo {
  static classMethod() {
    return "hello";
  }
}
Foo.classMethod(); // 'hello'

```
4) 实例属性的简写写法

```js

class Foo {
  bar = "hello";
  baz = "world";
}
// 等同于
class Foo {
  constructor() {
    this.bar = "hello";
    this.baz = "world";
  }
}

```

5) <span class='fontRed'>extends</span> 关键字，也是寄生组合式继承

```js

class Parent {
  constructor(age) {
    this.age = age;
  }
  getName() {
    console.log(this.name);
  }
}
class Child extends Parent {
  constructor(name, age) {
    super(age);
    this.name = name;
  }
}
let child = new Child("li", 16);
child.getName(); // li

```
### 手写Class类

ES6的Class 内部是基于寄生组合是继承，它是目前最理想的继承方式。

ES6的Class 允许子类继承父类的静态方法和属性。

```js

// Child 为子类的构造函数， Parent为父类的构造函数
function selfClass(Child, Parent) {
  // Object.create 第二个参数，给生成的对象定义属性和属性描述符/访问器描述符
  Child.prototype = Object.create(Parent.prototype, {
    // 子类继承父类原型上的属性和方法
    constructor: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: Child
    }
  });
  // 继承父类的静态属性和静态方法
  // **Object.setPrototypeOf()**方法设置一个指定的对象的原型（即，内部 `[[Prototype]]` 属性）到另一个对象或 [`null`]
  Object.setPrototypeOf(Child, Parent);
}

// 测试
function Child() {
  this.name = 123;
}
function Parent() {}
// 设置父类的静态方法getInfo
Parent.getInfo = function() {
  console.log("info");
};
Parent.prototype.getName = function() {
  console.log(this.name);
};
selfClass(Child, Parent);
Child.getInfo(); // info
let tom = new Child();
tom.getName(); // 123

```

[Class类的基本语法](https://es6.ruanyifeng.com/#docs/class)

###  set get

在JavaScript中，你可以使用 <span class='fontRed'>get</span> 和 <span class='fontRed'>set</span> 关键字定义类的访问属性。访问器属性允许你在获取或设置属性值时执行自定义的操作

```js

class MyClass {
  constructor() {
    this._myProperty = 0; // 带有下划线的属性表示它是私有的
  }

  get myProperty() {
    return this._myProperty;
  }

  set myProperty(value) {
    // 在设置属性值时，你可以执行一些自定义的操作
    if (value >= 0) {
      this._myProperty = value;
    } else {
      console.log("属性值必须大于等于 0");
    }
  }
}

const myObject = new MyClass();
console.log(myObject.myProperty); // 输出: 0

myObject.myProperty = 10;
console.log(myObject.myProperty); // 输出: 10

myObject.myProperty = -5; // 输出: 属性值必须大于等于 0
console.log(myObject.myProperty); // 输出: 10

```
在上面的示例中，<span class='fontRed'>MyClass</span>类定义了一个名为 <span class='fontRed'>myProperty</span>的访问器属性。<span class='fontRed'>set myProperty(value)</span>方法用于设置属性的值。在设置属性值时，我们可以添加一些自定义的逻辑。在这个示例中，我们确保属性值大于等于0，如果小于0，则输出一条错误信息

注意，为了避免与访问器属性冲突，在构造函数中使用了一个带有下划线前缀的私有属性 <span class='fontRed'>_myProperty</span>,这是一种常见的命名约定，用于表示该属性应该被视为私有的，以防止直接访问。通过访问器属性 <span class='fontRed'>myProperty</span>,我们可以对该私有属性进行间接访问和操作
