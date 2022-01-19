// pages/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: `${getApp().globalData.imgUrl}mine.jpg`,
    dialog:false,
    userInfo:{},
    auth:[
        {name:'权限管理',page:'/pages/auth/auth',img:'../../static/icon/auth.png'},
        {name:'家族信息',page:'/pages/familyInfo/index',img:'../../static/icon/editF.png'},
        {name:'邀请家人',page:'/pages/invite/invite',img:'../../static/icon/invite.png'},
        {name:'操作记录',page:'/pages/log/index',img:'../../static/icon/oprea.png'},
        {name:'安全退出',page:'loginout',img:'../../static/icon/exit.png'},
        {name:'问题反馈',img:'../../static/icon/res.png'},
        {name:'帮助',page:'/pages/help/help',img:'../../static/icon/help.png'},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const  userInfo=wx.getStorageSync('user');
    this.setData({userInfo});
    wx.setNavigationBarTitle({title: userInfo.familyType})
  },
  editName(){
    this.setData({
      dialog:true,
    })
  },
  cancel(){
    this.setData({
      dialog:false,
    })
  },
  formSubmit({detail:{value:{nickName}}}){
    if (nickName) { 
      const that=this;
      const {openid,familyId}=this.data.userInfo;
      const db= wx.cloud.database();
      db.collection('wechat_user').where({_openid: openid,familyId})
      .update({ data: {nickName}}).then(({errMsg})=>{
      if (errMsg==='collection.update:ok') {
        that.setData({
          dialog:false,
          ['userInfo.nickName']:nickName,
        });
        wx.setStorageSync('user', that.data.userInfo);
      }else{
        that.setData({
          dialog:false,
        })
      }
      });
    }else{
      this.setData({
        dialog:false,
      })
    }
  },
  // 路由跳转
  handleOut({currentTarget:{dataset:{page}}}){
    const needAuth=['auth','familyInfo'];
    const {isManager,familyType}=this.data.userInfo;
    if (!page)return;
    if (page==='loginout') {
      wx.showModal({
        title: '提示',
        content: `退出${familyType}？`,
        success (res) {
          if (res.confirm) {
            wx.clearStorageSync('user');
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }
        }
      })
      return;
    }
    if (needAuth.includes(page)&&!isManager) {
      wx.showModal({
        title: '温馨提示',
        content: '此功能涉及信息修改，请联系管理员或者家谱创建者获取授权！'
      });
      return;
    }
    wx.navigateTo({
      url: page,
    })
  },
})