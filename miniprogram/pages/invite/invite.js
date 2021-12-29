// pages/test/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    familyType:'',
    background:`${app.globalData.imgUrl}poster.jpg`,
    poster:{

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onReady: function (options) {
    this.getCODE();
  },
  async getCODE(){
    const t=this;
    const {familyType,familyId:scene}=wx.getStorageSync('user');
    wx.setNavigationBarTitle({title: `${familyType}海报`});
    const fileName=familyType;
    wx.showLoading({title: '拼命加载中...' });
    const res=await wx.cloud.callFunction({ name: 'scancode', data: { scene, fileName, }});
      if(res?.result?.qrcode){
        t.initDraw( res?.result?.qrcode,familyType);
      }
  },
  
  // 初始话画布
  initDraw(qrcodeSrc,familyType){
    const query = wx.createSelectorQuery()
    query.select('#canvasPoster')
      .fields({ node: true, size: true })
      .exec((res) => {
        const {width,height,node:canvas}= res[0];
        const ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        this.setData({
          familyType,
          canvas,
          ctx,
          width,
          height,
          qrcodeSrc
        })
        this.drawPoster()
      })
  },
  // 绘制海报
  async drawPoster(){
    const {ctx,width,height,familyType,qrcodeSrc,background}=this.data;
    const backgroud = await this.getLoadedImage(background);
    const scan = await this.getLoadedImage(qrcodeSrc);
    const logo = await this.getLoadedImage(`${app.globalData.imgUrl}logo.png`);
    // 背景
    ctx.drawImage(backgroud, 0,0, width, height);
    // logo
    ctx.drawImage(logo, 4,4, 120, 40);
    // 邀请
    // ctx.drawImage(inivite, width/2 -100, height-200, 200,100);
    ctx.fillStyle='rgba(255,255,255, 1)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.save()

    // 二维码白色背景
    ctx.arc(width/2, height/2-60, 60, 0, 2 * Math.PI);
    ctx.fill();

    // 绘制二维码
    ctx.drawImage(scan, width/2 - 50, height/2 - 110, 100, 100);
    wx.hideLoading();
    ctx.restore();
    // 提示文字
    ctx.restore()
    ctx.font='12px 微软雅黑';
    ctx.fillText('微信扫码加入', width/2, height/2 + 20)
    
    ctx.restore()
    ctx.strokeStyle='rgba(255,255,255, 0.8)';
    ctx.font='20px Arial';
    ctx.fillText(`「 ${familyType} 」`, width/2, height/2 + 60, width-80)
  },
  // 自定义背景
  custom(){
    const that=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        that.setData({
          background: res.tempFilePaths[0],
        });
        that.drawPoster();
      }
    })
  },
  // 保存海报
  saveCanvas(){
   const{canvas}=this.data;
   wx.showLoading({title: '保存中...'});
    wx.canvasToTempFilePath({
      canvasId: 'canvasPoster',
      canvas,
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath:res.tempFilePath,
          success() {
            wx.hideLoading({
              success: () => {
                wx.showToast({
                  title: '保存成功！',
                  icon:'success'
                })
              },
            })
           },
           fail(){
            wx.hideLoading({
              success: () => {
                wx.showToast({
                  title: '已取消',
                  icon:'none'
                })
              },
            })
           }
        })
      },
      fail(){
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '保存失败，请稍后重试',
              icon:'error'
            })
          },
        })
      }
    })


  },
  //  异步获取已加载图片
  getLoadedImage(src){
    const that=this;
    return new Promise((resolve)=>{
      wx.getImageInfo({src,
        success (res) {
          const {canvas}=that.data;
          const scan = canvas.createImage();
          scan.src=res?.path;
          scan.onload = () =>  resolve(scan)
        },
        fail(){
          resolve('');
        }
      })
    })
  },
})