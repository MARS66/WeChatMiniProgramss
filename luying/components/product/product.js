// components/product/product.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    products:{
      type:Array,
      value:[]
    },
    margin:{
      type:Boolean,
      value:false,
    },
    isBooked:{
      type:Boolean,
      value:false,
    },
    canDelete:{
      type:Boolean,
      value:false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 去查看详情
    goDetail({currentTarget:{dataset: {id}}}){
      wx.navigateTo({
        url: `../detail/detail?id=${id}`,
      })
    },
    
    // 删除
    delete({currentTarget:{dataset: {id}}}){
      console.log(id);
    },
  }
})
