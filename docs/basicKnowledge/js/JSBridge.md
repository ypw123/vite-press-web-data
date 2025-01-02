## JSBridge

在如今移动端盛行的年代，技术选型上基本都是混合开发(Hybrid),混合开发是一种开发模式，指使用多种开发模型开发App，通常会涉及到两大类技术：原生**Native、Web H5**

 - 原生技术主要指IOS(Objecttive)、Android(Java),原生开发效率低，开发完成需要重新打包整个APP,发布依赖用户的更新，性能较高功能覆盖率高
 - Web H5主要由HTML、CSS、JavaScript组成，Web可以更好的实现发布更新，跨平台也更加优秀，但性能低，特性也受限

混合开发的意义就在于吸取两者的优点，而且随着手机硬件的升级迭代、系统(Android 5.0+ 、ISO9.0+) 对于Web特性的较好支持，H5的劣势被逐渐缩小

混合开发按照渲染可分为下类：

  - Web渲染的混合APP (Codova、NativeScript)
  - 原生渲染的混合APP(ReactNative、Weex)
  - 小程序

其中的原生、Web相互通信都离不开JSBridge，这里面的小程序比较特殊，对于UI渲染和JS的执行环境做了隔离，基于前两种方式之间。

### JSBridge做了些什么？

在Hybrid模式下，H5会经常需要使用Native的功能，比如打开二维码扫描、调用原生页面、获取用户信息等，同时Native也需要向Web端发送推送、更新状态等，而javaScript是运行在单独的
JS Context中(Webview容器、JSCode等)，与原生由运行环境的隔离，所以需要有一种机制实现Native端和Web端的 <span class='fontRed'>双向通信</span>，这就是JSBridge：以
JavaScript引擎或Webview容器作为媒介，通过协定协议进行通信，实现Native端和Web端双向通信的一种机制。

通过JSBridge,Web端可以调用Native端的Java接口，同样Native端也可以通过JSBridge调用Web端的javaScript接口，实现彼此的双向调用.

![JSBridge](/public/jsBasic/JSBridge.png)

### Webview

首先了解下webView，Webview是移动提供的运行JavaScript的环境，是系统渲染Web网页的一个控件，可与页面JavaScript交互，实现混合开发，其中Android和IOS又有些不同：

Android的WebView采用的是低版本和高版本使用了不同的 <span class='fontRed'>wbkit</span>内核，4.4后直接使用了 <span class='fontRed'>Chrome</span>。

iOS中 <span class='fontRed'>UIwebView</span>算是IOS2就有，但性能较差，特性支持较差， <span class='fontRed'>WKWebView</span>是IOS8之后的升级版，性能更强特性支持也较好。

WebView控件除了能加载指定的URL外，还可以对URL请求，JavaScript的对话框、加载进度、页面交互进行强大的处理，之后会提到拦截请求，执行JS脚本都依赖于此。

### JSB的通信原理

主要有两种：**注入API** 和**拦截 URL SCHEME**

**注入API**

注入 API方式是最常用的方式，主要原理是通过 WebView 提供的接口，向JavaScript 的 Context(window)中注入对象或者方法，让JavaScript调用时，直接执行相应的Native代码逻辑，
达到JavaScript 调用 Native的目的。

**拦截 URL SCHEME 的主要流程**

Web 端通过某种方式  （例如 iframe.src） 发送 URL Scheme请求，之后 Native拦截到请求，并根据URLSCHEME(包括所带的参数)进行相关操作(类似JSONP的方式)

**URL SCHEME的缺陷**

1) 使用iframe.src 发送  URL SCHEME 会有url长度的隐患
2) 创建请求，需要一定的耗时，比注入API的方式调用同样的功能，耗时会较长
   
### 注入API时，H5端的代码

1) 初始化 <span class='fontRed'>WebViewJavascriptBridge</span>

```js

// 根据navigator.userAgent来判断当前是 Android 还是 ios
const u = navigator.userAgent;
// Android终端
const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
// IOS 终端
const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

/**
 * 配合 IOS 使用时的初始化方法
 */
const iosFunction = callback => {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement("iframe");
  WVJBIframe.style.display = "none";
  WVJBIframe.src = "demo://__BRIDGE_LOADED__";
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
};

/**
 * 配合 Android 使用时的初始化方法
 */
const androidFunction = callback => {
  if (window.WebViewJavascriptBridge) {
    callback(window.WebViewJavascriptBridge);
  } else {
    document.addEventListener(
      "WebViewJavascriptBridgeReady",
      function() {
        callback(window.WebViewJavascriptBridge);
      },
      false
    );
  }
};

window.setupWebViewJavascriptBridge = isAndroid ? androidFunction : iosFunction;

isAndroid &&
  window.setupWebViewJavascriptBridge(function(bridge) {
    // 注册 H5 界面的默认接收函数
    bridge.init(function(msg, responseCallback) {
      responseCallback("JS 返回给原生的消息内容");
    });
  });



```
2) 注册与原生交互的事件函数
   
```js

// bridge.registerHandler('事件函数名',fun 执行函数);
window.setupWebViewJavascriptBridge(bridge => {
  // data：原生传过来的数据; 
  // callback: 原生传过来的回调函数
  bridge.registerHandler("H5Function", (data, callback) => {
    callback && callback();
  });
});



```

3) 调用原生注册的事件函数
   
```js

// bridge.callHandler('安卓端函数名', "传给原生端的数据", callback 回调函数);
window.setupWebViewJavascriptBridge(bridge => {
  bridge.callHandler("changeData", data, result => {
    console.log(result);
  });
});


```