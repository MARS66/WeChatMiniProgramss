//app.js
App({
  onLaunch: function () {
    // const imgUrl = 'cloud://yirenzupu-7gaztg60036d0366.7969-yirenzupu-7gaztg60036d0366-1302998236/static/';
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env:'yigu-v5bi0',
        // env: 'yirenzupu-7gaztg60036d0366',
        traceUser: true,
      })
    }
    this.globalData = {
      imgUrl:'cloud://yigu-v5bi0.7969-yigu-v5bi0-1302998236/static/',
    }
  },
})
