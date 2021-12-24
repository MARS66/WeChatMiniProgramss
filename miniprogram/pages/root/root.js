// pages/root/root.js
      const db= wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    familyId:'',
    roots:[
      {
        yinwem:'',
        hanwem:'',
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    wx.setNavigationBarTitle({ title: '谱源信息编辑'});
    const {familyId}=wx.getStorageSync('user');
    const {data}=await db.collection('family').where({_id: familyId}).get();
   this.setData({
    roots:data[0]?.familyRoot,
    familyId,
   })
  },
  submit(){
    const {familtId,roots}=this.data;
    console.log(roots);
    const unWrite=roots.find(item=> !item.yiwen || !item.hanwen);
    if (unWrite) {
      wx.showToast({
        title: '请先完善信息！',
        icon:'none'
      });
      return
    }
    wx.showLoading({
      title: '正在保存...',
    })
   db.collection('family').where({_id: familtId}).update({ data: {familyRoot:roots}})
   .then(()=>{
    wx.hideLoading({
      success: (res) => {
        wx.navigateBack({
          delta: 1,
        })
      },
    })
   })
  },
  setValue(e){
   const {index,key} = e.currentTarget.dataset;
   const {value} = e.detail;
   this.setData({ [`roots[${index}].${key}`]:value });
  },
  add(){
    const {roots}=this.data
    roots.push({ yinwem:'', hanwem:'', });
      this.setData({
        roots,
      });
  },
  delete(){
    const {roots}=this.data
    if (roots.length>1) {
      this.setData({
        roots:roots.splice(0,roots.length-1)
      })
    }
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