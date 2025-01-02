## 手写JS面试题
<script  setup>
import  './index.ts'
</script>


### reduce函数

**reduce的参数说明**, <span class='fontRed'>reduce(callbackFn,initialValue)</span>

1) callback接收4个参数，<span class='fontRed'>reduce((pre,cur,index,arry)=>{})</span>
pre累加器、cur当前值、index当前下标、array用于遍历的数组

2) initialValue作为reduce方法的初始值
reduce函数内部判断initialValue是否存在，不存在，需要找到数组中第一个存在的值作为初始值

```js

// 如果提供了initialValue时，则作为pre的初始值，index从0开始； 
// 如果没有提供initialValue，找到数组中的第一个存在的值作为pre，下一个元素的下标作为index

Array.prototype.myReduce = function(fn, initialValue) {
  let pre, index;
  //复制一份数组
  let arr = this.slice();
  if (initialValue === undefined) {
    // 没有设置初始值
    for (let i = 0; i < arr.length; i++) {
      // 找到数组中第一个存在的元素，跳过稀疏数组中的空值
      if (!arr.hasOwnProperty(i)) continue;
      pre = arr[i]; // pre 为数组中第一个存在的元素
      index = i + 1; // index 下一个元素
      break; // 易错点：找到后跳出循环
    }
  } else {
    index = 0;
    pre = initialValue;
  }
  for (let i = index; i < arr.length; i++) {
    // 跳过稀疏数组中的空值
    if (!arr.hasOwnProperty(i)) continue;
    // 注意：fn函数接收四个参数，pre之前累计值、cur 当前值、 当前下标、 arr 原数组
    pre = fn.call(null, pre, arr[i], i, this);
  }
  return pre;
};
console.log([, , , 1, 2, 3, 4].myReduce((pre, cur) => pre + cur)); // 10

```

### compose

在 <span class='fontRed'>函数式编程</span>中有一个很重要的概念就是函数组合，实际上就是把处理数据的函数像管道一样链接起来，然后让数据穿过管道得到最终的结果

在多个框架源码中都有用到，比如 <span class='fontRed'>redux</span>、 <span class='fontRed'>koa</span>中多次遇到这个方法

效果：将一系列函数，通过 <span class='fontRed'>compose</span>函数组合起来，像管道一样链接起来，比如函数结合 <span class='fontRed'>[f,g,h]</span>,通过
compose最终达到这样的效果：<span class='fontRed'>f(g(h()))</span>

```js

function compose(list) {
  // 取出第一个函数，当做reduce函数的初始值
  const init = list.shift();
  return function(...arg) {
    // 执行compose函数，返回一个函数
    return list.reduce(
      (pre, cur) => {
        // 返回list.reduce的结果，为一个promise实例，外部就可以通过then获取
        return pre.then(result => {
          // pre始终为一个promise实例，result为结果的累加值
          // 在前一个函数的then中，执行当前的函数，并返回一个promise实例，实现累加传递的效果
          return cur.call(null, result); 
        });
      },
      // Promise.resolve可以将非promise实例转为promise实例（一种兼容处理）
      Promise.resolve(init.apply(null, arg))
    );
  };
}

// 同步方法案例
let sync1 = data => {
  console.log("sync1");
  return data;
};
let sync2 = data => {
  console.log("sync2");
  return data + 1;
};
let sync3 = data => {
  console.log("sync3");
  return data + 2;
};
let syncFn = compose([sync1, sync2, sync3]);
syncFn(0).then(res => {
  console.log(res);
});
// 依次打印 sync1 → sync2 → sync3 → 3

// 异步方法案例
let async1 = data => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("async1");
      resolve(data);
    }, 1000);
  });
};
let async2 = data => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("async2");
      resolve(data + 1);
    }, 1000);
  });
};
let async3 = data => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("async3");
      resolve(data + 2);
    }, 1000);
  });
};
let composeFn = compose([async1, async2, async3]);
composeFn(0).then(res => {
  console.log(res);
});
// 依次打印 async1 → async1 → async1 → 3

```

### 数组扁平化

deep用来控制扁平的层数，默认为1

**手写数组扁平化**

```js
// deep初始值为1
Array.prototype.myFlat = function(deep = 1) {
  let arr = this;
  // deep为0则返回，递归结束
  if (deep == 0) return arr;
  // 使用reduce作为累加器
  return arr.reduce((pre, cur) => {
    // cur为数组，继续递归，deep-1
    if (Array.isArray(cur)) {
      return [...pre, ...cur.myFlat(deep - 1)];
    } else {
      return [...pre, cur];
    }
  }, []);
};
console.log([1, 2, 3, [4, [5, [6]]]].myFlat(2)); // [1, 2, 3, 4, 5, [6]]

```

### map 函数实现

map中的第二个参数作为第一个参数的this

注意：需要判断稀疏数组，跳过稀疏数组中的空值

```js

  Array.prototype.selfMap = function () {
      const ary = this
      const result = new Array(ary.length);
      const [ fn, thisArg ] = [].slice.call(arguments)
      if (typeof fn !== 'function') {
        throw new TypeError(fn + 'is not a function')  
      }
      for (let i = 0; i < ary.length; i++) {
        // fix稀疏数组的情况
        if (i in ary) {
            result[i] = fn.call(thisArg, ary[i], i, ary);
        }
      }
      return result
  }
  
  const a = new Array(1, 2, 3, 4)
  a.selfMap(item => item + 1) // [ 2, 3, 4, 5 ]
```

### 手写some 函数实现

some()方法用于检测数组中的元素是否满足指定条件(函数提供)、

如果有一个元素满足条件，则表达式返回true，剩余的元素不会再执行检测；如果没有满足条件的元素，则返回false

**手写some**

```js

Array.prototype.mySome = function(fn) {
  let result = false;
  for (let i = 0; i < this.length; i++) {
    // 判断条件是否满足，满足跳出循环
    if (fn(this[i])) {
      result = true;
      break;
    }
  }
  return result;
};
console.log([1, 2, 3, 4].mySome(item => item > 6)); // false

```

###  判断所有数据类型的方法

通过 <span class='fontRed'>Object.prototype.toString.call</span>实现

```js

function getDataType(target) {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}
// 判断所有的数据类型
console.log(getDataType(null)); // null
console.log(getDataType(undefined)); // undefined
console.log(getDataType(Symbol())); // symbol
console.log(getDataType(new Date())); // date
console.log(getDataType(new Set())); // set

```

### 实现es6模板字符串

replace函数，第二个参数是函数的情况说明：每个匹配都调用该函数，它返回的字符串将替换文本使用

```js

let name = "小明";
let age = 20;
let str1 = "我叫${name},我的年龄 ${ age}";
function tempalteStr(str) {
  return str.replace(/\$\{(.*?)\}/g, function(str, k) {
    // eval(name) 替换成 小明
    // // eval(age) 替换成 20
    return eval(k);
  });
}
console.log(tempalteStr(str1)); // 我叫小明,我的年龄20

```

### 函数柯里化

**函数柯里化**：将使用多个参数的一个函数，转换成一系列使用一个参数的函数

**函数柯里化的原理**：用闭包把参数保存起来，当参数的长度等于原函数时，就开始执行函数

```js

function mycurry(fn) {
  // fn.length 表示函数中参数的长度
  // 函数的length属性，表示形参的个数，不包含剩余参数，仅包括第一个有默认值之前的参数个数（不包含有默认值的参数）
  if (fn.length <= 1) return fn;
  // 自定义generator迭代器
  const generator = (...args) => {
    // 判断已传的参数与函数定义的参数个数是否相等
    if (fn.length === args.length) {
      return fn(...args);
    } else {
      // 不相等，继续迭代
      return (...args1) => {
        return generator(...args, ...args1);
      };
    }
  };
  return generator;
}
function fn(a, b, c, d) {
  return a + b + c + d;
}
let fn1 = mycurry(fn);
console.log(fn1(1)(2)(3)(4)); // 10

```

### 函数防抖

**应用场景**：搜索框输入文字调用对应搜索接口

利用闭包，不管触发频率多高，在停止触发n秒后才会执行，如果重复触发，会清空之前的定时器，重新计时，直到最后一次n秒后执行

```js

/*
 * @param {function} fn - 需要防抖的函数
 * @param {number} time - 多长时间执行一次
 * @param {boolean} flag - 第一次是否执行
 */
function debounce(fn, time, flag) {
  let timer;
  return function(...args) {
    // 在time时间段内重复执行，会清空之前的定时器，然后重新计时
    timer && clearTimeout(timer);
    if (flag && !timer) {
      // flag为true 第一次默认执行
      fn.apply(this, args);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, time);
  };
}

function fn(a) {
  console.log("执行:", a);
}
let debounceFn = debounce(fn, 3000, true);
debounceFn(1);
debounceFn(2);
debounceFn(3);

// 先打印：执行: 1  
// 3s后打印: 执行: 3

```

### 函数节流

**应用场景:** 下拉滚动加载

利用闭包，不管触发频率多高，每隔一段时间内执行一次

```js

/*
 * @param {function} fn - 需要防抖的函数
 * @param {number} time - 多长时间执行一次
 * @param {boolean} flag - 第一次是否执行
 */
function throttle(fn, time, flag) {
  let timer;
  return function(...args) {
    // flag控制第一次是否立即执行
    if (flag) {
      fn.apply(this, args);
      // 第一次执行完后，flag变为false；否则以后每次都会执行
      flag = false;
    }
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        clearTimeout(timer);
        // 每次执行完重置timer
        timer = null;
      }, time);
    }
  };
}

// 测试
function fn() {
  console.log("fn");
}
let throttleFn = throttle(fn, 3000, true);
setInterval(throttleFn, 500);

// 测试结果，一开始就打印"fn", 以后每隔3s打印一次"fn"

```

### render函数

虚拟dom转化为真是dom

```js

// 虚拟dom转化为真实dom
function render(node) {
  if (typeof node === "string") {
    // 创建文本节点
    return document.createTextNode(node);
  }
  // 创建对应的dom节点
  let dom = document.createElement(node.tag);
  if (node.attrs) {
    // 设置dom属性
    Object.keys(node.attrs).forEach(key => {
      dom.setAttribute(key, node.attrs[key]);
    });
  }
  // 递归生成子节点
  if (node.children) {
    node.children.forEach(item => {
      dom.appendChild(render(item));
    });
  }
  return dom;
}

```

### dom To JSON

将真实dom转化为虚拟dom

```js

 // 将真实dom转化为虚拟dom
function domToJson(node) {
  let obj = {};

  // 存储节点名称和节点类型
  obj.nodeName = node.nodeName;
  obj.nodeType = node.nodeType;

  // 存储节点的属性
  if (node.attributes && node.attributes.length > 0) {
    obj.attributes = {};

    for (let i = 0; i < node.attributes.length; i++) {
      let attr = node.attributes[i];
      obj.attributes[attr.nodeName] = attr.nodeValue;
    }
  }

  // 存储节点的子节点
  if (node.childNodes && node.childNodes.length > 0) {
    obj.childNodes = [];

    for (let i = 0; i < node.childNodes.length; i++) {
      let child = node.childNodes[i];
      // nodeType 为1表示元素节点，3为文本节点
      if (child.nodeType === 1) {
        obj.childNodes.push(domToJson(child));
      } else if (child.nodeType === 3) {
        obj.childNodes.push(child.nodeValue);
      }
    }
  }

  return obj;
}

```

### 图片懒加载

**图片的懒加载原理**：当图片元素出现在屏幕中时，才给图片的src赋值对应的链接，去加载对应的图片

使用 <span class='fontRed'>InterectionObserver</span>监听元素来判断是否出现在视口，当图片出现在视口中，给img.src赋值

IntersectionObsever替代监听scroll事件来判断元素是否在视口中，性能更高

```js

// html内容
// <img src="./loading.jpg" data-src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg">
// <img src="./loading.jpg" data-src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg">

function observerImg() {
  // 获取所有的图片元素
  let imgList = document.getElementsByTagName("img"); 
  let observer = new IntersectionObserver(list => {
    // 回调的数据是一个数组
    list.forEach(item => {
      // 判断元素是否出现在视口
      if (item.intersectionRatio > 0) {
        // 设置img的src属性
        item.target.src = item.target.getAttribute("data-src");
        // 设置src属性后，停止监听
        observer.unobserve(item.target);
      }
    });
  });
  for (let i = 0; i < imgList.length; i++) {
    // 监听每个img元素
    observer.observe(imgList[i]);
  }
}


```

### 最大并发数

控制请求最大并发数，前面的请求成功后，再发起新的请求

```js

/*
 * 控制并发数
 * @param {array} list - 请求列表
 * @param {number} num - 最大并发数
 */
function control(list, num) {
  function fn() {
    if (!list.length) return;
    // 从任务数 和 num 中 取最小值，兼容并发数num > list.length的情况
    let max = Math.min(list.length, num);
    for (let i = 0; i < max; i++) {
      let f = list.shift();
      num--;
      // 请求完成后，num++
      f().finally(() => {
        num++;
        fn();
      });
    }
  }
  fn();
}

```

### LazyMan

考察：事件轮询机制、链式调用、队列

```js

class LazyMan {
  constructor(name) {
    this.name = name;
    this.task = []; // 任务列表
    function fn() {
      console.log("hi" + this.name);
      this.next();
    }
    this.task.push(fn);
    // 重点：使用setTimeout宏任务，确保所有的任务都注册到task列表中
    setTimeout(() => {
      this.next();
    });
  }
  next() {
    // 取出第一个任务并执行
    let fn = this.task.shift();
    fn && fn.call(this);
  }
  sleepFirst(time) {
    function fn() {
      console.log("sleepFirst" + time);
      setTimeout(() => {
        this.next();
      }, time);
    }
    // 插入到第一个
    this.task.unshift(fn);
    // 返回this 可以链式调用
    return this;
  }
  sleep(time) {
    function fn() {
      console.log("sleep" + time);
      setTimeout(() => {
        this.next();
      }, time);
    }
    this.task.push(fn);
    return this;
  }
  eat(something) {
    function fn() {
      console.log("eat" + something);
      this.next();
    }
    this.task.push(fn);
    return this;
  }
}

new LazyMan("王")
  .sleepFirst(3000)
  .eat("breakfast")
  .sleep(3000)
  .eat("dinner");


```

### sleep函数的多种实现

JS没有语言内置的休眠函数，所谓的sleep只是实现一种延迟执行的效果

等待指定时间后在执行对应的方法

```js
// 方法一：
// 这种实现方式是利用一个伪死循环阻塞主线程。
// 因为JS是单线程的，所以通过这种方式可以实现真正意义上的sleep
function sleep1(fn, time) {
  let start = new Date().getTime();
  while (new Date().getTime() - start < time) {
    continue;
  }
  fn();
}

// 方式二： 定时器
function sleep2(fn, time) {
  setTimeout(fn, time);
}

// 方式三： promise
function sleep3(fn, time) {
  new Promise(resolve => {
    setTimeout(resolve, time);
  }).then(() => {
    fn();
  });
}

// 方式四： async await
async function sleep4(fn, time) {
  await new Promise(resolve => {
    setTimeout(resolve, time);
  });
  fn();
}
function fn() { console.log("fn")}

sleep1(fn, 2000);
sleep2(fn, 2000);
sleep3(fn, 2000);
sleep4(fn, 2000);


```