## 执行上下文和执行栈

### 什么是执行上下文？
Javascript 代码都是在执行上下文中运行的

执行上下文：指当前执行中的环境变量、函数声明、作用域链、this等信息。

### 执行上下文生命周期

1) 创建阶段：

生成变量对象、建立作用域链、确定this指向

2) 执行阶段：

变量赋值、函数的应用、执行其它代码

![执行上下文生命周期](/public/jsBasic/执行上下文生命周期.jpg)

### 变量对象

变量对象是与执行上下文的相关作用域，储存了上下文定义的变量和函数声明

变量对象是一个抽象的概念，在全局执行上下文中，变量对象就是全局对象。在顶层js代码中，this指向全局对象，全局变量会做为该对象的属性来被查询。
在浏览器中，window就是全局对象

### 执行栈

是一种先进后出的数据结构，用来储存代码运行的所有上下文

1) 当JS引擎第一次遇到js脚本时，会创建一个全局的执行上下文并且压入当前执行栈

2) 每当JS引擎遇到一个函数调用，它会为该函数创建一个新的执行上下文并压入栈的顶部

3) 当函数执行结束时，执行上下文从栈中弹出，控制流程到达当前栈中的下一个上下文

4) 一旦所有代码执行完毕，JS引擎从当前栈中移除全局执行上下文

执行栈示例: 
 ```js
var a = 1; // 1. 全局上下文环境
function bar (x) {
    console.log('bar')
    var b = 2;
    fn(x + b); // 3. fn上下文环境
}
function fn (c) {
    console.log(c);
}
bar(3); // 2. bar上下文环境
```
执行图解:
![执行栈图解](/public/jsBasic/执行栈图解.jpg)

### 全局、函数、Eval执行上下文

执行上下文分为:<span class="fontRed">全局、函数、Eval执行上下文</span>

1) 全局执行上下文（浏览器环境下，为全局的 <span class="fontRed">window</span> 对象）

2) 函数执行上下文，每当一个函数被调用时，都会为该函数创建一个新的执行上下文

3) Eval 函数执行上下文，如eval("1+2")

对于每个执行上下文，都有三个重要属性：<span class="fontRed">变量对象、作用域链、this</span>

### 执行上下文的特点

1) 单线程，只在主线程上运行；

2) 同步执行，从上向下顺序执行；

3) 全局上下文只有一个，也就是<span class="fontRed">window</span> 对象；

4) 函数每调用一次就会产生一个新的执行上下文环境。 

[理解 JavaScript 中的执行上下文和执行栈](https://juejin.cn/post/6844903682283143181)

[理解JavaScript的执行上下文](https://zhuanlan.zhihu.com/p/72959191s)

[JavaScript进阶-执行上下文](https://juejin.cn/post/6844903983438381069)


##  理解执行上下文和执行栈

```js

1: let a = 3
2: function addTwo(x) {
3:   let ret = x + 2
4:   return ret
5: }
6: let b = addTwo(a)
7: console.log(b)

```

为了理解JavaScript引擎是如何工作的，分析以上代码运行机制：

1) 在<span class="fontRed">1</span> ,我们在全局执行上下文声明了一个新变量
<span class="fontRed">a</span>,并赋值为
<span class="fontRed">3</span>

2) 接下来就变得棘手了，第<span class="fontRed">2</span>行到第
<span style = "color:#e14d0c;font-size:13pxbackground:#fcf5f5;padding:4px 6px">5</span>实际上是在一起的。这里发生了什么？我们在全局执行上下文
中声明了一个名为<span class="fontRed">addTwo</span>的新的变量,我们分配了什么？一个函数的定义。两个
<span class="fontRed">{}</span>之间任何内容都分配
给<span class="fontRed">addTwo</span>,函数内部的代码没有被求值，没有被执行，只是存储在一个变量备用使用。

3) 现在我们在第<span class="fontRed">6</span>行，它看起来很简单，但这里的很多东西都要拆分分析。首先，我们在全局执行上下文中声明一个新的变量，并将其标记为<span class="fontRed">b</span>,变量一经声明，其值即为
<span class="fontRed">undefined</span>。

4) 接下来，仍然在第<span class="fontRed">6</span>行，我们看到了一个赋值操作符。我们准备给变量
<span class="fontRed">b</span>赋值,接下来我们看到一个函数被
调用。当看到变量后面跟着一个圆括号<span class="fontRed">(..)</span>时，这就时调用函数的信号，接着，每个函数都返回一些东西（值、对象或者undefined）,无论函数返回什么
，都将赋值给变量<span class="fontRed">b</span>。

5) 但是首先我们需要调用<span class="fontRed">addTwo</span>的函数。JavaScript将在其全局执行上下文内存中查找名为<span class="fontRed">addTwo</span>的变量。
它是步骤2（2-5行）中定义的，变量<span class="fontRed">addTwo</span>包含一个函数的定义。注意变量<span class="fontRed">a</span>作为参数传递给函数，JavaScript
在全局执行上下文内存中搜索变量<span class="fontRed">a</span>，找到它，发现它的值是<span class="fontRed">3</span>，并将数字<span class="fontRed">3</span>
作为参数传递给函数，准备好执行函数。

6) 现在执行上下文将切换，创建了一个新的本地执行上下文，我们将其命名为“addTwo执行上下文”，执行上下文被推到调用栈上。在<span class="fontRed">addTwo</span>执行上下文中，我们要做的第一件事是什么？

7) 你可能会说，“在<span class="fontRed">addTwo</span>执行上下文中声明了一个新的变量<span class="fontRed">ret</span>”，这是不对的。正确的答案是，我们需要先看函数的参数，在<span class="fontRed">addTwo</span>执行上下文中声明一个新的变量“x”，因为值<span class="fontRed">3</span>是作为参数传递的，所以变量<span class="fontRed">x</span>被赋值为3

8) 下一步是在<span class="fontRed">addTwo</span>执行上下文中声明一个新的变量<span class="fontRed">ret</span>。它的值被设置为<span class="fontRed">undefined</span>

9) 仍然是第3行，需要执行一个相加操作。首先我们需要<span class="fontRed">x</span>的值，JavaScript会寻找变量<span class="fontRed">x</span>,它会首先在<span class="fontRed">addTwo</span>执行上下文中寻找，找到一个值为<span class="fontRed">3</span>，第二个操作数是数字<span class="fontRed">2</span>，两个相加结果为<span class="fontRed">5</span>就分配给变量<span class="fontRed">ret</span>

10) 第<span class="fontRed">4</span>行，我们返回变量<span class="fontRed">ret</span>的内容，在addTwo执行上下文中查找，找到值<span class="fontRed">5</span>，
并将其返回给全局执行上下文。

11) 第<span class="fontRed">4-5</span>行，函数结束。addTwo执行上下文被摧毁，变量<span class="fontRed">x</span>和ret被释放，它们已经不存在了。
addTwo执行上下文从调用堆栈中弹出，返回值返回给调用上下文，在这种情况下，调用上下文是全局执行上个下文，因为函数<span class="fontRed">addTwo</span>是在全局执行上下文中调用的。

12) 现在我们继续第<span class="fontRed">4</span>步的内容，返回值5被分配给变量<span class="fontRed">b</span>,程序运行仍然在第<span class="fontRed">6</span>行。

13) 在第<span class="fontRed">7</span>行，我们打印变量<span class="fontRed">b</span>的值，它的值为5。







