import * as echarts from '../../ec-canvas/echarts';
import china from '../charts/map/mapData.js';

const app = getApp();
let myChart1 = null;
let _this = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec1: {
      lazyLoad: true
    },
    puyuan:[],
    imgUrl:'',
    familyType:'',
    notpuyuan: false,
    info:'',
    needUser: false,
  },
  //  富文本软件编辑完成
  onEditorReady() {
    _this=this;
    wx.createSelectorQuery().select('#editor').context(function (res) {
      _this.context=res.context;
      res.context.setContents({
        html:_this.data.info
      })
    }).exec()
  }, 
  // 去添加家族简介
  toAddFamlyInfo(){
      wx.navigateTo({
        url: '../editor/editor',
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async chinaData() {
    const {familyId}= this.data;
    const {result} = await wx.cloud.callFunction({
      name: 'get',
      data: {
        func: 'getScattered',
        params:{familyId}
    },
    });
    this.init_echarts1(result)
  },
  
  //中国地图
  init_echarts1: function (chartData) {
    this.chart1Componnet = this.selectComponent('#mychart');
    this.chart1Componnet.init((canvas, width, height, dpr) => {
      myChart1 = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      echarts.registerMap('china', china); // 绘制中国地图
      myChart1.setOption(this.getChart1Option(chartData));
      return myChart1;
    });
  },
  getChart1Option: function (chartData) {
    var option = {
      tooltip: {
        trigger: 'item',
        formatter: function (e) {
          var name = e.name ? e.name : '获取中';
          var value = e.value ? e.value : '暂无族'
          return `${name}：${value}人 `
        }
      },
      // 地理坐标系组件
      geo: [{
        type: "map", //图表类型
        mapType: 'china',
        roam: false, // 可以缩放和平移
        aspectScale: 0.8, // 比例
        layoutCenter: ["50%", "43%"], // position位置
        layoutSize: 370, // 地图大小，保证了不超过 370x370 的区域
        label: {
          // 图形上的文本标签
          normal: {
            show: true,
            textStyle: {
              color: "rgba(0, 0, 0, 0.9)",
              fontSize: '8'
            }
          },
          emphasis: { // 高亮时样式
            color: "#333"
          }
        },
        itemStyle: {
          // 图形上的地图区域
          normal: {
            borderColor: "rgba(0,0,0,0.2)",
            areaColor: "#005dff"
          },
          emphasis: {
            areaColor: "#38BC9D", //鼠标选择区域颜色
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 20,
            borderWidth: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        }
      }],
      //图例
      visualMap: {
        type: "piecewise", //类型为分段型。
        splitNumber: 5, //对于连续型数据，自动平均切分成几段。默认为5段。 连续数据的范围需要 max 和 min 来指定。
        pieces: [{
            min: 500,
            label: ">=500人",
            // color: "#FF0000",//里面可以加颜色
          }, // 不指定 max，表示 max 为无限大（Infinity）。
          {
            min: 100,
            max: 499,
            label: "100-499人"
          },
          {
            min: 50,
            max: 99,
            label: "50-99人"
          },
          {
            min: 10,
            max: 50,
            label: "10-49人"
          },
          {
            min: 1,
            max: 10,
            label: "1-9人"
          }, // 表示 value 等于 123 的情况。
         
        ],
        textStyle: {
          fontSize: 8
        },
        realtime: false,
        calculable: false,
        inRange: {
          color: ['lightskyblue', 'yellow', 'orangered'],
        },
        orient: "horizontal",
        bottom: 10,
        left: 'center',
        itemHeight: 10,
        itemWidth: 8,
      },
      series: [{
        name: '族人分布',
        type: 'map', //图表类型
        mapType: 'china',
        // selectedMode: 'multiple',
        label: {
          normal: {
            show: true,
            fontSize: 8,
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            borderColor: '#38BC9D',
            areaColor: '#f6e3df',
          },
          emphasis: {
            areaColor: '#38BC9D',
            borderWidth: 0
          }
        },
        data: chartData
      }]
    };
    return option
  },

  onLoad({id,scene}) {
    const {familyId}= wx.getStorageSync('user');
    this.setData({
      familyId: id || scene||familyId
    })
  },

  //获取用户信息
  getUserInfo(){
    const that=this;
    that.handleCancel();
    const {familyId}=this.data;
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: ({userInfo}) => {
        wx.cloud.callFunction({name: 'get',data: {func: 'addWeChatUser', params:{...userInfo,familyId}}}).then(()=>
        {
          that.getFamilyData();
        })
      },
      fail(){
        wx.exitMiniProgram();
      }
    })
  },
  // 关闭授权框
  handleCancel(){
    this.setData({needUser:false});
  },
  // 获取页面数据
  async getFamilyData(){
      const {familyId:id}=this.data;
      const db = wx.cloud.database();
      const {data} = await db.collection('family').where({_id: id}).get();
     const {result:{data:user}} =await  wx.cloud.callFunction({name: 'get',data: {func: 'getWeChatUser',params:{familyId: id || familyId}}})
      this.setData({
        puyuan:  data[0]?.familyRoot??[],
        info: data[0]?.info||'',
        familyType:data[0]?.familyType,
        imgUrl: `${app.globalData.imgUrl}home.gif`,
        familyId:data[0]?._id,
        needUser: user&&user.length<1,
      })
     if ( this?.context?.setContents)  this.context.setContents({ html:data[0]?.info||'' });
      this.setStorageSync(Object.assign({nickName:user[0]?.nickName, openid:user[0]?._openid,avatarUrl:user[0]?.avatarUrl,auth:user[0]?.isManager}, data[0]))
  },

  // 设置缓存
  setStorageSync({code,familyType,logo, creater,_id,openid,avatarUrl,nickName,isManager}){
    wx.setStorageSync('user',{
      code,
      familyType,
      logo, 
      avatarUrl,
      familyId:_id,
      nickName,
      openid,
      isManager:isManager||openid === creater,
      canDelete: openid === creater
    });
    wx.setNavigationBarTitle({title: familyType});
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.chinaData();
    this.getFamilyData();
  },
})