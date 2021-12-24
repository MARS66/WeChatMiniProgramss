const db= wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isManager:false,
    upDataId:'',
    defaultB: '../../static/img/u=1338285567,250100970&fm=26&gp=0.jpg',
    defaultA: '../../static/img/girl.jpg',
    diplomas:['在读','小学','初中','高中','中专','大专','本科','硕士','博士'],
    jobs:['毕摩','苏尼','公务员','事业单位','私企职员','国企职员','自主创业','务农人员','其他'],
    userInfo:{
      isBoy: 'true',
      isMerry: 'true',
      isGone:'false',
    },
    rules:{
      lastName:'姓氏不能为空！',
      avatar:"请上传头像！",
      yiwen:'彝族名不能为空！',
      hanwen:'音译名不能为空！',
      diploma:'学历不能为空！',
      job:'职业不能为空！',
      isBoy:'性别不能为空！',
      isMerry:'是否已婚不能为空！',
      isGone:'是否过世不能为空！',
      phone:'请填写正确联系电话！',
      wechat:'微信号不能为空！',
      province:'户籍地址不完整！',
      city:'户籍地址不完整！',
      county:'户籍地址不完整！',
      birth:'出生年份不能为空',
      death:'过世年份不能为空',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function ({id}) {
    const {isManager} = wx.getStorageSync('user')
    const {data} = await db.collection('user').where({_id:id,}).get();
   const wife = data[0].wife ? Object.assign(this.data.userInfo,data[0].wife):this.data.userInfo;
    this.setData({ userInfo:wife,isManager, upDataId:id})
  },
  // 表单检查
  checkForm(obj){
    let unPassKey = Object.keys(obj).find((key)=>!['address','brief'].includes(key) && !obj[key])
    if (unPassKey) return unPassKey;
    const reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9|5]))\d{8}$/;
    if (obj.phone && !reg.test(obj.phone)) unPassKey='phone';
    return unPassKey;
  },
  // 提交表单信息
  formSubmit(e) {
    const {familyId}=wx.getStorageSync('user');
    if (!familyId) {
      wx.showModal({title: `提示`,content: '请重新打开小程序！', });
      return;
    }

    const{rules}=this.data;
    const{avatar,job,isGone}=this.data.userInfo;
    const unPassKey = this.checkForm(Object.assign(e.detail.value,{avatar,job,isGone}))
    if ( unPassKey) {
      wx.showToast({
        title: rules[unPassKey || 'death'],
        icon:'none'
      })
      return
    }
    wx.showLoading({title: '正在上传'})
    const info = Object.assign(this.data.userInfo,e.detail.value,{familyId,}) 
    db.collection('user').where({_id: this.data.upDataId,}).update({ data:{ wife:info}}).then(()=>{
      wx.hideLoading();
      wx.showToast({
        icon: 'success',
        title:'更新成功',
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
        const urlArr=chooseres.tempFilePaths[0].split('.');
        wx.showLoading({ title : '图片上传中', mask : true,});
       if(this.data.userInfo[type]) that.deleteFile(this.data.userInfo[type]);
          wx.cloud.uploadFile({
            cloudPath:`${type}/${new Date().getTime()}.${urlArr[urlArr.length-1]}`,//云储存的路径及文件名
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
    this.setData({
      ['userInfo.job']: this.data.jobs[e.detail.value],
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