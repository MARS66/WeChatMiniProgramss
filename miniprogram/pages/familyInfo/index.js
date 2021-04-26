// pages/familyInfo/index.js
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    puyuan:[{yiwen:'',hanwen:''}],
    familyType:'',
    logo:'',
    info:''
  },
   // 上传照片
   upImage(e){
    const {type} = e.currentTarget.dataset
    const that = this;
    wx.chooseImage({//选择图片
      count : 1, //规定选择图片的数量，默认9
      success : (chooseres)=>{ 
        if(that.data[type]) that.deleteFile(this.data[type]);
        wx.showLoading({ title : '图片上传中', mask : true,});
          wx.cloud.uploadFile({
            cloudPath: type+"/" + new Date().getTime() +"-"+ Math.floor(Math.random() * 1000),//云储存的路径及文件名
            filePath : chooseres.tempFilePaths[0], //要上传的图片/文件路径 这里使用的是选择图片返回的临时地址
            success : ({fileID}) => { //上传图片到云储存成功
              that.setData({[`${type}`]:fileID });
              wx.hideLoading()
              wx.showToast({
                icon: 'success',
                title:'家族图标上传成功',
                duration: 2000
              });
            },
            fail:()=>{
              wx.hideLoading()
              wx.showToast({
                icon: 'error',
                title:'家族图标上传失败',
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
  async formSubmit(e) {
    const {name, info} = e.detail.value;
    const {familyType} = wx.getStorageSync('user')
    const {data} = await db.collection('family').where({familyType:name}).get();
    if (data.length>0&&name!==familyType) {
      wx.hideLoading({
        success: (res) => {
         wx.showToast({
           title: '家族已被占用',
           icon: 'none',
           duration: 2000
         })},
      })
    return;
    }
    if (!this.checkForm(e.detail.value)) {
      wx.showModal({
        title: `提示`,
        content: '请将信息填写完整再提交！',
      })
      return
    }
    wx.showLoading({});
    const {logo} = this.data;
    const _ = db.command
    const {result} = await wx.cloud.callFunction({name: 'get',data: {func: 'getOpenid'}});
    const{data:user} =await db.collection('user').where({bindId:result}).get();
    const date =new Date();
    const str = user[0]?date.toLocaleString()+'----'+ user[0].yiwen+user[0].hanwen+'----修改了家族信息':'家族创建者完善了家族信息';
    const familyRoot = this.deelRoot(e.detail.value);
    db.collection('family').where({familyType,
      })
      .update({
        data: {
          familyType: name,
          info,
          logo,
          familyRoot,
        }
      }).then(()=>{
        const res = wx.getStorageSync('user');
        res.familyType=name;
        wx.setStorageSync('user', res);
        wx.hideLoading({
          success: (ress) => {
            wx.showToast({
              title: '编辑成功',
              success:()=>{    
                db.collection('family').doc(res.familyId).update({
                  data: {
                    logs: _.unshift(str)
                  }
                });
                wx.navigateBack({
                  delta: 1,
                })
              }
            })
          },
        })
      }).catch(()=>{
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: 'title',
              icon:'error'
            })
          },
        })
      })
  },
  checkForm(obj){
    let iscompleted = true;
    Object.keys(obj).forEach((key)=>{
      if (!obj[key]) {
        iscompleted= false;
        return false;
      }
    })
    return iscompleted;
  },

  deelRoot(obj){
    const arrRoot =[];
    Object.keys(obj).forEach((key,index)=>{
      const str=key.split('-')
      if (str[0]==='yiwen' && obj[key] && obj['hanwen-'+str[1]]) {
        arrRoot.push({
          yiwen: obj[key],
          hanwen: obj['hanwen-'+str[1]]
        })
      }
    });
    return arrRoot;
  },
  bindInput(e){
    const {index, key} =e.currentTarget.dataset
    const {value} =e.detail
    const str = `puyuan[${index}].${key}`;
     this.setData({
      [str]: value
     })
  },
  formReset(e) {
    this.setData({chosen: ''})
  },
  addItem(){
    const str = `puyuan[${this.data.puyuan.length}]`;
     this.setData({
      [str]: {yiwen:'',hanwen:''}
     })
  },
  deleteItem(){
    if (this.data.puyuan.length<2) return;
    this.data.puyuan.splice(this.data.puyuan.length-1,1);
    this.setData({
     puyuan: this.data.puyuan,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const {familyType} = wx.getStorageSync('user')
    const {data} = await db.collection('family').where({familyType}).get();
     if (data[0].familyRoot&&data[0].familyRoot.length>0) {
      this.setData({
       puyuan:  data[0].familyRoot,
       info:data[0].info,
       logo:data[0].logo,
       familyType,
       imgUrl: `${getApp().globalData.imgUrl}bacImg.jpg`,
     })
     return;
    }
    this.setData({
      familyType,
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