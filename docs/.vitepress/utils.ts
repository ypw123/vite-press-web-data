/**
 * @param {string} pathname pathname 值
 * @returns {SidebarItem[]} 侧边栏数组
 */
export const getSideBarList = (pathname: string) => {
    if ( pathname == '/basicKnowledge') {
      return [
        {
            text: '基础知识篇',
            collapsed: true,
            items: [
              { text: 'js基础', link: '/basicKnowledge/jsBasic' },
              { text: 'Css基础', link: '/basicKnowledge/cssBasic' }
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
  }
  