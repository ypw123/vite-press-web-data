## Web Worker

**让前端拥有后端的计算能力**

在HTML5的规范中，实现了 <span class='fontRed'>web worker</span>来引入js的 <span class='fontRed'>多线程</span>技术，可以让我们在页面主运行的js线程中，加载运行另外单独的一个或者多个js线程

**Web Worker 专门处理复杂计算的，从此让前端拥有后端的计算能力**

### 页面大量计算，造成假死

浏览器有GUI渲染线程与JS引擎线程，这两个线程是互斥的关系

当js有大量计算时，会造成 <span class='fontRed'>UI阻塞</span>，出现页面卡顿、掉帧等情况，严重时会出现页面卡死的情况，俗称 <span class='fontRed'>假死</span>

### Web Worker使用案例

计算十万条数据，计算时长从35s变成6s，并且全程无卡顿

[Web Worker使用案例](https://juejin.cn/post/7137728629986820126#heading-3)

### web worker提高Canvas运行速度

web worker除了单纯进行计算外，还可以结合 <span class='fontRed'>离屏canvas</span>进行绘图，提升绘图的渲染性能和使用体验

[web worker提高Canvas运行速度](https://juejin.cn/post/7137728629986820126#heading-3)

### 计算时长超过多久适合用 Web Worker

原则：
  
  运算时间超过50ms会造成页面卡顿，属于 <span class='fontRed'>Long task</span>，这种情况可以考虑使用 Web Worker

  但还要先考虑 <span class='fontRed'>通信时长</span>的问题，假如一个运算执行时长为100ms，但是通信时长为300ms，用了Web Worker可能会更慢

最终标准：
  
  计算的运算时长-通信时长 > 50ms,推荐使用 Web Worker