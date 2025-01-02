## 设计模式

<script  setup>
import  './index.ts'
</script>

设计模式是从许多优秀的软件系统中，总结出的成功的、能够实现可维护性、复用的设计方案，使用这些方案可以将可以让我们避免做一些重复性的工作

### 单例模式

一个类只能构造出唯一实例

应用案例：弹框

```js

class Single {
  constructor(name) {
    this.name = name;
  }
  static getInstance(name) {
    // 静态方法
    if (!this.instance) {
      // 关键代码 this指向的是Single这个构造函数
      this.instance = new Single(name);
    }
    return this.instance;
  }
}

let single1 = Single.getInstance("name1");
let single2 = Single.getInstance("name2");
console.log(single1 === single2);  // true

```

### 策略模式

根据不同参数命中不同的策略

应用案例：表单验证

```js

// 策略对象
const strategies = {
  // 验证是否为空
  isNoEmpty: function(value, errorMsg) {
    if (value.trim() === "") {
      return errorMsg;
    }
  },
  // 验证最小长度
  minLength: function(value, length, errorMsg) {
    if (value.trim().length < length) {
      return errorMsg;
    }
  },
  // 验证最大长度
  maxLength: function(value, length, errorMsg) {
    if (value.length > length) {
      return errorMsg;
    }
  },
  // 验证手机号
  isMobile: function(value, errorMsg) {
    if (
      !/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[7]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(
        value
      )
    ) {
      return errorMsg;
    }
  }
};

// 验证类
class Validator {
  constructor() {
    this.cache = []; // 存储要验证的方法
    this.errList = []; // 存储最终的验证结果
  }
  add(value, rules) {
    for (let i = 0, rule; (rule = rules[i++]); ) {
      let strategyAry = rule.strategy.split(":");
      let errorMsg = rule.errorMsg;
      this.cache.push(() => {
        let strategy = strategyAry.shift();
        strategyAry.unshift(value);
        strategyAry.push(errorMsg);
        // 执行策略对象中的不同验证规则
        let error = strategies[strategy](...strategyAry);
        if (error) {
          this.errList.push(error);
        }
      });
    }
  }
  start() {
    for (let i = 0, validatorFunc; (validatorFunc = this.cache[i++]); ) {
      validatorFunc();
    }
    return this.errList;
  }
}

let validataFunc = function(info) {
  let validator = new Validator();
  validator.add(info.userName, [
    {
      strategy: "isNoEmpty",
      errorMsg: "用户名不可为空"
    },
    {
      strategy: "minLength:2",
      errorMsg: "用户名长度不能小于2位"
    }
  ]);
  validator.add(info.password, [
    {
      strategy: "minLength:6",
      errorMsg: "密码长度不能小于6位"
    }
  ]);
  validator.add(info.phoneNumber, [
    {
      strategy: "isMobile",
      errorMsg: "请输入正确的手机号码格式"
    }
  ]);
  return validator.start();
};

// 需要验证表单的对象
let userInfo = {
  userName: "王",
  password: "1234",
  phoneNumber: "666"
};
let errorMsg = validataFunc(userInfo);
console.log(errorMsg); // ['用户名长度不能小于2位', '密码长度不能小于6位', '请输入正确的手机号码格式']

```

什么时候用策略模式？

当你负责的模块，基本满足以下情况时

 - 各判断条件下的策略相互独立且可复用
 - 策略内部逻辑相对复杂
 - 策略需要灵活组合


### 代理模式

代理对象和本体对象具有一致的接口

应用案例：图片预加载

```js

// 代理模式
let relImage = (function() {
  let imgNode = document.createElement("img");
  document.body.appendChild(imgNode);
  return {
    setSrc(src) {
      imgNode.src = src;
    }
  };
})();
let proxyImage = (function() {
  let img = new Image();
  // 实际要加载的图片 加载成功后 替换调占位图
  img.onload = function() {
    relImage.setSrc(img.src);
  };
  return {
    setSrc(src) {
      img.src = src;
      // 设置占位图
      relImage.setSrc(
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
      );
    }
  };
})();

// 设置实际要加载的图片
proxyImage.setSrc(
  "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
);


```

**什么时候用代理模式**

当你负责的模块，基本满足以下情况时

 - 模块职责单一且可复用
 - 两个模块间的交互需要一定限制关系


### 组合模式

 组合模式在对象间形成树形结构
 组合模式中基本对象和组合对象被一致对待
 无须关心对象有多少层，调用时只需在根部进行调用

 应用案例：打印文件目录

 ```js

class Combine {
  constructor() {
    this.list = [];
  }
  add(fn) {
    this.list.push(fn);
    return this; // 链式调用
  }
  excute() {
    for (let i = 0; i < this.list.length; i++) {
      this.list[i].excute();
    }
  }
}
let comb1 = new Combine();
comb1
  .add({
    excute() {
      console.log(1);
    }
  })
  .add({
    excute() {
      console.log(2);
    }
  });

let comb2 = new Combine();
comb2
  .add({
    excute() {
      console.log(3);
    }
  })
  .add({
    excute() {
      console.log(4);
    }
  });

let comb3 = new Combine();
comb3
  .add({
    excute() {
      console.log(5);
    }
  })
  .add({
    excute() {
      console.log(6);
    }
  });
comb2.add(comb3);

let comb4 = new Combine();
comb4.add(comb1).add(comb2);
comb4.excute();

// 最终打印结果：1 2 3 4 5 6

 ```

### 工厂模式

 工厂模式是用来创建对象的一种常用的设计的模式

 不暴露创建对象的具体逻辑，而是将逻辑封装在一个函数中，这个函数就可以被视为一个工厂

 应用案例：jquery中的window.$

 ```js

class Car {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }
}
class Factory {
  static create(type) {
    switch (type) {
      case "car":
        return new Car("汽车", "白色");
        break;
      case "bicycle":
        return new Car("自行车", "黑色");
        break;
      default:
        console.log("没有该类型");
    }
  }
}
let p1 = Factory.create("car");
let p2 = Factory.create("bicycle");
console.log(p1, p1 instanceof Car); // {name: '汽车', color: '白色'} true
console.log(p2, p2 instanceof Car); // {name: '自行车', color: '黑色'} true

 ```

### 访问者模式

在不改该对象的前提下访问其结构中元素的新方法

应用案例：babel插件

```js

// 元素类
class Student {
  constructor(name, chinese, math, english) {
    this.name = name;
    this.chinese = chinese;
    this.math = math;
    this.english = english;
  }

  accept(visitor) {
    visitor.visit(this);
  }
}

// 访问者类
class ChineseTeacher {
  visit(student) {
    console.log(`语文${student.chinese}`);
  }
}

class MathTeacher {
  visit(student) {
    console.log(`数学${student.math}`);
  }
}

class EnglishTeacher {
  visit(student) {
    console.log(`英语${student.english}`);
  }
}

// 实例化元素类
const student = new Student("张三", 90, 80, 60);
// 实例化访问者类
const chineseTeacher = new ChineseTeacher();
const mathTeacher = new MathTeacher();
const englishTeacher = new EnglishTeacher();
// 接受访问
student.accept(chineseTeacher); // 语文90
student.accept(mathTeacher); // 数学80
student.accept(englishTeacher); // 英语60

```

### 发布订阅模式

**需求：申请成功后，需要触发对应的订单、消息、审核模块对应逻辑**
![发布订阅](/public/jsBasic/发布订阅示例.png)
```js

function applySuccess() {
  // 通知消息中心获取最新内容
  MessageCenter.fetch();
  // 更新订单信息
  Order.update();
  // 通知相关方审核
  Checker.alert();
}

```
这样写没得毛病，但是呢，我们来思考几个问题

比如 <span class='fontRed'>MessageCenter.fetch</span>是小彭写的，把模块的方法名改了，现在叫 <span class='fontRed'>MessageCenter.request()</span>,你咋办，你这块逻辑就要改。

再比如，你和阿亮并行开发，阿亮负责订单模块，你一气呵成写下这段代码，然后一运行，报错了，一询问，发现，原本今天应该完成的订单模块 <span class='fontRed'>Order.update</span>,延迟一天，那就只能注释代码，等依赖的模块开发完了，你在来写逻辑

更可怕的是，你可能不只是涉及到这三个模块，maybe还有很多模块，比如你申请成功，现在还需要上报申请日志。

到这里我们就要使用发布-订阅模式了

![发布订阅](/public/jsBasic/发布订阅.png)

发布-订阅是一种消息范式，消息的发布者，不会将消息直接发送给特定的 <span class='fontRed'>订阅者</span>，而是通过消息通道广播出去，然后呢，订阅者通过订阅获取到想要的消息

我们用发布 - 订阅模式 修改以下上边的代码

```js
const EventEmit = function() {
  this.events = {};
  this.on = function(name, cb) {
    if (this.events[name]) {
      this.events[name].push(cb);
    } else {
      this.events[name] = [cb];
    }
  };
  this.trigger = function(name, ...arg) {
    if (this.events[name]) {
      this.events[name].forEach(eventListener => {
        eventListener(...arg);
      });
    }
  };
};

```

上边我们写好了一个 <span class='fontRed'>EventEmit</span>，然后我们业务代码可以改成这样

```js

let event = new EventEmit();
event.trigger('success');

MessageCenter.fetch() {
  event.on('success', () => {
    console.log('更新消息中心');
  });
}
Order.update() {
  event.on('success', () => {
    console.log('更新订单信息');
  });
}
Checker.alert() {
  event.on('success', () => {
    console.log('通知管理员');
  });
}


```
但这样就没问题了吗？ 其实还是有弊端，比如说，过多的使用发布订阅，就会导致难以维护调用关系。

**什么时候用发布-订阅模式？**

当你负责的模块，基本满足以下情况时

- 各模块相互独立
- 存在一对多的依赖关系
- 依赖模块不稳定，依赖关系不稳定
- 各模块由不同的人员、团队开发

### 观察者模式

一个对象有一系列依赖于它的观察者，当对象发生变化时，会通知观察者进行更新

应用案例：vue 双向绑定

```js

let data = {
  name: "ming",
  age: 18
};
Object.keys(data).forEach(key => {
  let value = data[key];
  Object.defineProperty(data, key, {
    get() {
      console.log("get", value);
      return value;
    },
    set(newValue) {
      console.log("更新");
      value = newValue;
    }
  });
});
data.name = "佩奇";
console.log(data.name);

// 依次打印： 更新 → get 佩奇 → 佩奇

```

### 装饰器模式

 个人理解：是为了给一个函数赋能，增强它的某种能力，它能动态的添加对象的行为，也就是传入的就是一个对象
 在JS世界中，世间万物，皆为对象

 了解React的都知道，高阶组件其实就是一个函数，接收一个组件作为参数，然后返回一个新的组件。

 那我们现在写一个 高阶组件HOC,用它来装饰 <span class='fontRed'>Target Component</span>

 ``` JS

import React from 'react';

const yellowHOC = WrapperComponent => {
  return class extends React.Component {
    render() {
      <div style={{ backgroundColor: 'yellow' }}>
        <WrapperComponent {...this.props} />
      </div>;
    }
  };
};

export default yellowHOC;

 ```

 定义了一个带有装饰黄色背景的高阶组件，我们用它来装饰目标组件

 ```js
import React from 'react';
import yellowHOC from './yellowHOC';

class TargetComponent extends Reac.Compoment {
  render() {
    return <div>66666</div>;
  }
}

export default yellowHOC(TargetComponent);

 ```

你看，我们这不就用到了装饰器模式了嘛？什么时候用发布，你还听不懂?那我们最后在举个例子，不知道这个例子能不能帮里理解

```js

const kuanWrite = function() {
  this.writeChinese = function() {
    console.log('我只会写中文');
  };
};

// 通过装饰器给阿宽加上写英文的能力
const Decorator = function(old) {
  this.oldWrite = old.writeChinese;
  this.writeEnglish = function() {
    console.log('给阿宽赋予写英文的能力');
  };
  this.newWrite = function() {
    this.oldWrite();
    this.writeEnglish();
  };
};

const oldKuanWrite = new kuanWrite();
const decorator = new Decorator(oldKuanWrite);
decorator.newWrite();


```

### 适配器模式

个人理解，为了解决我们不兼容的问题，把一个类的接口换成我们想要的接口。

### 责任链模式

什么是责任链模式呢？我给你们找个定义：避免请求发送者与接收者耦合在一起，让多个对象都有可能接收请求，将这些对象连接成一条链，并且沿着这条链传递的请求，直到有对象处理它为止。

```js

const Chain = function(fn) {
  this.fn = fn;
  
  this.setNext = function() {}

  this.run = function() {}
}

const applyDevice = function() {}
const chainApplyDevice = new Chain(applyDevice);

const selectAddress = function() {}
const chainSelectAddress = new Chain(selectAddress);

const selectChecker = function() {}
const chainSelectChecker = new Chain(selectChecker);

// 运用责任链模式实现上边功能
chainApplyDevice.setNext(chainSelectAddress).setNext(chainSelectChecker);
chainApplyDevice.run();


```
这样的好处是啥？首先是解耦了各节点关系，之前的方式是A里边要写B,B里边写C，但是这里不同了，你可以在B里啥都不写。

其次，各节点灵活拆分重组，正如上边你接的两个新需求。比如两个步骤的你就只需要这么写完事

```js

const applyLincense = function() {}
const chainApplyLincense = new Chain(applyLincense);

const selectChecker = function() {}
const chainSelectChecker = new Chain(selectChecker);

// 运用责任链模式实现上边功能
chainApplyLincense.setNext(chainSelectChecker);
chainApplyLincense.run();

```

**什么时候使用责任链模式?**

当你负责的模块，基本满足以下情况时

- 你负责的是一个完整流程，或你只负责流程的某个环节
- 各环节可复用
- 各环节有一定的执行顺序
- 各环节可重组

[设计模式](https://juejin.cn/post/6844904138707337229?searchId=20241114152659B28AA37FCAC7372C8A52#heading-20)