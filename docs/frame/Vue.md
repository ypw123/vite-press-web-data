## Vue

### 手写mini版的MVVM框架

实现效果：2s后修改姓名和年龄这两个值，页面响应式更新渲染

实际流程

1) 定义 <span class='fontRed'>observe函数</span>，利用 <span class='fontRed'>Object.defineProperty</span> 把data中的属性变成响应式的，同时给每一个属性添加
一个 <span class='fontRed'>dep对象</span>（用来储存对应的 <span class='fontRed'>watcher观察者</span>）
2) 定义 <span class='fontRed'>compile函数</span>，模板编译，遍历DOM,遇到 <span class='fontRed'>mustache</span>（双大括号{{}}）形成的文本，则替换成data.key
对应的值，同时将该dom节点添加到对应key值的dep对象中
3) 当data的数据变化时，调用dep对象的 <span class='fontRed'>update</span>方法，更新所有观察者中的dom节点

```js
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>vue的MVVM简单实现</title></head>
<body>
<div id="app">
  <p>姓名: <span>{{name}}</span></p>
  <p>年龄: <span>{{age}}</span></p>
</div>
<script>
  window.onload = function () { 
    // new一个vue实例
    let vue = new Vue(
       {
         el: '#app', 
         data: {
             name: '加载中', age: '18'
           }
         }
      )
    // 2s后更新页面的信息
    setTimeout(() => {
      // 修改vue中$data的name和age属性
      vue.$data.name = '小明';
      vue.$data.age = 20;
    }, 2000)
  }
  class Vue {
    constructor(options) {
      this.options = options
      this.$data = options.data
      this.observe(options.data)
      this.compile(document.querySelector(options.el))
    }
    // 监听data中属性的变化
    observe(data) {
      Object.keys(data).forEach(key => {
        // 给data中的每一个属性添加一个dep对象（该对象用来存储对应的watcher观察者）
        let observer = new Dep() 
        // 利用闭包 获取和设置属性的时候，操作的都是value
        let value = data[key] 
        Object.defineProperty(data, key, {
          get() {
            // 观察者对象添加对应的dom节点
            Dep.target && observer.add(Dep.target) 
            return value
          },
          set(newValue) {
            value = newValue
            // 属性值变化时，更新观察者中所有节点
            observer.update(newValue) 
          }
        })
      })
    }
    compile(dom) {
      dom.childNodes.forEach(child => {
        // nodeType 为3时为文本节点，并且该节点的内容包含`mustache`（双大括号{{}})
        if(child.nodeType === 3 && /\{\{(.*)\}\}/.test(child.textContent)) {  
          // RegExp.$1是正则表达式匹配的第一个字符串，这里对应的就是data中的key值
          let key = RegExp.$1.trim()  
          // 将该节点添加到对应的观察者对象中，在下面的的this.options.data[key]中触发对应的get方法
          Dep.target = child    
          // 将{{key}} 替换成data中对应的值
          child.textContent = child.textContent.replace(`{{${key}}}`, this.options.data[key]) 
          Dep.target = null
        }
        // 递归遍历子节点
        if(child.childNodes.length) {
          this.compile(child)
        }
      })
    }
  }
  
  // dep对象存储所有的观察者
  class Dep { 
    constructor() {
      this.watcherList = []
    }
    // 添加watcher
    add(node) {
      this.watcherList.push(node)
    }
    // 更新watcher
    update(value) {
      this.watcherList.forEach(node => {
        node.textContent= value
      })
    }
  }
</script>
</body>
</html>
```