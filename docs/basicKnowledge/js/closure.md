## 闭包

**闭包：就是函数引用了外部作用域的变量**

### 闭包常见的两种情况

一是函数作为返回值；另一个是函数作为参数传递

### 闭包的作用

可以让局部变量的值始终保持在内存中；对内部变量进行保护，使外部访问不到

最常见的例子：<span class="fontRed">函数的防抖和节流</span>

### 闭包的垃圾回收

副作用：不合理的使用闭包，会造成内存泄露(就是该内存空间使用完毕后未被回收)

### 闭包的示例

```js
// 原始题目
for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i); // 1s后打印出5个5
  }, 1000);
}

//  利用闭包，将上述题目改成1s后，打印0,1,2,3,4

// 方法一：
for (var i = 0; i < 5; i++) {
  (function (j) {
    setTimeout(function timer() {
      console.log(j);
    }, 1000);
  })(i);
}

// 方法二：
// 利用setTimeout的第三个参数，第三个参数将作为setTimeout第一个参数的参数
for (var i = 0; i < 5; i++) {
  setTimeout(
    function fn(i) {
      console.log(i);
    },
    1000,
    i
  ); // 第三个参数i,将作为fn的参数
}

// ⬅️将上述题目改成每间隔1s后，依次打印0,1,2,3,4
for (var i = 0; i < 5; i++) {
  setTimeout(
    function fn(i) {
      console.log(i);
    },
    1000 * i,
    i
  );
}
```

## 理解闭包

### 返回函数的函数

让我们看一个返回函数的函数示例：

```js

 1: let val = 7
 2: function createAdder() {
 3:   function addNumbers(a, b) {
 4:     let ret = a + b
 5:     return ret
 6:   }
 7:   return addNumbers
 8: }
 9: let adder = createAdder()
10: let sum = adder(val, 8)
11: console.log('example of function returning a function: ', sum)

```

分步分解以上代码：

1. 第<span class="fontRed">1</span>行。我们在全局执行上下文中声明一个变量<span class="fontRed">val</span>，并将其初始化为 7。

2. 第<span class="fontRed">2-8</span>行。我们在全局执行上下文声明了一个名称为<span class="fontRed">createAdder</span>的函数。第<span class="fontRed">3-6</span>行。我们在函数体内声明了一个名称为<span class="fontRed">addNumbers</span>的函数储存在<span class="fontRed">createAdder</span>变量中。

3. 第<span class="fontRed">9</span>行，我们在全局执行上下文声明了名为<span class="fontRed">adder</span>的变量，暂时，值为<span class="fontRed">undefined</span>。

4. 第<span class="fontRed">9</span>行。我们看到了<span class="fontRed">()</span>,我们需执行或调用一个函数，在查找全局执行上下文的内存并查找函数名称为<span class="fontRed">createAdder</span>的变量，它是步骤<span class="fontRed">2</span>中创建的。

5. 调用函数时，执行到第<span class="fontRed">2</span>行。创建一个新的<span class="fontRed">createAdder</span>执行上下文。我们可以在<span class="fontRed">createAdder</span>的执行上下文中创建自有变量。js 引擎将<span class="fontRed">createAdder</span>的上下文添加到调用推栈。这个函数没有参数，让我们直接跳到它的主体部分。

6. 第<span class="fontRed">3-6</span>行，我们有一个新的函数声明，我们在<span class="fontRed">createAdder</span>执行上下文中创建一个变量<span class="fontRed">addNumbers</span>。这很重要，<span class="fontRed">addNumbers</span>只存在于<span class="fontRed">createAdder</span>执行上下文中。我们将函数定义存储在名为<span class="fontRed">addNumbers</span>的变量中。

7. 第<span class="fontRed">7</span>行，我们看到了<span class="fontRed">return</span>关键字，我们返回函数。js 引擎查找一个名为<span class="fontRed">addNumbers</span>
   的变量并找到它。函数可以返回任何东西，包括函数定义。我们返回<span class="fontRed">addNumbers</span>的定义。第<span class="fontRed">4</span>行和<span class="fontRed">5</span>行括号之间的内容构成该函数的定义。

8. 返回时，<span class="fontRed">createAdder</span>执行上下文将被销毁。<span class="fontRed">addNumbers</span>变量不在存在。但<span class="fontRed">addNumbers</span>
   函数定义仍然存在，因为它返回并赋值给了变量<span class="fontRed">adder</span>。

9. 第<span class="fontRed">10</span>行，我们在全局执行上下文中定义了一个新的变量<span class="fontRed">sum</span>，先赋值为<span class="fontRed">undefined</span>。

10. 接下来我们需要执行一个函数。那个函数？名为<span class="fontRed">adder</span>变量中定义的函数。我们在全局执行上下文中找到它，果然找到了它，这个函数有两个参数。

11. 让我们查找这两个参数，第一个是我们在步骤 1 中定义的变量<span class="fontRed">val</span>它表示数字 7，第二个参数是 8。

12. 现在我们要执行这个函数，函数定义概述在<span class="fontRed">3-5</span>行，因为这个函数是匿名，为了方便理解，我们暂时叫它<span class="fontRed">adder</span>。这是创建一个<span class="fontRed">adder</span>函数执行上下文，在<span class="fontRed">adder</span> 执行上下文中创建了两个新变量<span class="fontRed">a</span>和<span class="fontRed">b</span>。它们分别被赋值 7 和 8，因为这些是我们在上一步传递给函数的参数。

13. 第<span class="fontRed">4</span>行。在<span class="fontRed">adder</span>执行上下文中声明了一个名为<span class="fontRed">ret</span>的新变量，将变量<span class="fontRed">a</span>和<span class="fontRed">b</span>的内容相加得<span class="fontRed">15</span>并赋值<span class="fontRed">ret</span>变量。

14. <span class="fontRed">ret</span>变量从该函数返回，这个匿名函数执行上下文被销毁，从调用栈中删除，变量<span class="fontRed">a</span>、<span class="fontRed">b</span>和<span class="fontRed">ret</span>不在存在。

15. 返回值被分配给我们在步骤 9 中定义的<span class="fontRed">sum</span>变量。

16. 我们将<span class="fontRed">sum</span>的值打印到控制台

17. 如预期，控制台将打印 15。我们在这里确实经历了很多困难，我想说明这几点。首先，函数定义可以储存在变量中，函数定义在程序调用之前是不可见的。其次，每次调用函数时，都会
    创建一个本地执行上下文。当函数完成时，执行上下文将消失。函数在遇到 retrun 或右括号<span class="fontRed">}</span>时执行完成。

### 一个闭包

```js

 1: function createCounter() {
 2:   let counter = 0
 3:   const myFunction = function() {
 4:     counter = counter + 1
 5:     return counter
 6:   }
 7:   return myFunction
 8: }
 9: const increment = createCounter()
10: const c1 = increment()
11: const c2 = increment()
12: const c3 = increment()
13: console.log('example increment', c1, c2, c3)


```

1. 第<span class="fontRed">1-8</span>行。我们在全局执行上下文中创建了一个新的变量<span class="fontRed">createCounter</span>，它得到了指定的函数定义。

2. 第<span class="fontRed">9</span>行。我们在全局执行上下文中声明了一个名字为<span class="fontRed">increment</span>的新变量。

3. 第<span class="fontRed">9</span>行。我们需要调用<span class="fontRed">createCounter</span>函数并将其返回值赋给<span class="fontRed">increment</span>变量。

4. 第<span class="fontRed">1-8</span>行.调用函数，创建新的本地执行上下文。

5. 第<span class="fontRed">2</span>行。在本地执行上下文，声明一个名为<span class="fontRed">counter</span>的新变量并赋值为<span class="fontRed">0</span>。

6. 第<span class="fontRed">3-6</span>行。声明一个名字为<span class="fontRed">myFunction</span>的新变量，变量在本地执行上下文中声明，变量的内容是第<span class="fontRed">4</span>行和第<span class="fontRed">5</span>行所定义。

7. 第<span class="fontRed">7</span>行.返回<span class="fontRed">myFunction</span>变量的内容，删除本地执行上下文。变量<span class="fontRed">myFunction</span> 和<span class="fontRed">counter</span>不再存在。此时控制权回到了调用上下文。

8. 第<span class="fontRed">9</span>行。在调用全局上下文中，<span class="fontRed">createCounter</span>返回值赋给了<span class="fontRed">increment</span>,变量<span class="fontRed">increment</span>现在包含一个函数的定义内容为<span class="fontRed">createCounter</span>返回的函数。

9. 第<span class="fontRed">10</span>行。声明一个新变量<span class="fontRed">c1</span>。

10. 继续第<span class="fontRed">10</span>行。查找<span class="fontRed">increment</span>变量，它是一个函数并调用它。它包含前面返回的函数定义，如<span class="fontRed">4-5</span>行所定义。

11. 创建一个新的执行上下文。没有参数，开始执行函数。

12. 第<span class="fontRed">4</span>行。<span class="fontRed">counter = counter + 1</span>，寻找变量 <span class="fontRed">counter</span>，在查找本地或全局执行上下文之前，让我们检查一下闭包，瞧，闭包包含一个名为<span class="fontRed">counter</span>的变量，其值为<span class="fontRed">0</span>。在第<span class="fontRed">4</span>行表达式之后，它的值被设置为<span class="fontRed">1</span>。它再次被储存在闭包里，闭包现在包含值为<span class="fontRed">1</span>的变量 <span class="fontRed">counter</span>。

13. 第<span class="fontRed">5</span>行。我们返回<span class="fontRed">counter</span>的值，销毁本地执行上下文。

14. 回到第<span class="fontRed">10</span>行。返回值<span class="fontRed">1</span>被赋值给变量<span class="fontRed">c1</span>

15. 第<span class="fontRed">11</span>行。我们重复步骤<span class="fontRed">10-14</span>。这一次，在闭包中此时变量<span class="fontRed">counter</span>的值是 1。它在第<span class="fontRed">12</span>设置的，它的值被递增并以<span class="fontRed">2</span>的形式存储在递增函数的闭包中，<span class="fontRed">c2</span>被赋值为<span class="fontRed">2</span>

16. 第<span class="fontRed">12</span>行。重复步骤<span class="fontRed">10-14</span>行,c3 被赋值为 3。

17. 第<span class="fontRed">13</span>行。我们打印变量<span class="fontRed">c1 c2</span>和 <span class="fontRed">c3</span>的值。

你可能会问，是否有任何函数具有闭包，甚至是在全局范围内创建的函数？答案是肯定的。在全局作用域中创建的函数创建闭包，但是由于这些函数是在全局作用域中创建的，所以它们可以访问全局作用域中所有的变量。

当函数返回函数时，闭包的概念就变得更加重要了。返回的函数可以访问不属于全局作用域的变量，但它们仅存在与其闭包中。

### 闭包不是那么简单

有时候闭包在你甚至没有注意到它的时候就会出现，你可能已经看到了我们称为部分应用程序的示例，如下面的代码所示：

```js
let c = 4
const addX = x => n => n + x
const addThree = addX(3)
let d = addThree(c)
console.log('example partial application', d)

```
我们声明一个能用加法函数 <span  class="fontRed">addX</span> ，它接受一个参数<span  class="fontRed">x</span> 并返回另一个函数。返回的函数还接受一个参数并将其添加到变量x中。
变量<span  class="fontRed">x</span> 
是闭包的一部分，当变量<span  class="fontRed">addThree</span>在本地上下文中声明时，它被分配一个函数定义和一个闭包，闭包包含变量<span  class="fontRed">x</span>。
所以当<span  class="fontRed">addThree</span>被调用并执行时，它可以从闭包中访问变量?
<span  class="fontRed">x</span>以及为参数传递变量<span  class="fontRed">n</span>并返回两者的和<span  class="fontRed"> 7</span>。

### 总结

当一个函数被创建并传递或从另一个函数返回时,它会携带一个背包。背包中函数声明时作用域内的所有变量。