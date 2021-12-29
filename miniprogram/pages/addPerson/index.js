const db= wx.cloud.database();
import {setLog} from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upDataId:'',
    isManager:false,
    defaultB: '../../static/img/u=1338285567,250100970&fm=26&gp=0.jpg',
    defaultA: '../../static/img/girl.jpg',
    diplomas:['在读','小学','初中','高中','中专','大专','本科','硕士','博士'],
    jobs:['学生','毕摩','苏尼','公务员','事业编','民企','国企','自主创业','务农人员','其他'],
    userInfo:{
      isBoy: 'true',
      isMerry: 'true',
      isGone:'false',
    },
    rules:{
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
  onLoad: async function ({id,pId}) {
    const {isManager} = wx.getStorageSync('user')
    this.setData({
    ['userInfo.pId']: pId,  
    isManager,
    imgUrl: `${getApp().globalData.imgUrl}add_person.jpg`,
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
  // 表单检查
  checkForm(obj){
    let unPassKey = Object.keys(obj).find((key)=>!['address','brief','avatar'].includes(key) && !obj[key])
    if (unPassKey) return unPassKey;
    const reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9|5]))\d{8}$/;
    if ( obj.phone && !reg.test(obj.phone)) unPassKey='phone';
    return unPassKey;
  },
  // 提交表单信息
  formSubmit(e) {
    const {familyId}=wx.getStorageSync('user');
    if (!familyId) {
      wx.showModal({title: `提示`,content: '请重新打开小程序！', });
      return;
    }

    const{avatar,job,diploma,isGone}=this.data.userInfo;
    const{rules}=this.data;
    const unPassKey = this.checkForm(Object.assign(e.detail.value,{avatar,diploma,isGone,job}));
    if ( unPassKey) {
      wx.showToast({
        title: rules[unPassKey],
        icon:'none'
      })
      return
    }
    wx.showLoading({title: '正在上传' });
    const info = Object.assign(this.data.userInfo,e.detail.value,{familyId,}) 
    if ( this.data.upDataId) {
      db.collection('user').where({_id: this.data.upDataId,}).update({ data: info}).then(()=>{
        wx.hideLoading();
        wx.showToast({
          icon: 'success',
          title:'编辑成功',
          duration: 2000,
          success: ()=>{
            setLog({
              type:'update',
              text:`修改了${info.yiwen+info.hanwen}`,
            });
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
          setLog({
            type:'add',
            text:`添加了${info.yiwen+info.hanwen}新成员`,
          });
          wx.navigateBack({delta: 1});
        }
      });
    }).catch((err)=>{
      this.deleteFile(this.data.userInfo.avatar);
      wx.showToast({
        icon: 'error',
        duration: 2000
      });
        wx.hideLoading();
      })
  },
// 重置
  formReset(e) {
    this.setData({
      chosen: '',
      userInfo:{
        isBoy: 'true',
        isMerry: 'true',
        isGone:'false',
      },
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
            cloudPath: `${type}/${new Date().getTime()}.${urlArr[urlArr.length-1]}`,//云储存的路径及文件名
            filePath : chooseres.tempFilePaths[0], //要上传的图片/文件路径 这里使用的是选择图片返回的临时地址
            success : ({fileID}) => { //上传图片到云储存成功
              that.setData({[`userInfo.${type}`]:fileID });
              wx.hideLoading()
              wx.showToast({
                icon: 'success',
                title:'图片已上传成功',
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