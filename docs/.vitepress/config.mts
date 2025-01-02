import { defineConfig } from 'vitepress'
import { getSideBarList } from './utils' 

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base:'/vite-press-web-data/',
  title: "前端学习",
  description: "前端学习知识库",
  themeConfig: {
    logo: '/图标.svg',
    siteTitle: '前端学习',
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '知识库', 
      items:[
        {
          text:'基础知识篇',
          link: '/basicKnowledge/index'
        },
        {
          text:'算法篇',
          link: '/algorithm/index'
        },
        {
          text:'工程化篇',
          link: '/engineering/index'
        },
        {
          text:'前端框架和浏览器原理',
          link: '/frame/index'
        }
      ] 
    },
    ],
    sidebar:{
      '/basicKnowledge/': getSideBarList('/basicKnowledge'),
      '/algorithm/': getSideBarList('/algorithm'),
      '/frame/': getSideBarList('/frame')
    },
    socialLinks: [
      {
        icon: {
          svg: '<svg t="1713408687091" class="icon" viewBox="0 0 1316 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7801" width="64" height="64"><path d="M643.181714 247.698286l154.916572-123.172572L643.181714 0.256 643.072 0l-154.660571 124.269714 154.660571 123.245715 0.109714 0.182857z m0 388.461714h0.109715l399.579428-315.245714-108.361143-87.04-291.218285 229.888h-0.146286l-0.109714 0.146285L351.817143 234.093714l-108.251429 87.04 399.433143 315.136 0.146286-0.146285z m-0.146285 215.552l0.146285-0.146286 534.893715-422.034285 108.397714 87.04-243.309714 192L643.145143 1024 10.422857 525.056 0 516.754286l108.251429-86.893715L643.035429 851.748571z" fill="#1E80FF" p-id="7802"></path></svg>'
        },
        link: 'https://juejin.cn/user/2409752520033768/posts'
      }
    ],
    outline: {
      level: [2,4],
      label: '当前页'
    },
    footer: {
      message: 'Own Learning Blog.',
      copyright: 'Copyright © 2024-present gqk'
    }
  } 
})
