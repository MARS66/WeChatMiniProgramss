// pages/log/index.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logs:[],
    total:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const {familyId}=wx.getStorageSync('user');
    const {total} = await db.collection('logs').where({familyId}).count();
    wx.setNavigationBarTitle({title: '操作日志查看'});
    this.setData({total})
    this.getLogs(0);
  },
  //  获取日志
  getLogs(skip){
    const that=this;
    wx.showLoading({ title: '加载中...'});
    const {familyId} = wx.getStorageSync('user')
    db.collection('logs')
    .where({familyId})
    .skip(skip) 
    .limit(20)
    .orderBy('time', 'desc')
    .get()
    .then(({data}) => {
      wx.hideLoading();
      that.setData({ 
        logs:that.data.logs.concat(data)})
    }).catch()
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.logs.length<this.data.total) this.getLogs(this.data.logs.length);
  },
  
})