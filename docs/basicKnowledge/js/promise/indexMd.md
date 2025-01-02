## Promise

### 什么是Promise?

Promise 是异步编程的一种解决方案：从语法上讲，promise是一个对象，从它可以获取异步操作的消息；从本意上讲，承诺它过一段时间会给你一个结果。promise有三种状态：**pending(进行中)**、**fulfilled(已成功)**、**rejected(已失败)**;状态一旦改变，就不会在变。创造promise实例后，它会立即执行。

```js
// 当参数a大于10且参数fn2是一个方法时 执行fn2
function fn1(a, fn2) {
    if (a > 10 && typeof fn2 == 'function') {
        fn2()
    }
}
fn1(11, function() {
    console.log('this is a callback')
})

```
一般来说我们碰到的回调嵌套都不会很多，一般就一到两级，但某些情况下，回调嵌套很多时，代码就会非常繁琐，会给我们的编程带来很多的麻烦，这种情况俗称-回调地狱。
这是时候promise就应运而生了。

promise一般用来解决以下问题：
 - 回调地狱
 - 异步并发
 - 异步依赖
 - 异步错误处理
  
### Promise的用法

Promise是一个构造函数，自己身上有all,reject、resolve这个几个眼熟的方法，原型上有then、catch等方法

```js
let p1 = new Promise((resolve, reject) => {
    reject()
    // resolve()
})
    console.log(p1)
p1.then(() => {
    console.log('成功的回调')
}, () => {
    console.log("失败的回调")
})

```
#### resolve回调函数参数的处理
  - 情况一：如果 <span class='fontRed'>resolve</span>传入一个普通的值或者对象，那么这个值会作为 <span class='fontRed'>then</span>回调的参数
  - 情况二：如果 <span class='fontRed'>resolve</span>种传入的是另一个 <span class='fontRed'>Promise</span>，那么这个新 <span class='fontRed'>Promise</span>会决定原 <span class='fontRed'>Promise</span>的状态，并且新 <span class='fontRed'>Promise</span> 和 <span class='fontRed'>resolve</span>或 <span class='fontRed'>reject</span>的参数也会传给原来的 <span class='fontRed'>Promise</span> 
  
```js

const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('我是新的promise')
    }, 1000)
})
const p1 = new Promise((resolve, reject) => {
    resolve(p)
})
p1.then((res) => {
    console.log(res) 
})

```
在这段代码中， P是p1 <span class='fontRed'>resolve</span> 中传入的 <span class='fontRed'>Promise</span>,因此，p1的状态是由p决定的，由于p执行了
<span class='fontRed'>resolve</span>回调函数，因此状态是 <span class='fontRed'>fulfilled</span>,所以p1的状态也是<span class='fontRed'>fulfilled</span>，运行之后控制台在1s后打印出“我是新的promise”

```js

    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('我是新的promise并且拒绝')
      }, 1000)
    })
    const p1 = new Promise((resolve, reject) => {
      resolve(p)
    })
    p1.then((res) => {
      console.log(”res：“+res)
    }).catch((err) => {
      console.log(“err：”+err)
    })


```
修改p回调的函数reject之后，控制台打印“err：我是新的promise并且拒绝”，进一步验证以上结论。

  - 情况三：resolve传入的是一个对象，并且该对象有实现then，那么会执行这个then方法，并且根据then方法结果来决定Promise的状态

```js

    const p = {
    name: 'javascript',
    then: function (resolve) {
        resolve("情况三")
    }
    }
        const p1 = new Promise((resolve, reject) => {
        resolve(p)
    })
    p1.then((res) => {
        console.log("res：" + res)
    }).catch((err) => {
        console.log("err：" + err)
    })

```
以上代码在控制台输出"res:情况三"

#### Promise的.then和.catch方法的调度

我们前面对then和cath的调用都只有一次，假如我们调用了多次呢

```js
const p1 = new Promise((resolve, reject) => {
    resolve("成功的回调")
})
p1.then((res) => {
    console.log("res1：" + res)
})
p1.then((res) => {
    console.log("res2：" + res)
})
p1.then((res) => {
    console.log("res3：" + res)
})

```
打开控制台会发现每个then里面的回调都被执行了，说明then是可以被多次调用，每次调用我们可以传入对应的 <span class='fontRed'>fulfilled</span>回调，
当 <span class='fontRed'>Promise</span>的状态变成 <span class='fontRed'>fulfilled</span>的时候，这些回调函数都会被执行。

那么 <span class='fontRed'>catch</span>是否也会出现相同的结果呢，当我们在执行下面这段代码的时候，控制台会打印所有 <span class='fontRed'>catch</span>回调里面的内容，因此 <span class='fontRed'>catch</span>也可以多次被调用，每次调用我们都可以传入对应的 <span class='fontRed'>reject</span>
回调；当 <span class='fontRed'>Promise</span>的状态变成 <span class='fontRed'>reject</span>的时候，这些回调函数都会被执行。

```js

    const promise = new Promise((resolve, reject) => {
      reject("failure")
    })
    promise.then(res => {
      console.log("成功的回调:", res)
    }).catch(err => {
      console.log("失败的回调1:", err)
    })
    promise.catch(err => {
      console.log("失败的回调2:", err)
    })
    promise.catch(err => {
      console.log("失败的回调3:", err)
    })
    promise.catch(err => {
      console.log("失败的回调4:", err)
    })
    promise.catch(err => {
      console.log("失败的回调5:", err)
    })

```
#### then和catch方法的返回值

1) then
   
<span class='fontRed'>then</span>本事是由返回值的，它返回一个 <span class='fontRed'>Promise</span>，所以我们可以对其链式调用

```js
    const p1 = new Promise((resolve, reject) => {
      resolve("成功的回调")
    })
    p1.then((res) => {
      console.log("res：" + res)
      return res + 'abc'
    }).then((res1) => {
      console.log("res1：" + res1)
    })

```

控制台会输出 <span class='fontRed'>res：成功的回调 res2：成功的回调abc</span>

那么 <span class='fontRed'>.then</span>方法返回这个 <span class='fontRed'>Promise</span>的状态是由什么决定的呢，事实，这个新 <span class='fontRed'>Promise</span>的决议是等到 <span class='fontRed'>then</span>方法传入的回调函数有返回值时，才会进行决议。

当 <span class='fontRed'>then</span>方法中的回调函数执行的时候，返回的 <span class='fontRed'>promise</span>处于 <span class='fontRed'>pending</span>状态，当返回一个结果时，会处于 <span class='fontRed'>fulfilled</span>状态，并且将结果作为 <span class='fontRed'>resolve</span>的参数，因此链式调用的 <span class='fontRed'>then</span>方法里的回调函数的参数是上一个 <span class='fontRed'>then</span>方法的返回值。

then方法返回值的几种情况：

 - 情况一：返回值一个普通的值 <span class='fontRed'>a</span>。将这个值 <span class='fontRed'>a</span>作为 <span class='fontRed'>resolve</span>的参数，因此在后面的.then方法里的回调函数获取到的参数就是 <span class='fontRed'>a</span>

```js
const p1 = new Promise((resolve, reject) => {
    resolve("成功的回调")
})
p1.then((res) => {
    return 'aaaaa'
}).then((res1) => {
    console.log("res1：" + res1) //res1：aaaaa
    return 'bbbbb'
}).then((res2) => {
    console.log("res2：" + res2) //res2：bbbbb
})

```
 - 情况二：返回一个 <span class='fontRed'>Promise</span>。如果返回一个 <span class='fontRed'>PromiseA</span>,那么 <span class='fontRed'>then</span>返回的 <span class='fontRed'>PromiseB</span>的状态会由 <span class='fontRed'>PromiseA</span>的状态决定，并且将
 <span class='fontRed'>PromiseA</span>的状态的回调函数的参数作为 <span class='fontRed'>PromiseB</span>的状态的回调函数的参数

```js
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('ccccc')
    }, 1000)
  })
  const p1 = new Promise((resolve, reject) => {
    resolve("成功的回调")
  })
  p1.then((res) => {
    return p
  }).then((res1) => {
    console.log("res1：" + res1)
    return 'ddddd'
  }).then((res2) => {
    console.log("res2：" + res2)
  })
```

上面这段代码1s后输出  <span class='fontRed'>res1:ccccc,res: ddddd</span>

 - 情况三：返回一个 <span class='fontRed'>thenable</span>对象，如果then方法里面的回调函数返回了一个带有then方法的对象，那么then方法返回的Promise的状态
是由then方法里的结果决定的

```js
  const promise = new Promise((resolve, reject) => {
      resolve("aaaaaaa")
      // reject()
    })
    promise.then(res => {
      return {
        then: function (resolve, reject) {
          resolve("thenable")
        }
      }
    }).then(res => {
      console.log("thenable test:", res) // thenable test: thenable
    })
```

2) catch

catch也会返回一个Promise，因此也是支持链式调用的，且catch后面可以调用then或者catch方法，我们现在看下代码

```js

  const p1 = new Promise((resolve, reject) => {
    reject("失败的回调")
  })
  p1.catch((res) => {
    console.log('catch里面的回调函数')
  }).then((res1) => {
    console.log("res1：" + res1)
  }).catch((res2) => {
    console.log("res2：" + res2)
  })

```
在 <span class='fontRed'>p1.catch</span>执行完成后是会执行 <span class='fontRed'>.then</span>后面的回调而不是 <span class='fontRed'>.catch</span>
后面的回调，这是因为 <span class='fontRed'>catch</span>传入的回调字执行完成后，默认依然会使 <span class='fontRed'>fulfilled</span>的;

如果我们想让 <span class='fontRed'>.catch</span>后面继续执行 <span class='fontRed'>catch</span>该怎么做呢？答案是我们需要抛出一个异常，如下代码：

```js

  const p1 = new Promise((resolve, reject) => {
    reject("失败的回调")
  })
  p1.catch((res) => {
    console.log('catch里面的回调函数')
    throw new Error('error message')
  }).then((res1) => {
    console.log("res1：" + res1)
  }).catch((res2) => {
    console.log("res2：" + res2)
  })

```
控制台输出：<span class='fontRed'>'catch里面的回调函数'，res2：Error：error message</span>

综上：链式调用中.catch方法的执行时机，是由上一个promise是否抛出异常决定的，如果上一个Promise照常返回一个值，执行的是链式调用中的then方法  

#### Promise的finally

finally是ES9中新增的一个特性，无论是Promise变成fulfilled状态还是rejected状态，都会执行finally里面的回调，而且finally不接收任何参数：

```js
 let p1 = new Promise((resolve, reject) => {
      resolve('abc')
  })
  p1.then((res) => {
      console.log(res)
  }).catch((err) => {
      console.log(err)
  }).finally(() => {
      console.log('finally')
  })

```
上面的代码执行结果：<span class='fontRed'>abc finally</span>

### promise的类方法

前面我们讲过的方法都是属于 <span class='fontRed'>Promise</span>的实例方法，存放在 <span class='fontRed'>Promise</span>的 <span class='fontRed'>prototype</span>
上，实际上, <span class='fontRed'>Promise</span>也存在类方法，且在实际开发中用到的频率也很高，如下：

#### Promise.all

 <span class='fontRed'>Promise.all</span>的作用是将多个 <span class='fontRed'>Promise</span>包裹在一起形成一个新的 <span class='fontRed'>Promise</span>
 并且这个新的 <span class='fontRed'>Promise</span>的状态是由包裹的 <span class='fontRed'>Promise</span>的状态共同决定的：

 - 当所有的 <span class='fontRed'>Promise</span>的状态变成 <span class='fontRed'>fulfilled</span>,新的 <span class='fontRed'>Promise</span>
 的状态变为 <span class='fontRed'>fulfilled</span>,并将所有 <span class='fontRed'>promise</span>的返回值组成一个数组
 - 当有一个 <span class='fontRed'>Promise</span>的状态变成 <span class='fontRed'>reject</span>，新的 <span class='fontRed'>Promise</span>
 的状态变成 <span class='fontRed'>reject</span>，一个 <span class='fontRed'>reject</span>的 <span class='fontRed'>Promise</span>的返回值作为该参数

 ```js
    let p1 = new Promise((resolve, reject) => {
        resolve('Promise')
    })
    let p2 = p1.then((res) => {
        return res + 'aaa'
    })
    let p3 = p2.then((res) => {
        return res + 'bbb'
    })
    Promise.all([p1, p2, p3]).then(res => {
        console.log(res) // ["Promise", "Promiseaaa", "Promiseaaabbb"]
    })

 ```

 ```js
     let p1 = new Promise((resolve, reject) => {
        resolve('Promise')
    })
    let p2 = new Promise((resolve, reject) => {
        reject('reject状态的Promise')
    })
    Promise.all([p1, p2]).then((res) => {
        console.log('res:' + res)
    }).catch(err => {
        console.log('err:' + err)  //err:reject状态的Promise
    })

 ```

#### promise.resolve

 <span class='fontRed'>Promise.resolve(res)</span>方法返回一个以给定值解析后的 <span class='fontRed'>Promise</span>对象，有时候我们已经有一个
 现成的值希望将其转换成 <span class='fontRed'>Promise</span>可以使用该类方法

```js
  Promise.resolve('这是一个Promise')
  //等价于
  new Promise(resolve=>resolve('这是一个Promise'))
```
其中 <span class='fontRed'>resolve</span>方法中的参数类型，同第 <span class='fontRed'>回调函数参数的处理</span>一致。如果这个值是一个
 <span class='fontRed'>Promise</span>,那么将返回这个 <span class='fontRed'>Promise</span>; 如果这个值是 <span class='fontRed'>thenable</span>,
 返回的 <span class='fontRed'>Promise</span> 会跟随这个 <span class='fontRed'> thenable</span>的对象，采用它的最终状态；否则返回的 
 <span class='fontRed'>Promise</span>将为此值。

#### Promise.reject

 <span class='fontRed'>reject</span>方法类似于 <span class='fontRed'>resolve</span>方法，只会将 <span class='fontRed'>Promise</span>对象状态
 设置为 <span class='fontRed'>reject</span>状态

```js
  Promise.reject('这是一个reject状态的Promise')
  //等价于
  new Promise((resolve, reject) => reject('这是一个reject状态的Promise'))
```
<span class='fontRed'>Promise.reject</span>传入的参数无论是什么形态，都会直接作为 <span class='fontRed'>reject</span>状态的参数传递到 <span class='fontRed'>catch</span>。

#### Promise.race

如果有一个 <span class='fontRed'>Promise</span>有了结果，我们就希望决定最终新 <span class='fontRed'>Promise</span>的状态，那么可以使用
<span class='fontRed'>race</span>方法，如下代码输出结果为 <span class='fontRed'>'err:Promise1'</span>

```js

  let p1 = new Promise((resolve, reject) => {
      reject('Promise1')
  })
  let p2 = new Promise((resolve, reject) => {
      reject('Promise2')
  })
  Promise.race([p1, p2]).then((res) => {
      console.log('res:' + res)
  }).catch(err => {
      console.log('err:' + err) //err:Promise1
  })

```

#### Promise.any

<span class='fontRed'>any</span>方法es12中新增的方法，和 <span class='fontRed'>race</span>方法是类似的，不同的是 <span class='fontRed'>any</span>
方法会等到一个 <span class='fontRed'>fulfilled</span>状态，才会决定新 <span class='fontRed'>Promise</span>状态，如果所有的 <span class='fontRed'>Promise</span>
都是 <span class='fontRed'>reject</span>的，那么也会等到所有的 <span class='fontRed'>Promise</span>都会变成 <span class='fontRed'>rejected</span>状态。

```js 
  let p1 = new Promise((resolve, reject) => {
      reject('Promise1')
  })
  let p2 = new Promise((resolve, reject) => {
      reject('Promise2')
  })
  Promise.any([p1, p2]).then((res) => {
      console.log('res:' + res)
  }).catch(err => {
      console.log(err)  //AggregateError: All promises were rejected
  })

```

#### Promise.allSettled

<span class='fontRed'>all</span>方法有个缺陷：当有其中一个 <span class='fontRed'>Promise</span>变成 <span class='fontRed'>reject</span>状态时
新 <span class='fontRed'>Promise</span>就会立即变成对应的 <span class='fontRed'>reject</span>状态。那么对于 <span class='fontRed'>resolved</span>的，
以及依然处于 <span class='fontRed'>pending</span>状态的 <span class='fontRed'>Promise</span>,我们是获取不到对应的结果

在ES11中，添加了新的API <span class='fontRed'>Promise.allSettled</span>,该方法会在所有的 <span class='fontRed'>Promise</span>都有结果。
并且这个 <span class='fontRed'>Promise</span>的结果一定是 <span class='fontRed'>fulfilled</span>的。

```js
    let p1 = new Promise((resolve, reject) => {
        reject('Promise1')
    })
    let p2 = new Promise((resolve, reject) => {
        reject('Promise2')
    })
    let p3 = new Promise((resolve, reject) => {
        resolve('Promise3')
    })
    Promise.allSettled([p1, p2, p3]).then((res) => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
```

可以看出 <span class='fontRed'>allSettled</span>的结果是一个数组，数组中存放着每一个 <span class='fontRed'>Promise</span>的结果，并且是对应
一个对象的；这个对象中包含 <span class='fontRed'>status</span>状态，以及对应的 <span class='fontRed'>value</span>值

## 手写Promise
<script setup>
import  './index.ts'
</script>
### 实现基础promise - 第一版
#### promise 构造函数的实现

1) 首先定义 <span class='fontRed'>Promise</span>的三种状态

```js
const PENDING ="PENDING"
const FULFILLED = "FULFILLED"
const REJECTED = "REJECTED";
```
2) 定义 <span class='fontRed'>Promise</span>构造函数，添加必备属性

<span class='fontRed'>Promise/A+</span>规范中指出：

- <span class='fontRed'>value</span>是任意的 <span class='fontRed'>JavaScript</span>合法值(包括 <span class='fontRed'>undefined</span>)
- <span class='fontRed'>reason</span>是用来表示 <span class='fontRed'>Promise</span> 为什么被拒绝的原因
  
我们使用 <span class='fontRed'>ES6 class  </span> 定义 <span class='fontRed'>Promise</span>类，<span class='fontRed'>value/reason</span>
分别赋值为 <span class='fontRed'>undefined</span>,状态 <span class='fontRed'>status</span>初始为 <span class='fontRed'>PENDING</span>

```js
class Promise{
  constructor(){
     this.value = undefined
     this.reason = undefined
     this.status = PENDING
  }
}
 
```
3) 定义 <span class='fontRed'>promise</span>时需要传入函数 <span class='fontRed'> executor</span>

-  <span class='fontRed'>executor</span> 有两个参数，分别为 <span class='fontRed'>resolve，reject</span>，且两个参数都是函数
-  <span class='fontRed'>executor</span>会立即执行

```js

class Promise{
  constructor(executor){
     this.value = undefined
     this.reason = undefined
     this.status = PENDING
     const resolve = ()=>{};
     const reject = ()=>{};
     executor(resolve,reject)
  }
}
 
```
4) 实现 <span class='fontRed'>resolve</span>和 <span class='fontRed'>reject</span>的功能

当 <span class='fontRed'>Promise</span>状态为 <span class='fontRed'>Pending</span>时：<span class='fontRed'>resolve</span> 函数可以将 <span class='fontRed'>promise</span>由 <span class='fontRed'>Pending</span>变为 <span class='fontRed'>fulfilled</span>,并且更新 <span class='fontRed'>promise</span> 的 <span class='fontRed'>value</span>值。<span class='fontRed'>reject</span>函数可以将 <span class='fontRed'>promise</span>由 <span class='fontRed'>Pending</span>变成 <span class='fontRed'>Rejected</span>,并更新Promise的 <span class='fontRed'>reason</span>值

注意：<span class='fontRed'>promise</span> 状态只能由 <span class='fontRed'>Pending->fulfilled</span> 和<span class='fontRed'>Pending->Rejected</span>

因此在定义 <span class='fontRed'>resolve</span> he <span class='fontRed'>reject</span> 函数时，内部需要先判断 <span class='fontRed'>promise</span>状态，如果状态为 <span class='fontRed'>pending</span>，才可以更新 <span class='fontRed'>value</span>值
和 <span class='fontRed'>promise</span>状态。

```js

class Promise{
  constructor(executor){
     this.value = undefined
     this.reason = undefined
     this.status = "PENDING"
     const resolve = (value)=>{
        if(this.status === "PENDING"){
           this.value = value
           this.status = "fulfilled"
        }
     };
     const reject = (value)=>{
        if(this.status === "PENDING"){
           this.value = value
           this.status = "REJECTED"
        }
     };
     executor(resolve,reject)
  }
}
 
```
5) <span class='fontRed'>Promise A+</span> 规范规定，Promise执行抛出异常时，执行失败函数。因此我们需要捕获 <span class='fontRed'>executor</span>的执行，如果存在异常，执行 <span class='fontRed'>reject</span>函数。

```js
class Promise{
  constructor(executor){
     this.value = undefined
     this.reason = undefined
     this.status = "PENDING"
     const resolve = (value)=>{
        if(this.status === "PENDING"){
           this.value = value
           this.status = "fulfilled"
        }
     };
     const reject = (value)=>{
        if(this.status === "PENDING"){
           this.value = value
           this.status = "REJECTED"
        }
     };
     try{
       executor(resolve,reject)
     }catch(e){
       reject(e)
     }
  }
}
```

我们实现了 <span class='fontRed'>Promise</span>的主体部分，下面就来实现 <span class='fontRed'>Promise</span>的另一个重要核心 <span class='fontRed'>then</span>方法。

#### 实现then方法的基本功能

<span class='fontRed'>then</span>方法的注意事项比较多，咱们一起阅读规范顺带举例说明下

1) <span class='fontRed'>promise.then</span>接受两个参数

```js

  class Promise{
    then(onFulfilled,onRejected){}
  }

```
2) <span class='fontRed'>onFulfilled</span> 和 <span class='fontRed'>onRejected</span>是可选参数，两者如果不是函数，则会忽略掉。
3) 如果 <span class='fontRed'>onFulfilled</span>是一个函数，当 <span class='fontRed'>promise</span>状态为 <span class='fontRed'>Fulfilled</span>时，
调用 <span class='fontRed'>onFulfilled</span>函数，<span class='fontRed'>onFulfilled</span>类似，当 <span class='fontRed'>promise</span>状态为 <span class='fontRed'>Rejected</span>时调用。

我们继续看几个例子：

```js

// 执行 resolve
const p1 = new Promise((resolve, reject) => {
  resolve(1);
});
p1.then(
  (v) => {
    console.log("onFulfilled: ", v);
  },
  (r) => {
    console.log("onRejected: ", r);
  }
);

// 执行 reject
const p2 = new Promise((resolve, reject) => {
  reject(2);
});
p2.then(
  (v) => {
    console.log("onFulfilled: ", v);
  },
  (r) => {
    console.log("onRejected: ", r);
  }
);

// 抛出异常
const p3 = new Promise((resolve, reject) => {
  throw new Error("promise执行出现错误");
});
p3.then(
  (v) => {
    console.log("onFulfilled: ", v);
  },
  (r) => {
    console.log("onRejected: ", r);
  }
);

// onFulfilled:1
// onRejected:2
// onRejected:Error: promise执行出现错误

```
通过输出结果，我们可以发现 <span class='fontRed'>then</span>的调用逻辑
  - 执行 <span class='fontRed'>resolve</span>后，promise的状态改变为 <span class='fontRed'>Fulfilled</span>, <span class='fontRed'>onFulfilled</span>
    函数调用，参数值为 <span class='fontRed'>value</span>
  - 执行 <span class='fontRed'>reject</span>或抛出错误，<span class='fontRed'>promise</span>状态改变为 <span class='fontRed'>Rejected</span>
   <span class='fontRed'>onRejected</span>函数调用，参数值为 <span class='fontRed'>reason</span>

接下来，我们来分析以下 <span class='fontRed'>then</span>的实现思路。

 <span class='fontRed'>then</span>函数判断 <span class='fontRed'>promise</span>当前的状态，如果为 <span class='fontRed'>Fulfilled</span>状态，执行
 <span class='fontRed'>onFulfilled</span>函数； <span class='fontRed'>Rejected</span>状态，执行 <span class='fontRed'>onRejected</span>函数。实现
 思路简单，那下面就来实现下。

 
```js

  class Promise{
    then(onFulfilled,onRejected){
      if(this.status === "FULFILLED"){
        onFulfilled(this.value)
      }else if(this.status === "REJECTED"){
        onRejected(this.reason)
      }
    }
  }

```

#### promise 注册多个 then 方法

我们继续往下读规范：

如果一个 <span class='fontRed'>promise</span>调用多次 <span class='fontRed'>then</span>；当 <span class='fontRed'>promise</span>状态为
<span class='fontRed'>Fulfilled</span>时，所有的 <span class='fontRed'>onFulfilled</span>函数按照注册顺序调用。当 <span class='fontRed'>Promise</span>
状态为 <span class='fontRed'>Rejected</span>时，所有的 <span class='fontRed'>onRejected</span>函数按照注册顺序调用。

```js

const p = new Promise((resolve, reject) => {
  resolve("success");
});

p.then((v) => {
  console.log(v);
});
p.then((v) => {
  console.log(`${v}--111`);
});

// success
// success--111

```

通过上面的案例，该规范通俗来讲：**同一个 promise 可以注册多个 then 方法，当 promise完成或者失败后，对应的then方法按照注册顺序依次执行。**

我们整合以下 <span class='fontRed'>promise</span>第一版 代码，并对所有代码进行测试。

```js

// promise 三种状态
// 状态只能由 PENDING -> FULFILLED/REJECTED
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class Promise {
  constructor(executor) {
    this.value = undefined;
    this.reason = undefined;
    // 初始状态为 Pending
    this.status = PENDING;
    // this指向问题
    const resolve = (value) => {
      // 判断当前的状态是否为Pending
      // promise状态转变只能从 Pending 开始
      if (this.status === PENDING) {
        // 更新 value 值和 promise 状态
        this.value = value;
        this.status = FULFILLED;
      }
    };
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
      }
    };
    try {
      // 捕获 executor 异常
      executor(resolve, reject);
    } catch (e) {
      // 当发生异常时，调用 reject 函数
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    // 当状态为 Fulfilled 时，调用 onFulfilled函数
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    }
    // 当状态为 Rejected 时，调用 onRejected 函数
    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  }
}


```

### 处理异步功能 - 第二版

文章刚开始我们就讲过， <span class='fontRed'>promise</span>是异步编程的一种解决方案，那么我来测试以下第一版 <span class='fontRed'>Promise</span>
是否可以实现异步。

```js
const p = new Promise((resolve, reject) => {
  // 使用 setTimeout 模拟一下异步
  setTimeout(() => {
    resolve("success");
  });
});

p.then((v) => {
  console.log(v);
});
p.then((v) => {
  console.log(`${v}--111`);
});

```

没有任何输出，可见第一版代码到目前是无法实现异步编程的，我们来分析以下原因。

如果 <span class='fontRed'>Promise</span>内部存在异步调用，当执行到 <span class='fontRed'>then</span>函数时,此时由于 <span class='fontRed'>resolve/reject</span>处于异步回调之中，被阻塞未能调用，因此 <span class='fontRed'>promise</span>的状态仍为 <span class='fontRed'>Pending</span>,第一版 <span class='fontRed'>then</span>回调中的 <span class='fontRed'>onFulfilled</span>和 <span class='fontRed'>onRejected</span>无法执行。

#### 发布订阅模式

为了更好的实现原生 <span class='fontRed'>promise</span>的编写，在这里补充一点知识。

异步编程中有一个经常用的思想，叫做发布订阅模式。发布订阅模式是指基于一个事件通道，希望接收通知的对象 <span class='fontRed'>Subscriber</span>通过自定义事件订阅主题，被激活事件的对象 <span class='fontRed'>Publisher</span>通过发布主题事件的方式通知各个订阅该主题的 <span class='fontRed'>Subscriber</span>对象。

发布订阅模式中有三个角色，发布者 <span class='fontRed'>Pubilsher</span>，事件通道 <span class='fontRed'>Event Channel</span>,订阅者 <span class='fontRed'>Subscriber</span>

我们把 <span class='fontRed'>Promise</span>的功能按照发布订阅模式分解一下：

 - <span class='fontRed'>then</span>回调 <span class='fontRed'>onFulfilled/onRejected</span>函数
 - <span class='fontRed'>resolve/reject</span>函数
 - <span class='fontRed'>resolve/reject</span>函数执行后，<span class='fontRed'>promise</span>状态改变，<span class='fontRed'>回调函数执行</span>
  
只有当 <span class='fontRed'>resolve/reject</span>函数执行后，对应 <span class='fontRed'>onFulfilled/onRejected</span>才会执行，但由于有异步调用，<span class='fontRed'>resolve/reject</span>执行晚于 <span class='fontRed'>then</span>函数，因此 <span class='fontRed'>onFulfilled/onRejected</span>就可以理解为订阅者，订阅 <span class='fontRed'>resolve/reject</span>函数执行，订阅 <span class='fontRed'>resolve/reject</span>函数执行；<span class='fontRed'>resolve/reject</span>是发布者； <span class='fontRed'>Promise</span>提供事件通道作用，存储订阅的
<span class='fontRed'>onFulfilled/onRejected</span>,**由于同一个promise对象可以注册多个then回调，因此 Event channel 存储回调应为数组格式** 

因此我们需要修改 <span class='fontRed'>resolve/reject</span> 函数的实现，才通知订阅则执行。

#### 异步实现

1) 在 <span class='fontRed'>Promise</span> 中定义两个数组 onFulfilledCallbacks 和 onRejectedCallbacks,分别用来存储 <span class='fontRed'>then</span>回调 <span class='fontRed'>onFulfilled</span>和 <span class='fontRed'>onRejected</span> 函数

```js
class Promise {
  // 存储订阅的onFulfilled函数和onRejected函数
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];
}

```
2) <span class='fontRed'>then</span> 方法执行时，若 <span class='fontRed'>Promise</span>处于 <span class='fontRed'>Pending</span>状态，
将 <span class='fontRed'>onFulfilled</span>和 <span class='fontRed'>onRejected</span>函数分别订阅至 <span class='fontRed'>onFulfilledCallbacks</span>和 <span class='fontRed'>onRejectedCallbacks</span>
—— 等待 <span class='fontRed'>resolve/rejected</span>执行（事件发布）

```js
then(onFulfilled, onRejected) {
    if (this.status === PENDING) {
        // 当promise处于pending状态时，回调函数订阅
        this.onFulfilledCallbacks.push(onFulfilled);
        this.onRejectedCallbacks.push(onRejected);
    }
}
```

3) 调用 <span class='fontRed'>resolve/reject</span>时，发布事件，分别执行对应 <span class='fontRed'>onFulfilledCallbacks</span>和
  <span class='fontRed'>onRejectedCallbacks</span> 数组中的函数

```js
// 执行发布
const resolve = (value) => {
  if (this.status === PENDING) {
    this.value = value;
    this.status = FULFILLED;
    // 依次执行onFulfilled函数
    this.onFulfilledCallbacks.forEach((cb) => cb(this.value));
  }
};
const reject = (reason) => {
  if (this.status === PENDING) {
    this.reason = reason;
    this.status = REJECTED;
    // 依次执行onRejected函数
    this.onRejectedCallbacks.forEach((cb) => cb(this.reason));
  }
};

```

我们将上述代码进行汇总，形成第二版代码，并进行案例测试。

```js

// 异步调用
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class Promise {
  constructor(executor) {
    this.value = undefined;
    this.reason = undefined;
    this.status = PENDING;
    // 存储订阅的onFulfilled函数和onRejected函数
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED;
        // 当 resolve 函数调用时，通知订阅者 onFulfilled 执行
        this.onFulfilledCallbacks.forEach((cb) => cb(this.value));
      }
    };
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        // 当 reject 函数调用时，通知订阅者 onRejected 执行
        this.onRejectedCallbacks.forEach((cb) => cb(this.reason));
      }
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    }
    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
    if (this.status === PENDING) {
      // 当promise处于pending状态时，回调函数订阅
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }
  }
}

```

使用刚才的案例进行测试，输出结果为

```js

success
success--111

```
上面的案例有些简单，我们再来测试一个复杂的案例：

```js
console.log(1);
setTimeout(() => {
  console.log(2);
})
const p1 = new Promise((resolve) => {
  console.log(3);
  setTimeout(() => {
    resolve(4);
  })
})
p1.then(v => console.log(v));
console.log(5);

//1 3 5 2 4

```

### 链式调用 - 第三版

异步功能实现完毕，我们继续实现 <span class='fontRed'>then</span>方法的链式调用，首先我们继续去读规范：

1)  <span class='fontRed'>then</span>方法必须返回一个 <span class='fontRed'>promise</span>

```js
 promise2 = promise1.then(onFulfilled, onRejected)
```
<span class='fontRed'>promise2</span>是 <span class='fontRed'>then</span>函数的返回值，同样一个 <span class='fontRed'>Promise</span>对象。

```js

then(onFulfilled, onRejected) {
  // ... 多余代码省略
  cosnt promise2 = new Promise((resolve, reject) => {})
  return promise2;
}

```

2) 如果 <span class='fontRed'>onFulfilled</span> 或 <span class='fontRed'>onRejected</span>返回值为 <span class='fontRed'>x</span>，
则运行 <span class='fontRed'>Promise Resolution Procedure [[Resolve]](promise2, x)</span>(这里暂且将他理解为执行 promise2的 resolve(x)函数)

理解下此条规范：

```js
// 案例1 resolve
console.log(new Promise((resolve) => {
    resolve(1)
}).then((x) => x))
// 案例2 reject
console.log(new Promise((resolve, reject) => {
    reject(1)
}).then(undefined,(r) => r))

```
**返回的结果一样**

我们再来读一遍规范：
  
  - 如果 <span class='fontRed'>onFulfilled</span> 或 <span class='fontRed'>onRejected</span>返回值 <span class='fontRed'>x</span> --
   上面两个函数 <span class='fontRed'>(v)=>v</span>,传入参数值都是 <span class='fontRed'>1</span>，因此返回值 <span class='fontRed'>x=1
   </span>；
  - 则执行 <span class='fontRed'>promise2</span>的 <span class='fontRed'>resovle(x)</span>函数，然后 <span class='fontRed'>then</span>返回
  <span class='fontRed'>promise2</span>对象 -- 因此上面两个函数都是调用 <span class='fontRed'>promise2</span> 的 <span class='fontRed'>resolve</span>函数，所以两者返回值都是处于 <span class='fontRed'>fulfilled</span>状态的 <span class='fontRed'>Promise</span>对象，并且值都是为 <span class='fontRed'>1</span>

由于我们需要将 <span class='fontRed'>onFulfilled/onRejected</span>函数返回值作为 <span class='fontRed'>promise2 resolve</span>的参数值，
因此我们需要将 <span class='fontRed'>then</span>函数整体移动至 <span class='fontRed'>promise2</span>内部。

```js

then (onFulfilled, onRejected) {
  let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // 返回值作为 resolve 的参数值
        let x = onFulfilled(this.value);
        resolve(x);
      }
      if (this.status === REJECTED) {
        let x = onRejected(this.reason);
        resolve(x);
      }
    });
    return promise2;
}

```

你以为这样就能实现这条规范了吗？

**难点**：同步代码上述思路的确可以实现，但设想这样一个场景，若 <span class='fontRed'>Promise</span>中存在异步代码，异步逻辑设计是 <span class='fontRed'>then</span>执行时，若 <span class='fontRed'>Promise</span>处于 <span class='fontRed'>Pending</span>状态，先将 <span class='fontRed'>onFulfilled/onRejected</span>函数订阅到
<span class='fontRed'>onFulfilledCallbacks/onRejectedCallbacks</span>中，意味着在 <span class='fontRed'>then</span>中此时两函数不会执行，
那么我们应该如何获取两者的返回值呢？

因此我们不能单纯的使用 <span class='fontRed'>this.onFulfilledCallbacks.push(onFulfilled)</span>将回调函数压入事件通道的存储数组中，我们对回调函数做一层封装，将 <span class='fontRed'>promise2</span>的 <span class='fontRed'>resolve</span>函数和 <span class='fontRed'>onFulfilled</span>封装在一起，这样当 <span class='fontRed'>onFulfilled</span>执行时，可以获取返回值 <span class='fontRed'>x</span>,返回 <span class='fontRed'>fulfilled</span>状态的 <span class='fontRed'>promise2</span>，具体可以看下面代码：

```js

// 使用匿名箭头函数，保证内部 this 指向
() => {
  // 回调函数执行，获取其返回值
  let x = onFulfilled(this.value);
  // 执行 promise2 的 resolve 方法
  resolve(x);
}

```

因此 <span class='fontRed'>Pending</span>状态的代码如下：

```js

if (this.status === PENDING) {
  // 使用匿名函数，将 resovle 与 onFulfilled 捆绑在一起
  this.onFulfilledCallbacks.push(() => {
    let x = onFulfilled(this.value);
    resolve(x);
  });
  this.onRejectedCallbacks.push(() => {
    let x = onRejected(this.reason);
    resolve(x);
  });
}


```

3） 如果 <span class='fontRed'>onFulfilled</span> 或 <span class='fontRed'>onRejected</span>执行过程中抛出异常 <span class='fontRed'>e</span>，则调用 <span class='fontRed'>promise2</span>的 <span class='fontRed'>reject(e)</span>,返回 <span class='fontRed'>promise2</span>

举个例子测试一下：

```js

console.log(new Promise((resolve) => {
    resolve(1)
}).then(()=> {
    throw new Error('resolve err')
}))
console.log(new Promise((resolve, reject) => {
    reject(1)
}).then(undefined,()=> {
    throw new Error('reject err')
}))


```

通过输出结果，我们可以看出当 <span class='fontRed'>onFulfilled/onRejected</span> 函数报错时， <span class='fontRed'>promsie2</span>会执行其 <span class='fontRed'>reject</span>函数。因此我们需要给目前的代码添加一层异常捕获，将代码修改成如下情况：

```js

then(onFulfilled, onRejected) {
  let p1 = new Promise((resolve, reject) => {
    if (this.status === FULFILLED) {
      // 添加异常捕获
      try {
        // 返回值作为 resolve 的参数值
        let x = onFulfilled(this.value);
        resolve(x);
      } catch (e) {
        reject(e);
      }
    }
    //... 其余部分类似
  return promise2;
}

```

4) 如果 <span class='fontRed'>onFulfilled</span>不是函数，且 <span class='fontRed'>promise</span>状态为 <span class='fontRed'>Fulfilled</span>，那么 <span class='fontRed'>promise2</span>应该接受同样的值，同时状态为 <span class='fontRed'>Fulfilled</span>

这个规范是啥意思呐？我们来举个例子：

```js

// 输出结果 1
const p1 = new Promise((resolve) => {
    resolve(1)
})
p1.then(x => x).then().then().then().then().then(x=> console.log(x))

```

上述程序最终输出结果为 <span class='fontRed'>1</span>，初次 <span class='fontRed'>resolve</span>传递的 <span class='fontRed'>value</span>值为 <span class='fontRed'>1</span>，可见当 <span class='fontRed'>onFulfilled</span> 不是函数时， <span class='fontRed'>promise</span>值会沿 <span class='fontRed'>then</span>
发生传递，直到 <span class='fontRed'>onFulfilled</span>为函数。

这也就是 <span class='fontRed'>Promise</span>的值传递，当 <span class='fontRed'>then</span>的 <span class='fontRed'>onFulfilled</span>为非函数时，值会一直传递下去，
直至遇到函数 <span class='fontRed'>onFulfilled </span>

5) 如果 <span class='fontRed'>onRejected</span>不是函数，且 <span class='fontRed'>promise</span>状态为 <span class='fontRed'>Rejected</span>，那么 <span class='fontRed'>promise2</span>应该接受同样的原因，同时状态为 <span class='fontRed'>Rejected</span>

```js

// 输出结果 Error: error at <anonymous>:4:33
const p1 = new Promise((resolve) => {
    reject(1)
})
p1.then(undefined, () => {throw Error('error')}).then().then().then().then().then(x=> console.log(x), (r)=> console.log(r))

```

与 <span class='fontRed'>onFulfilled</span>类似， <span class='fontRed'>Promise</span>同样提供了对 <span class='fontRed'>onRejected</span>函数的兼容，会发生错误的传递。

通过第4条与第5条的案例，我们可以发现， 当 <span class='fontRed'>onFulfilled/onRejected</span>为非函数类型， <span class='fontRed'>Promise</span> 会分别发生值传递和异常传递。
我们如何才能连续传递值或者异常
 
  - 值传递：值传递非常简单，我们只需要定义一个函数，参数值为x,返回值为x
  - 异常：定义函数参数值为异常，之后不断抛出此异常。
  
```js

x => x;
e => throw e;

```

```js

then(onFulfilled, onRejected) {
  // 判断参数是否为函数，如果不是函数，使用默认函数替代
  onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (e) => {
          throw e;
        };
  let promise2 = new Promise((resolve, reject) => {
  });
  return promise2;
}

```

写到这里，链式调用的部分就暂时实现了，我们整合一下第三版 <span class='fontRed'>Promise</span>代码。

```js

const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class Promise {
  constructor(executor) {
    this.value = undefined;
    this.reason = undefined;
    this.status = PENDING;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED;
        this.onFulfilledCallbacks.forEach((cb) => cb(this.value));
      }
    };
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        this.onRejectedCallbacks.forEach((cb) => cb(this.reason));
      }
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (e) => {
            throw e;
          };
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // 添加异常捕获
        try {
          // 返回值作为 resolve 的参数值
          let x = onFulfilled(this.value);
          resolve(x);
        } catch (e) {
          reject(e);
        }
      }
      if (this.status === REJECTED) {
        try {
          let x = onRejected(this.reason);
          resolve(x);
        } catch (e) {
          reject(e);
        }
      }
      if (this.status === PENDING) {
        // 使用匿名函数，将 resovle 与 onFulfilled 捆绑在一起
        this.onFulfilledCallbacks.push(() => {
          try {
            let x = onFulfilled(this.value);
            resolve(x);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            let x = onRejected(this.reason);
            resolve(x);
          } catch (e) {
            reject(e);
          }
        });
      }
    });
    return promise2;
  }
}

```