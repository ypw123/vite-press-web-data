## async、await

### async/await用法
<script setup>
import  './index.ts'
</script>
#### 有什么用

<span class='fontRed'>async/await</span>的用处就是：**用同步方式、执行异步**，举个例子
比如我现在有个需求：先请求完 <span class='fontRed'>接口1</span>，在去请求 <span class='fontRed'>接口2</span>，我们通常会这样做

```js
function request(num) { // 模拟接口请求
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(num * 2)
    }, 1000)
  })
}

request(1).then(res1 => {
  console.log(res1) // 1秒后 输出 2

  request(2).then(res2 => {
    console.log(res2) // 2秒后 输出 4
  })
})

```

或者我现在又有一个需求：先请求完 <span class='fontRed'>接口1</span>，在拿 <span class='fontRed'>接口1</span>返回的数据，当做 <span class='fontRed'>接口2</span>
的请求参数，那我们可以这样做

```js
request(5).then(res1 => {
  console.log(res1) // 1秒后 输出 10

  request(res1).then(res2 => {
    console.log(res2) // 2秒后 输出 20
  })
})

```

其实这么做没问题，但如果嵌套的多了，不免有点不雅观，这个时候就就可以用 <span class='fontRed'>async/await</span>来解决
```js
async function fn () {
  const res1 = await request(5)
  const res2 = await request(res1)
  console.log(res2) // 2秒后输出 20
}
fn()

```

#### 是怎么用

还是用刚才的例子

需求一：

```js
async function fn () {
  await request(1)
  await request(2)
  // 2秒后执行完
}
fn()

```

需求二：

```js

async function fn () {
  const res1 = await request(5)
  const res2 = await request(res1)
  console.log(res2) // 2秒后输出 20
}
fn()

```

在 <span class='fontRed'>async</span>函数中， <span class='fontRed'>await</span>规定了异步操作只能一个一个排队执行，从而达到用 **同步方式，执行异步操作**的效果
，这里注意： ** await只能在async函数中使用**

刚刚上面的例子 <span class='fontRed'>await</span>后面都是跟着 <span class='fontRed'>Promise</span> ，那如果不接 <span class='fontRed'>Promise</span>会怎么样？

```js

function request(num) { // 去掉Promise
  setTimeout(() => {
    console.log(num * 2)
  }, 1000)
}

async function fn() {
  await request(1) // 2
  await request(2) // 4
  // 1秒后执行完  同时输出
}
fn()


```

可以看出，如果 <span class='fontRed'>await</span>后面接的不是 <span class='fontRed'>Promise</span>的话，有可能其实达不到排队的效果

<span class='fontRed'>async</span>是一个位于function之间的前缀，只有 <span class='fontRed'>async</span>函数中，才能使用 <span class='fontRed'>await</span>，
那 <span class='fontRed'>async</span>执行完是返回一个什么？

```js

async function fn () {}
console.log(fn) // [AsyncFunction: fn]
console.log(fn()) // Promise {<fulfilled>: undefined}

```

可以看出，<span class='fontRed'>async</span>执行完会自动返回一个状态为 <span class='fontRed'>fulfilled</span>的 <span class='fontRed'>Promise</span>,也就是成功
状态，但是值却是 <span class='fontRed'>undefined</span>，那要怎么才能使得值不是 <span class='fontRed'>undefined</span>呢？加个 <span class='fontRed'>return</span>返回值

```js
async function fn (num) {
  return num
}
console.log(fn) // [AsyncFunction: fn]
console.log(fn(10)) // Promise {<fulfilled>: 10}
fn(10).then(res => console.log(res)) // 10

```

#### 总结

<span class='fontRed'>async/await</span>的知识点
 - await只能在async函数中使用。
 - async函数返回的使Promise对象。有无值看有没有return 返回值
 - await后面最好是接Promise，虽然接其他值也能达到排队效果
 - async/await作用是用同步方式，执行异步操作

### 什么是语法糖？

前面说了， <span class='fontRed'>async/await</span> 是一种 <span class='fontRed'>语法糖</span>，<span class='fontRed'>语法糖</span>就是一个东西，这个东西
就算你不用他，你用其他方式也可以达到这个东西同样的效果，但是没有这个东西用的这么方便。

- 举个生活中的例子: 你可以走路到北京，但你坐飞机能更快到达北京。
- 举个代码中的例子： ES6的 <span class='fontRed'>class</span>也是语法糖，因为其实用普通的 <span class='fontRed'>function</span>也能实现同样的效果

<span class='fontRed'>async/await</span>是一种 <span class='fontRed'>语法糖</span>，那就说明用其它方式也可以他的效果，怎么去实现 <span class='fontRed'>async/await</span>, 用到的ES6里的 <span class='fontRed'>迭代函数-generator 函数</span>

### generator函数

#### 基本用法

<span class='fontRed'>generator函数</span>在写法上的区别，多了一个星号 <span class='fontRed'>*</span>，并且只有在 <span class='fontRed'>generator函数</span>中
才能使用 <span class='fontRed'></span>，什么是 <span class='fontRed'>yield</span>呢，他相当于 <span class='fontRed'>generator函数</span>执行的 <span class='fontRed'>中途暂停点</span>，比如下方有3个暂停点。而怎么才能暂停后继续走呢？那得使用到 <span class='fontRed'>next方法</span>， <span class='fontRed'>next方法</span>执行后会返回一个对象，对象中有 <span class='fontRed'>value和 done</span>两个属性
 
 - value：暂停点后面接的值，也就是yield后接的值
 - done：是否generator函数已走完，没有走完为false，走完为true

```js

function* gen() {
  yield 1
  yield 2
  yield 3
}
const g = gen()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: 2, done: false }
console.log(g.next()) // { value: 3, done: false }
console.log(g.next()) // { value: undefined, done: true }

```
可以看到最后一个是 <span class='fontRed'>undefined</span>,这取决于你 <span class='fontRed'>generator函数</span>是否有返回值

#### yield后面接函数

yield后面接函数话，到了对应暂停点 <span class='fontRed'>yield</span>，会马上执行此函数，并且该函数的执行返回值，会被当作此暂停点对象的 <span class='fontRed'>value</span>

```js

function fn(num) {
  console.log(num)
  return num
}
function* gen() {
  yield fn(1)
  yield fn(2)
  return 3
}
const g = gen()
console.log(g.next()) 
// 1
// { value: 1, done: false }
console.log(g.next())
// 2
//  { value: 2, done: false }
console.log(g.next()) 
// { value: 3, done: true }

```

#### yield后面Promise

前面说了，函数执行放回值会当做暂停点对象的 <span class='fontRed'>value</span>值，那么下面例子就可以理解，前两个的 <span class='fontRed'>value</span>都是 <span class='fontRed'>pedding</span>状态的 <span class='fontRed'>Promise</span>对象

```js

function fn(num) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(num)
    }, 1000)
  })
}
function* gen() {
  yield fn(1)
  yield fn(2)
  return 3
}
const g = gen()
console.log(g.next()) // { value: Promise { <pending> }, done: false }
console.log(g.next()) // { value: Promise { <pending> }, done: false }
console.log(g.next()) // { value: 3, done: true }


```

其实我们想要的结果是，两个Promise的结果 <span class='fontRed'>1和2</span>，那怎么做，使用 <span class='fontRed'>Promise</span>的 <span class='fontRed'>then</span>方法：

```js

const g = gen()
const next1 = g.next()
next1.value.then(res1 => {
  console.log(next1) // 1秒后输出 { value: Promise { 1 }, done: false }
  console.log(res1) // 1秒后输出 1

  const next2 = g.next()
  next2.value.then(res2 => {
    console.log(next2) // 2秒后输出 { value: Promise { 2 }, done: false }
    console.log(res2) // 2秒后输出 2
    console.log(g.next()) // 2秒后输出 { value: 3, done: true }
  })
})

```

#### next函数参数

<span class='fontRed'>generator</span>函数可以用 <span class='fontRed'>next方法</span>来传参，并且可以通过 <span class='fontRed'>yield</span>来收这个参数，注意两点：
 - 第一次next传参是没用的，只有第二次开始next传参才有用
 - next传值时，要记住顺序是，先右边yield，后左边接收参数

```js

function* gen() {
  const num1 = yield 1
  console.log(num1)
  const num2 = yield 2
  console.log(num2)
  return 3
}
const g = gen()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next(11111))
// 11111
//  { value: 2, done: false }
console.log(g.next(22222)) 
// 22222
// { value: 3, done: true }

```

#### Promise+next传参

前面讲了

 - yield后面接Promise
 - next 函数传参

两个组合一下：

```js
function fn(nums) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(nums * 2)
    }, 1000)
  })
}
function* gen() {
  const num1 = yield fn(1)
  const num2 = yield fn(num1)
  const num3 = yield fn(num2)
  return num3
}
const g = gen()
const next1 = g.next()
next1.value.then(res1 => {
  console.log(next1) // 1秒后同时输出 { value: Promise { 2 }, done: false }
  console.log(res1) // 1秒后同时输出 2

  const next2 = g.next(res1) // 传入上次的res1
  next2.value.then(res2 => {
    console.log(next2) // 2秒后同时输出 { value: Promise { 4 }, done: false }
    console.log(res2) // 2秒后同时输出 4

    const next3 = g.next(res2) // 传入上次的res2
    next3.value.then(res3 => {
      console.log(next3) // 3秒后同时输出 { value: Promise { 8 }, done: false }
      console.log(res3) // 3秒后同时输出 8

       // 传入上次的res3
      console.log(g.next(res3)) // 3秒后同时输出 { value: 8, done: true }
    })
  })
})

```

### 实现async/await
```js
function generatorToAsync(generatorFn) {
  return function() {
    const gen = generatorFn.apply(this, arguments) // gen有可能传参

    // 返回一个Promise
    return new Promise((resolve, reject) => {

      function go(key, arg) {
        let res
        try {
          res = gen[key](arg) // 这里有可能会执行返回reject状态的Promise
        } catch (error) {
          return reject(error) // 报错的话会走catch，直接reject
        }

        // 解构获得value和done
        const { value, done } = res
        if (done) {
          // 如果done为true，说明走完了，进行resolve(value)
          return resolve(value)
        } else {
          // 如果done为false，说明没走完，还得继续走

          // value有可能是：常量，Promise，Promise有可能是成功或者失败
          return Promise.resolve(value).then(val => go('next', val), err => go('throw', err))
        }
      }

      go("next") // 第一次执行
    })
  }
}

const asyncFn = generatorToAsync(gen)

asyncFn().then(res => console.log(res))

```
示例

<span class='fontRed'>async/await</span>版本

```js

async function asyncFn() {
  const num1 = await fn(1)
  console.log(num1) // 2
  const num2 = await fn(num1)
  console.log(num2) // 4
  const num3 = await fn(num2)
  console.log(num3) // 8
  return num3
}
const asyncRes = asyncFn()
console.log(asyncRes) // Promise
asyncRes.then(res => console.log(res)) // 8


```

使用 <span class='fontRed'>generatorToAsync函数</span>的版本

### async、await 事件轮询执行时机

async隐式返回Promise，会产生一个微任务
await后面的代码是微任务时执行

```js

console.log("script start");
async function async1() {
  await async2(); // await 隐式返回promise
  console.log("async1 end"); // 这里的执行时机：在执行微任务时执行
}
async function async2() {
  console.log("async2 end"); // 这里是同步代码
}
async1();
setTimeout(function() {
  console.log("setTimeout");
}, 0);
new Promise(resolve => {
  console.log("Promise"); // 这里是同步代码
  resolve();
})
  .then(function() {
    console.log("promise1");
  })
  .then(function() {
    console.log("promise2");
  }); 
console.log("script end");

// 打印结果:  script start => async2 end => Promise => script end => async1 end => promise1 => promise2 => setTimeout

```