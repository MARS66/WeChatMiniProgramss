// pages/auth/auth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword:'',
    count:0,
    result:[],
    allAuth:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.setNavigationBarTitle({title: '用户权限管理'});
    this.search();
  },
  setKeywords({detail:{value}}){
    this.setData({keyword:value });
    this.search();
  },
  // 
  async search(){
    const {familyId}=wx.getStorageSync('user');
    const {keyword}=this.data;
    const {result:{count,result}}= await wx.cloud.callFunction({name: 'get',data: {func: 'queryUser',params:{familyId:familyId,keyword}}});
    this.setData({
      result,
      count,
      allAuth:result.every(item=>item.isManager)
    });
  },
  switchAll(e){
    const {familyId}=wx.getStorageSync('user');
    const {value}=e.detail;
    const db = wx.cloud.database();
    const that=this
    db.collection('wechat_user').where({familyId}).update({
        data: {
          isManager: value
        },
      }).then(that.search())
  },

  switchChange(e){
    const {id,index}=e.currentTarget.dataset;
    const {value}=e.detail;
    const db = wx.cloud.database();
    db.collection('wechat_user').where({_id: id}).update({
      data: {
        isManager: value
      },
    }).then(()=>{
      this.setData({
        [ `result[${index}].isManager`]:value
       })
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