## 定时器

JS提供了一些原生方法来实现延时去执行一段代码

### setTimeout/setInterval

 - setTimeout固定时长后执行
 - setInterval间隔固定时间重复执行
 - setTimeout/setInterval最短时长为 4ms

### 定时器不准的原因

**setTimeout/setInterval的执行时间并不是确定的**

 setTimeout/setInterval是宏任务，根据事件轮询机制，其它任务会阻塞或延迟js任务的执行

 考虑极端情况，假如定时器里面的代码需要进行大量的计算，或者DOM操作，代码执行时间超过定时器的时间，会出现定时器不准的情况

###  setTimeout/setInterval 动画卡顿

不同设备的屏幕刷新频率可能不同， setTimeout/setInterval只能设置固定的时间间隔，这个时间和屏幕刷新间隔可能不用

setTimeout/setInterval通过设置一个间隔时间，来不断改变图像实现动画效果，在不同设备上可能会出现卡顿、抖动等现象

### requestAnimationFrame

 <span class='fontRed'>requestAnimationFrame</span> 是浏览器专门为动画提供的 API

 requestAnimationFrame刷新频率与显示器的刷新频率保持一致，使用该api可以避免使用
 setTimeout/setInterval造成动画卡顿的情况

 requestAnimationFrame：告诉浏览器在下次重绘之前执行传入的回调函（通常是操作dom，更新动画的函数）

### setTimeout、setInterval、requestAnimationFrame  三者的区别

1) 引擎层面
   
  setTimeout属于 <span class='fontRed'>JS引擎</span>，存在事件轮询
  requestAnimationFrame 属于 <span class='fontRed'>GUI引擎</span>
  <span class='fontRed'>JS引擎与GUI引擎</span>是互斥，也就是说GUI引擎在渲染时会阻塞JS引擎的计算

2) 性能层面

  当页面被隐藏或最小化时，定时器 setTimeout仍在后台执行动画任务

  当页面处于未激活的状态下，该页面的屏幕刷新任务会被系统暂停， requestAnimationFrame也会停止

  **setTimeout模拟实现setInterval**

  ```js
  
  // 使用闭包实现
    function mySetInterval(fn, t) {
    let timer = null;
    function interval() {
        fn();
        timer = setTimeout(interval, t);
    }
    interval();
    return {
        // cancel用来清除定时器
        cancel() {
        clearTimeout(timer);
        }
    };
    }

  ```

**setInterval 模拟实现setTimeout**

```js
function mySetTimeout(fn, time) {
  let timer = setInterval(() => {
    clearInterval(timer);
    fn();
  }, time);
}

// 使用
mySetTimeout(() => {
  console.log(1);
}, 2000);

```
