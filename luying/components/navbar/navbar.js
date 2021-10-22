// components/navbar/navbar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '路盈基金',
    },
    background:{
      type: String,
      value: '#fff',
    },
    color:{
      type: String,
      value: '#000',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    customNavBarHeight:app.globalData.customNavBarHeight,
    customTextHight:app.globalData.customTextHight,
    customTextpadding:app.globalData.customTextpadding,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
