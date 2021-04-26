const db= wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upDataId:'',
    defaultB: '../../static/img/u=1338285567,250100970&fm=26&gp=0.jpg',
    defaultA: '../../static/img/girl.jpg',
    diplomas:['在读','小学','初中','高中','中专','大专','本科','研究生','博士生'],
    jobs:['学生','教师','医生','警察','毕摩','苏尼','务农','公务员','事业单位','私企职员','国企职员','自由职业','自主创业'],
    userInfo:{
      isBoy: 'true',
      isMerry: 'true',
      isGone:'false',
      bcImg:'',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function ({id,pId}) {
    const {logo=''} = wx.getStorageSync('user')
    this.setData({
    ['userInfo.bcImg']: logo,
    ['userInfo.pId']: pId,  
    imgUrl: `${getApp().globalData.imgUrl}bacImg.jpg`,
  });
    if (id) {
      const {data} = await db.collection('user').where({_id:id}).get();
      delete data[0]._id;
      delete data[0]._openid;
      this.setData({
        userInfo:data[0],
        upDataId:id,
      })
    }
  },
  checkForm(obj){
    let iscompleted = true;
    Object.keys(obj).forEach((key)=>{
      if (key!=='address' && !obj[key]) {
        iscompleted= false;
        return false;
      }
    })
    return iscompleted;
  },
  formSubmit(e) {
    const {familyId}=wx.getStorageSync('user');
    if (!familyId) {
      wx.showModal({
        title: `提示`,
        content: '系统出现错误请稍后重试',
      })
      return;
    }
    const{avatar,job,death,diploma,birth,isGone}=this.data.userInfo;
    if (!this.checkForm(Object.assign(e.detail.value,{avatar,diploma,job,birth}))||(isGone==='true'&&!death) ) {
      wx.showModal({
        title: `提示`,
        content: '有信息未填写，请先填写完整！',
      })
      return
    }
    wx.showLoading({
      title: '正在上传',
    })
    const info = Object.assign(this.data.userInfo,e.detail.value,{familyId,}) 
    if ( this.data.upDataId) {
      db.collection('user').where({_id: this.data.upDataId,}).update({ data: info}).then(()=>{
        wx.hideLoading();
        wx.showToast({
          icon: 'success',
          title:'编辑成功',
          duration: 2000,
          success: ()=>{
            wx.navigateBack({delta: 1});
          }
        });
      }).catch((err)=>{
        wx.showToast({
          icon: 'error',
          duration: 2000
        });
          wx.hideLoading();
        })
      return;
    }
    db.collection('user').add({data:info}).then(res=>{
      wx.hideLoading();
      wx.showToast({
        icon: 'success',
        title:'添加成功',
        duration: 2000,
        success: ()=>{
          wx.navigateBack({delta: 1});
        }
      });
    }).catch((err)=>{
      if (this.data.userInfo.bcImg)  this.deleteFile(this.data.userInfo.bcImg);
      this.deleteFile(this.data.userInfo.avatar);
      wx.showToast({
        icon: 'error',
        duration: 2000
      });
        wx.hideLoading();
      })
  },

  formReset(e) {
    this.setData({
      chosen: ''
    })
  },
  // 上传照片
  upImage(e){
    const {type} = e.currentTarget.dataset
    const that = this;
    wx.chooseImage({//选择图片
      count : 1, //规定选择图片的数量，默认9
      success : (chooseres)=>{ 
        wx.showLoading({ title : '图片上传中', mask : true,});
       if(this.data.userInfo[type]) that.deleteFile(this.data.userInfo[type]);
          wx.cloud.uploadFile({
            cloudPath: type+"/" + new Date().getTime() +"-"+ Math.floor(Math.random() * 1000),//云储存的路径及文件名
            filePath : chooseres.tempFilePaths[0], //要上传的图片/文件路径 这里使用的是选择图片返回的临时地址
            success : ({fileID}) => { //上传图片到云储存成功
              that.setData({[`userInfo.${type}`]:fileID });
              wx.hideLoading()
              wx.showToast({
                icon: 'success',
                title:'图片已传成功',
                duration: 2000
              });
            },
            fail:()=>{
              wx.hideLoading()
              wx.showToast({
                icon: 'error',
                title:'图片上传失败',
                duration: 2000
              });
            },
          })
      },
      fail:()=>{
      },
  })
  },
  // 删除
  deleteFile(id){
    wx.cloud.deleteFile({
      fileList: [id]
    })
  },
  bindChange(e) {
    const {type} = e.currentTarget.dataset
    this.setData({
      [`userInfo.${type}`]: e.detail.value
    })
  },
  // 职业
  bindPickerChange: function(e) {
    const {type} = e.currentTarget.dataset
    const obj = type==='job'?this.data.jobs: this.data.diplomas
    this.setData({
      [`userInfo.${type}`]: obj[e.detail.value],
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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