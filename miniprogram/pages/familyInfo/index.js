
import {setLog} from '../../utils/util.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    familyType:'',
    familyId:'',
  },
  onLoad(){
    const {familyType,familyId} =wx.getStorageSync('user');
    this.setData({
      familyType,
      familyId,
    })
  },

  handleBlur({detail:{value}}){
    const that=this;
   const {familyType,familyId}=this.data;
    if (value&&familyType!==value) {
      const db= wx.cloud.database();
      wx.showLoading({
        title: '正在加载...',
      })
      db.collection('family').where({_id: familyId}).update({ data: {familyType:value}}).then(()=>{
          wx.hideLoading({
            success: (res) => {
              setLog({
                familyId,
                type:'update',
                text:'修改了家族名称',
              })
              that.undateStorage(value);
              wx.showToast({
                title: '编辑成功',
                icon:'success'
              })
            },
          })
      })
   }
  },
  // 更新缓存
  undateStorage(value){
    const Storage= wx.getStorageSync('user');
    Storage.familyType=value;
    wx.setStorageSync('user', Storage);
    this.setData({ familyType:value});
  }
});