// pages/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideModal:true, //模态框的状态  true-隐藏  false-显示
    animationData:{},//
    userInfo:null,
    isWife: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function ({id,isWife}) {
    this.setData({currentId:id ,isWife:isWife==='true',
    imgUrl: `${getApp().globalData.imgUrl}bacImg.jpg`,})
  },
  viewImage(){
    wx.previewImage({
      urls: [this.data.userInfo.avatar]
    })
  },
  // 去当前点击这个人的详情页
  goHisDetail(e){
    this.hideModal();
    const {id,iswife} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../detail/index?id=${id}&isWife=${!!iswife}`,
    })
  },
  // 添加孩子
  addChild(){
    this.hideModal();
    const {_id} = this.data.userInfo;
    wx.navigateTo({
      url: `../addPerson/index?pId=${_id}`,
    })
  },
  //delete
  async delete(){
    this.hideModal();
    wx.showLoading({title: '加载中...',});
    const {_id,familyId,yiwen,hanwen} = this.data.userInfo
    const {result:auth} = await wx.cloud.callFunction({
      name: 'get',data: {func: 'checkAuth',  params:{familyId}}});
      wx.hideLoading();
    if (!_id||auth===null||auth===undefined) {
      wx.showToast({title:'网络错误请稍后重试一试！',icon:'none'});
      return;
    }
    if (!auth) {
      wx.showToast({title:'请向先绑定角色！',icon:'none'});
      return;
    }
    wx.showModal({
      title: '提示',
      content: `删除${yiwen+hanwen}会将他所有子代全部删除，是否删除？`,
      success (res) {
        if (res.confirm) {
          wx.showLoading({title: '删除中...',})
          wx.cloud.callFunction({
            name: 'get',data: {func: 'deletePerson',  params:{familyId,_id}}}).then((res)=>{
            wx.hideLoading();
            if (res) {
              wx.showToast({title:'删除成功',icon:'success',success:()=>{ wx.navigateBack({delta: 1,});}});
              return;
            } 
            wx.showToast({title:'删除失败请重试！',icon:'error'});
          }).catch(()=>{
            wx.hideLoading();
            wx.showToast({title:'删除失败请重试！',icon:'error'});
          });
        }
      }
    })
  },
  // bindrole
  async bindRole(){
    this.hideModal();
    const {_id,bindId,yiwen,hanwen,familyId} = this.data.userInfo
    wx.showLoading({title: '加载中...',});
    const {result} = await wx.cloud.callFunction({name: 'get',data: {func: 'getOpenid'}});
    const {result:auth} = await wx.cloud.callFunction({name: 'get',data: {func: 'checkAuth',  params:{familyId}}});
    wx.hideLoading();
    if (bindId) {
      wx.showToast({title: `角色${yiwen+hanwen}已被占用！`,icon:'none'});
      return;
    }
    if (!_id||!result) {
      wx.showToast({title:'网络错误请稍后重试一试！',icon:'none'});
      return;
    }
    if (auth) {
      wx.showToast({title:'您的微信已绑定了其他角色！',icon:'none'});
      return;
    }
    wx.showModal({
      title: '提示',
      content: `每个微信只能绑定一个角色且绑定后不可更改，是否绑定${yiwen+hanwen}到你的微信？`,
      success (res) {
        if (res.confirm) {
          wx.showLoading({title: '绑定中...',})
          const db= wx.cloud.database();
          db.collection('user').where({_id,}).update({ data: {bindId:result}}).then(()=>{
          wx.hideLoading();
          wx.showToast({title:'绑定成功',icon:'success'});
          }).catch(()=>{
            wx.hideLoading();
            wx.showToast({title:'绑定失败请重试！',icon:'error'});
          });
        }
      }
    })
  },
  // 编辑信息
  updata(){
    this.hideModal();
    const {_id,pId} = this.data.userInfo;
    wx.navigateTo({
      url: `../addPerson/index?pId=${pId}&id=${_id}`,
    })
  },
    // 添加妻子
    addWife(){
      this.hideModal();
      const {_id} = this.data.userInfo;
      wx.navigateTo({
        url: `../wife/index?id=${_id}`,
      })
    },
  copy(e){
    const {val,type} = e.currentTarget.dataset;
    wx.setClipboardData({
      //准备复制的数据
      data: val,
      success: function () {
        wx.showToast({
          title: `${type}已复制`,
        });
      }
    });
  },
  
//显示对话框
showModal: function () {
  // 显示遮罩层
  const {isView}=wx.getStorageSync('user');
  if (isView) {
    wx.showToast({
      title: '预览不支持信息操作，请登录!',
      icon:'none',
    });
    return;
}
  if (this.data.isWife) {
      wx.showToast({
        title: '请到其丈夫节点操作!',
        icon:'none',
      });
      return;
  }
  var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
    animationData: animation.export(),
    showModalStatus: true
  })
  setTimeout(function () {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
  }.bind(this), 200)
},
//隐藏对话框
hideModal: function () {
  // 隐藏遮罩层
  var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
    animationData: animation.export(),
  })
  setTimeout(function () {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: false
    })
  }.bind(this), 200)
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    const {familyId}=wx.getStorageSync('user');
    wx.showLoading({
      title: '正在加载...',
    })
    const {result} = await wx.cloud.callFunction({
      name: 'get',
      data: {
        func: 'getPerson',
        params:{_id:this.data.currentId,familyId,}
    },
      });
      if (result) {
        this.setData({userInfo:result})
      }
      wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})