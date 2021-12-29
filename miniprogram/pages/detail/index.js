// pages/detail/index.js
import {setLog} from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    isWife: false,
    isManager:false,
    canDelete:false,
    puyuan:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad({id,isWife}) {
    const {isManager,canDelete}=wx.getStorageSync('user')
    this.setData({
      currentId:id,
      isManager,
      canDelete,
      isWife:isWife==='true',
      imgUrl: `${getApp().globalData.imgUrl}bacImg.jpg`,
    })
  },
  // 查看大图
  viewImage(){
    wx.previewImage({
      urls: [this.data.userInfo.avatar]
    })
  },
  // 去当前点击这个人的详情页
  goHisDetail(e){
    const {id,iswife} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../detail/index?id=${id}&isWife=${!!iswife}`,
    })
  },
  // 添加孩子
  addChild(){
    const {_id} = this.data.userInfo;
    wx.navigateTo({
      url: `../addPerson/index?pId=${_id}`,
    })
  },
  //delete
  async delete(){
    const {yiwen,hanwen,familyId,_id,wife} = this.data.userInfo;
    //  删除妻子
    if (this.data.isWife) {
     wx.showModal({
      title: '提示',
      content: `是否删除${yiwen+hanwen}的妻子${wife.yiwen+wife.hanwen}信息？`,
      success (res) {
        if (res.confirm) {
          wx.showLoading({title: '删除中...',})
          const db= wx.cloud.database();
          db.collection('user').where({_id}).update({ data: {wife:db.command.remove()}}).then(()=>{
            wx.hideLoading({
              success: (res) => {
                wx.navigateBack({
                  delta: 1,
                })
              },
            })
          })
        }
      }
    })
      return
    }
    // 删除支系
    wx.showModal({
      title: '提示',
      content: `是否删除${yiwen+hanwen}及其所有支系？`,
      success (res) {
        if (res.confirm) {
          wx.showLoading({title: '删除中...',})
          wx.cloud.callFunction({
            name: 'get',data: {func: 'deletePerson',  params:{familyId,_id}}}).then((res)=>{
            wx.hideLoading();
            if (res) {
              wx.showToast({title:'删除成功',icon:'success',success:()=>{
                setLog({
                  type:'delete',
                  text:`删除了${yiwen+hanwen}支系！`,
                });
                wx.navigateBack({delta: 1,});
              }});
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

  // 编辑信息
  updata(){
    const {_id,pId} = this.data.userInfo;
    wx.navigateTo({
      url: `../${this.data.isWife?'wife':'addPerson'}/index?pId=${pId}&id=${_id}`,
    })
  },
    // 添加妻子
    addWife(){
      const {_id} = this.data.userInfo;
      wx.navigateTo({
        url: `../wife/index?id=${_id}`,
      })
    },
  // 复制电话微信
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

  async  getUser(){
    wx.showLoading({
      title: '正在加载...',
    })
    const {familyId}=wx.getStorageSync('user');
    const {result} = await wx.cloud.callFunction({
      name: 'get',
      data: {
        func: 'getPerson',
        params:{_id:this.data.currentId,familyId,}
      },
      });
      wx.hideLoading();
      if (result) {
        this.setData({userInfo:result})
      }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    await this.getUser()
  },
})