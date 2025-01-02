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
    errList: never[];
      cache: never[];
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
          let error= strategies[strategy](...strategyAry);
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
    // validator.add(info.phoneNumber, [
    //   {
    //     strategy: "isMobile",
    //     errorMsg: "请输入正确的手机号码格式"
    //   }
    // ]);
    return validator.start();
  };
  
  // 需要验证表单的对象
  let userInfo = {
    userName: "王2",
    password: "123444",

  };
  let errorMsg = validataFunc(userInfo);
//   console.log(errorMsg); // ['用户名长度不能小于2位', '密码长度不能小于6位', '请输入正确的手机号码格式']



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
})

// // 设置实际要加载的图片
// proxyImage.setSrc(
//     "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
// );

  


// 发布订阅模式
class EventBus {
    task: {};
    constructor() {
      this.task = {};
    }
    on(type, fn) {
      // on 注册事件
      if (!this.task[type]) this.task[type] = [];
      this.task[type].push(fn);
    }
    emit(type, ...args) {
      // emit 发送事件
      if (this.task[type]) {
        this.task[type].forEach(fn => {
          fn.apply(this, args); // 注意this指向
        });
      }
    }
    off(type, fn) {
      // 删除事件
      if (this.task[type]) {
        this.task[type] = this.task[type].filter(item => item !== fn);
      }
    }
    once(type, fn) {
      // 只执行一次
      function f(...args) {
        fn(...args);
        this.off(type, f);
      }
      this.on(type, f);
    }
  }
  
  // 测试
  let events = new EventBus();
  events.on("change", (...args) => {
    console.log(args);
  });
  // 只执行一次
  events.once("change", (...args) => {
    console.log(args);
  });
  events.emit("change", 1, 2);
  events.emit("change", 2, 3);
  
  