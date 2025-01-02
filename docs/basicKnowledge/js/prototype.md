## 原型/原型链

### 原型的作用

原型被定义为给其它对象提供共享属性的对象，函数的实例可以共享原型上的属性和方法

### 原型链

它的作用就是当你在访问一个对象上属性的时候，如果该对象内部不存在这个属性，那么就会它 <span class='fontRed'> \_\_proto\_\_ </span>属性所指向的对象（原型对象）上查找。如果原型对象依旧不存在这个属性，那么就会去其原型的<span class='fontRed'> \_\_proto\_\_ </span>属性所指向的原型对象上去查找。以此类推，知道找到 <span class='fontRed'>null</span>,而这个查找的线路，也就构成了我们常说的**原型链**。

#### 图解

![图解](/public/jsBasic/原型链.png)

### 原型链和作用域的区别

  原型链是查找对象上的属性，作用域是查找当前上下文的变量

### proto、prototype、constructor属性介绍

1) js中对象分为两种，普通对象和函数对象
   
2) <span class='fontRed'> \_\_proto\_\_ </span>和<span class='fontRed'> constructor </span>是对象独有的。<span class='fontRed'>prototype</span>是函数独有的，它的作用是包含可以给特定类型的所有实例提供共享的属性和方法；但在JS中，函数也是对象，所以函数也拥有<span class='fontRed'> \_\_proto\_\_ </span>和<span class='fontRed'> constructor </span>属性。
   
3) <span class='fontRed'> constructor </span>属性是对象所独有的，它是一个对象指向一个函数，这个函数就是该对象的构造函数 <span class='fontRed'>
构造函数.prototype.constructor === 该构造函数的本身</span>

4) 一个对象的<span class='fontRed'> \_\_proto\_\_ </span>指向其构造函数的<span class='fontRed'>prototype</span>，
<span class='fontRed'>函数创建的对象.\_\_proto\_\_ === 该函数.prototype</span>

5) 特殊的<span class='fontRed'>object</span>、<span class='fontRed'>Function</span>

```js

console.log(Function.prototype === Function.__proto__); // true
console.log(Object.__proto__ === Function.prototype); // true
console.log(Function.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null); // true

```

### instanceof

<span class='fontRed'>instanceof</span>的基本用法，它可以判断一个对象的原型链上是否包含该构造函数的原型，经常用来判断对象是否为该构造函数的实例。

**特殊示例**

```js

console.log(Object instanceof Object); //true
console.log(Function instanceof Function); //true
console.log(Function instanceof Object); //true
console.log(function() {} instanceof Function); //true

```
**手写instanceof**

```js
function instanceOf(obj, fn) {
  let proto = obj.__proto__;
  if (proto) {
    if (proto === fn.prototype) {
      return true;
    } else {
      return instanceOf(proto, fn);
    }
  } else {
    return false;
  }
}

// 测试
function Dog() {}
let dog = new Dog();
console.log(instanceOf(dog, Dog), instanceOf(dog, Object)); // true true
```
**instanceof和typeof的区别**

1) <span class='fontRed'>typeof</span>一般用来判断一个变量的类型，typeof可以用来判断 <span class='fontRed'>number、boolean、string、function、symbol、undefined、object</span>，特殊情况 <span class='fontRed'>typeof null === object</span>

2) <span class='fontRed'>instanceof</span>判断一个对象的原型链是否包含该构造函数的原型。

[JS原型与原型链详解](https://blog.csdn.net/Yi_qian1000/article/details/135264247)

### new 关键字

**new一个对象，到底发生什么？**

1) 创建一个对象，该对象的原型指向构造函数的原型对象。
2) 调用该构造函数，构造函数的this指向新生成的对象。
3) 判断构造函数是否有返回值，如果有返回值且返回值是一个对象或一个方法，否则返回新生成的对象
   
**构造函数有返回值的案例**

```js

function Dog(name) {
  this.name = name;
  return { test: 1 };
}
let obj = new Dog("ming");
console.log(obj); // {test:1} 

```

**手写new**

```js

function selfNew(fn, ...args) {
  // 创建一个instance对象，该对象的原型是fn.prototype
  let instance = Object.create(fn.prototype);
  // 调用构造函数，使用apply，将this指向新生成的对象
  let res = fn.apply(instance, args);
  // 如果fn函数有返回值，并且返回值是一个对象或方法，则返回该对象，否则返回新生成的instance对象
  return typeof res === "object" || typeof res === "function" ? res : instance;
}

```

### 继承

**多种继承方式**

1) 原型链继承，缺点:引用类型的属性被有所有实例共享

```js
function SuperClass() {
  this.superValue = true;
}
SuperClass.prototype.getSuperValue = function() {
  return this.superValue;
}

function SubClass() {
  this.subValue = false;
}
SubClass.prototype = new SuperClass();

SubClass.prototype.getSubValue = function() {
  return this.subValue;
}

var instance = new SubClass();

console.log(instance instanceof SuperClass)//true
console.log(instance instanceof SubClass)//true
console.log(SubClass instanceof SuperClass)//false

```

2) 借用构造函数(经典继承)

```js

function SuperClass(id) {
  this.books = ['js','css'];
  this.id = id;
}
SuperClass.prototype.showBooks = function() {
  console.log(this.books);
}
function SubClass(id) {
  //继承父类
  SuperClass.call(this,id);
}
//创建第一个子类实例
var instance1 = new SubClass(10);
//创建第二个子类实例
var instance2 = new SubClass(11);

instance1.books.push('html');
console.log(instance1)
console.log(instance2)
instance1.showBooks();//TypeError


```

3) 原型式继承

```js
function inheritObject(o) {
    //声明一个过渡对象
  function F() { }
  //过渡对象的原型继承父对象
  F.prototype = o;
  //返回过渡对象的实例，该对象的原型继承了父对象
  return new F();
}

var book = {
    name:'js book',
    likeBook:['css Book','html book']
}
var newBook = inheritObject(book);
newBook.name = 'ajax book';
newBook.likeBook.push('react book');
var otherBook = inheritObject(book);
otherBook.name = 'canvas book';
otherBook.likeBook.push('node book');
console.log(newBook,otherBook);

```
4) 寄生式继承

```js

var book = {
    name:'js book',
    likeBook:['html book','css book']
}
function createBook(obj) {
    //通过原型方式创建新的对象
  var o = new inheritObject(obj);
  // 拓展新对象
  o.getName = function(name) {
    console.log(name)
  }
  // 返回拓展后的新对象
  return o;
}

```

5) 组合式继承
```js
function SuperClass(name) {
  this.name = name; 
  this.books = ['Js','CSS'];
}
SuperClass.prototype.getBooks = function() {
    console.log(this.books);
}
function SubClass(name,time) {
  SuperClass.call(this,name);
  this.time = time;
}
SubClass.prototype = new SuperClass();

SubClass.prototype.getTime = function() {
  console.log(this.time);
}

```
6) 寄生组合式继承

优势: 借用父类的构造函数，在不需要生成父类实例的情况下，继承了父类原型上的属性和方法

```js

// 精简版
class Child {
  constructor() {
    // 调用父类的构造函数
    Parent.call(this);
    // 利用Object.create生成一个对象，新生成对象的原型是父类的原型，并将该对象作为子类构造函数的原型，继承了父类原型上的属性和方法
    Child.prototype = Object.create(Parent.prototype);
    // 原型对象的constructor指向子类的构造函数
    Child.prototype.constructor = Child;
  }
}

// 通用版
function Parent(name) {
  this.name = name;
}
Parent.prototype.getName = function() {
  console.log(this.name);
};
function Child(name, age) {
  // 调用父类的构造函数
  Parent.call(this, name); 
  this.age = age;
}
function createObj(o) {
  // 目的是为了继承父类原型上的属性和方法，在不需要实例化父类构造函数的情况下，避免生成父类的实例，如new Parent()
  function F() {}
  F.prototype = o;
  // 创建一个空对象，该对象原型指向父类的原型对象
  return new F(); 
}

// 等同于 Child.prototype = Object.create(Parent.prototype)
Child.prototype = createObj(Parent.prototype); 
Child.prototype.constructor = Child;

let child = new Child("tom", 12);
child.getName(); // tom


```



