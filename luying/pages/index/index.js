// index.js
// 获取应用实例
import { getIndex } from "../../apis/api";
const app = getApp()

Page({
  data: {
    indicatorDots:true,
    autoplay:true,
    interval:3000,
    duration:300,
    swipers:[
      '../../static/images/图层 9.png',
      '../../static/images/图层 9.png',
      '../../static/images/图层 9.png'
    ],
    navs:[
      {
        icon:'../../static/images/jinpai.png',
        label:'金牌推荐',
        href:'/pages/motion/motion'
      },
      {
        icon:'../../static/images/anquan.png',
        label:'风控措施',
        href:'/pages/article/article'
      },
      {
        icon:'../../static/images/Iconly-Bold-Chat.png',
        label:'实时咨询',
        href:'/pages/customerService/customerService'
      },
      {
        icon:'../../static/images/us.png',
        label:'关于我们',
        href:'/pages/about/about'
      },
    ],
    news:[
      {
        text:'合法化覅和撒酒疯和i啊的繁华放大时间和',
        img:'../../static/images/图层 25.png',
        reads:'1561'
      },
      {
        text:'合法化覅和撒酒疯和i啊的繁华放大时间和',
        img:'../../static/images/图层 25.png',
        reads:'1561'
      },
    ],
  },
  myPromise () {
    return new Promise(resolve => {
    setTimeout(() => resolve("hello async/await"), 1000);
  });
  },
  async onLoad() {
   const res = await getIndex();
   console.log(666,res);
  },
  // 跳转路由
  go({currentTarget:{dataset: {href}}}){
    console.log(href);
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
})
