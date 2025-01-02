## 同步和异步

### 同步

- 基于js的单线程同时只能处理一件事情，而同步即是在主线程上排队执行的任务，只有当前任务执行完成，才会进入下一个任务。同步执行的函数会在预期得到结果，也就是可以清楚什么时候能得到返回值
- 所有的同步代码只会进入调用栈，同步代码会阻塞主线程的执行，而且会优先与其它非同步代码执行

### 异步
- 异步是指当前执行的代码会进入异步线程处理后才会在由主线程处理回调
- 异步的结果不是马上能得到，而是会在将来的某个时间点获取到
- 通常异步代码所要经过的步骤比同步代码多，由于异步代码不是直接放在调用栈中执行，而是要派发（可能不需要）给其他线程处理，等处理完成后的回调放在某个地方存储（比如任务队列），等到同步对列执行完成之后才会取回异步回调代码进行执行

### 异步、单线程、与EventLoop

先看一张图，有个大体结构
![异步图解](/public/jsBasic/异步.jpg)

- js主线程处理当前正在执行的代码，它会执行当前调用栈栈顶的执行上下文，从堆空间(一般是存储对象)和栈空间(一般存储非对象值以及对象引用)取数据，进而处理当前调用栈所用的数据
- 所有的同步代码会按照代码顺序压入调用栈中等待主线程执行，如果代码遇到了异步代码，则会根据异步类型抛给异步线程执行
- 异步类型，主要分为微任务与宏任务
- 任务队列其实本质就是一块内存空间，里面的任务是依据FIFO先进先出的规则来执行，所有异步代码执行完毕的回调都是加入到异步任务队列中等带主线程的调用
- 异步可以提高cpu的利用率

#### 微任务

- 微任务队列与宏任务队列的区别在于，主线程对于其中的任务调度的区别，主进程会优先执行微任务队列中的全部任务，当微任务中的全部任务执行完毕后才会转到宏任务执行
- 微任务可以由这些方法关键字调用产生Promise、async、await、MutationObserver、process.nextTick(Node.js环境)
- 如果调用微任务方法时，方法内部包含其他线程干预处理时，会抛给指定线程执行，而主线程继续执行下面代码，等到其它线程处理完成后，如果有回调函数则会把回调加入到指定异步类型（这里为微任务队列）的队列中排队等待主线程执行
- 微任务与宏任务的区别在于，主线程优先执行全部微任务，待执行完成之后才会挨个执行宏任务
  
#### 宏任务

- 一般的宏任务队列存放的是WebApis的回调，WebApis中包含许多线程，GUI渲染线程(与js主线程互斥不能同时执行)、事件触发线程、定时器线程、异步网络请求线程
- 宏任务存放由异步WebApis产生的回调函数，但优先级低于微任务

![宏任务和微任务](/public/jsBasic/宏任务和微任务.png)
#### js单线程

- js单线程设计之初就是为了简化代码，解决DOM冲突，如果js为多线程语言，那么有可能产生 多个线程同时操作DOM的情况，那么将会  导致js操作同时DOM引起冲突，介于多线程的锁机制来解决冲突，但又使得js的代码复杂度提高。
- 基于js单线程的设计，进而引出异步执行的方式，使得js具有类似多线程的效果，但不管异步还是同步，js永远都有一个线程在执行

#### EventLoop

在事件循环中，当主线程执行完当前的同步任务后，会检查事件队列中是否有待处理的事件。如果有，主线程会取出事件并执行对应的回调函数。这个循环的过程被称为**事件循环**，它由**主线程**和**任务队列**两部分组成。**主线程**负责 <span class='fontRed'>同步任务</span>，而 <span class='fontRed'>异步任务</span>则通过**任务队列**进行处理。这种机制保证了异步任务在适当的时机能够插入执行，从而实现了JavaScript的非阻塞异步执行。

事件循环流程如下：

1. 主线程读取JavaScript,形成相应的堆和执行栈。
2. 当主线程遇到异步任务时，将其委托给对应异步进程（如Web API）处理。
3. 异步任务完成后，将相应的回调函数推入任务队列。
4. 主线程执行完同步任务后，检查任务队列，如果有任务，则按照 <span class='fontRed'>先进先出</span>的原则将任务推入主线程执行。
5. 重复执行以上步骤，形成事件循环。

##### EventLoop 与 浏览器更新渲染时机
1) 浏览器更新渲染会在event loop中的 宏任务 和 微任务 完成后进行， 即 <span class='fontRed'>宏任务 -> 微任务 -> 渲染更新</span>
2) 宏任务队列中，如果大量任务等待执行时，将 <span class='fontRed'>dom的变动作为微任务，能更快的将变化呈现给用户</span>，这样就可以在这一次的事件轮询中更新dom

#### EventLoop 与 vue nextTick

**vue nextTick为什么要优先使用微任务实现？**

1) vue nextTick的源码实现，优先级判断，总结就是 <span class='fontRed'>Promise>MutationObserver>setTmmediate>setTimeout</span>
2) 这里优先使用Promise，因为根据event loop与浏览器更新渲染时机，使用微任务，本次event loop轮询就可以获取到更新的dom
3) 如果使用宏任务，要到下一次event loop,才能获取到更新的dom

#### Node中的process.nextTick

有很多文章把Node的process.nextTick和微任务混为一谈，但其实并不是同一个东西

process.nextTick 是 Node.js 自身定义实现的一种机制，有自己的 <span class='fontRed'>nextTickQueue</span>

**process.nextTick执行顺序早于微任务**

```js

console.log("start");
setTimeout(() => {
  console.log("timeout");
}, 0);
Promise.resolve().then(() => {
  console.log("promise");
});
process.nextTick(() => {
  console.log("nextTick");
  Promise.resolve().then(() => {
    console.log("promise1");
  });
});
console.log("end");
// 执行结果 start end nextTick  promise promise1 timeout 


```

### 任务队列

#### 任务队列类型

任务队列分为 <span class='fontRed'>宏任务</span>队列和 <span class='fontRed'>微任务</span>队列两种。JavaScript引擎遵循事件循环机制，当执行完当前宏任务后，会检查微任务队列，执行其中的微任务
然后再取下一个宏任务执行。

#### 任务执行过程

首先，必须要明确，在JavaScript中，所有任务都在主线程上执行。任务执行过程分为同步任务和异步任务两个阶段。异步任务的处理经历两个主要阶段：<span class='fontRed'>Event Table</span>
(事件表)和 <span class='fontRed'>Event Queue</span>(事件队列)。

<span class='fontRed'>Event Table</span>储存了宏任务的相关消息，包括事件监听和相应的回调函数。当特定类型的事件发生时，对应的回调函数被添加到事件队列中，等待执行。例如，你可以通过
<span class='fontRed'>addEventListener</span>来将事件监听器注册到事件表上：

```js
document.addEventListener('click', function() {
  console.log('Hello world!');
});
```
微任务与 <span class='fontRed'>Event Queue</span>密切相关。当执行栈中的代码执行完毕后，JavaScript引擎会不断地检查事件队列。
如果队列不为空，就将队列中的事件一个个取出，并执行相应的回调函数。

![任务执行](/public/jsBasic/任务执行.jpg)

### 示例解析

```js
console.log(1);

setTimeout(() => {
    console.log(2);
}, 0);

console.log(3);

new Promise((resolve) => {
    console.log(4);
    resolve();
    console.log(5);
}).then(() => {
    console.log(6);
});

console.log(7);


```
执行顺序解析：1 => 3 => 4 => 5 => 7 => 6 => 2

1) 创建Promise实例时同步，所以1、3、4、5、7时同步执行的。
2) <span class='fontRed'>then</span>方法时微任务，放入微任务队列中，在当前脚本执行完毕后立刻执行。
3) 同步任务执行完毕后，执行微任务队列中微任务。
4) 最后，<span class='fontRed'>setTimeout</span>放入宏任务队列，按照先进先出的原则执行。

主要：出现 <span class='fontRed'>async</span>、<span class='fontRed'>await</span>,等价与 <span class='fontRed'>Promise</span>、 <span class='fontRed'>then</span>。  