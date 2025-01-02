/**
 * @param {string} pathname pathname 值
 * @returns {SidebarItem[]} 侧边栏数组
 */
export const getSideBarList = (pathname: string) => {
    if ( pathname == '/basicKnowledge') {
      return [
        {
            text: 'Js',
            collapsed: true,
            items: [
              { text: '执行上下文和执行栈', link: '/basicKnowledge/js/context' },
              { text: '作用域', link: '/basicKnowledge/js/scope' },
              { text: 'this', link: '/basicKnowledge/js/this' },
              { text: '闭包', link: '/basicKnowledge/js/closure' },
              { text: '箭头函数', link: '/basicKnowledge/js/arrowFunction' },
              { text: '原型/原型链', link: '/basicKnowledge/js/prototype' },
              { text: 'class类', link: '/basicKnowledge/js/class' },
              { text: '同步和异步', link: '/basicKnowledge/js/synAndAsy' },
              { text: 'promise', link: '/basicKnowledge/js/promise/indexMd' },
              { text: 'async、await', link: '/basicKnowledge/js/asyncOrAwait/indexMd' },
              { text: '浅拷贝/深拷贝', link: '/basicKnowledge/js/copy/indexMd' },
              { text: '定时器', link: '/basicKnowledge/js/timer' },
              { text: '设计模式', link: '/basicKnowledge/js/designPattern/indexMd' },
              { text: 'Web Worker', link: '/basicKnowledge/js/webWorker/indexMd' },
              { text: '沙箱(sandBox)', link: '/basicKnowledge/js/sandBox/indexMd' },
              { text: 'JSBridge', link: '/basicKnowledge/js/JSBridge' },
              { text: '手写js面试题', link: '/basicKnowledge/js/writeJs/indexMd' },
            ]
        },
        {
          text: 'TypeScript',
          collapsed: true,
          items: [
            { text: '什么是TypeScript?', link: '/basicKnowledge/ts/whatTs' },
          ]
      },
        {
          text: 'Css',
          collapsed: true,
          items: [
            { text: 'css基础', link: '/basicKnowledge/css/cssBasic' },
          ]
      },
      ]
    }
    if (pathname == '/algorithm') {
      return [
        {
            text: '数据结构',
            items: [
              { text: '数组', link: '/algorithm/algorithmArr' },
              // { text: 'Css基础', link: '/basicKnowledge/cssBasic' }
            ]
        },
      ]
    }
    if(pathname == '/frame'){
      return [
        {
            text: 'Vue',
            link: '/frame/Vue'
        },
      ]
    }
  }
  