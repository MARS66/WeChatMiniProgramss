
import config from '../config.js'
class Axions {

  login(){
    let that = this
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.request({
          url: app.globalData.page_url+'/api/user/profile',
          data: {
            avatar:res.userInfo.avatarUrl,
            nickname:res.userInfo.nickName,
            gender:res.userInfo.gender-1,
            },
            header: {
            'content-type': 'application/json', // 默认值
              token:wx.getStorageSync('token')
            },
            success (res) {
              wx.reLaunch({
                url: that.data.reload,
              })
            }
        })
      }
    })
  }
/**
 * 设置统一的异常处理
 */
  setErrorHandler({msg}) {
    wx.showToast({
      title: msg||'请求失败',
      icon:'error'
    })
  }
  /**
   * 网络请求
   */
  request({url, data, header, method}) {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '拼命加载中...',
      })
      wx.request({
        url: config.baseUrl + url,
        data,
        header,
        method,
        success: (({statusCode,data:{code,msg,data:resDta}}) => {
          if (statusCode === 200 && code===1) {
            resolve(resDta)
            wx.hideLoading();
          } else {
            if (this.setErrorHandler != null) {
              wx.hideLoading();
              this.setErrorHandler({msg:statusCode !== 200? "网络错误请稍后重试！":msg})
            }
            reject(res)
          }
        }),
        fail: (res => {
          if (this.setErrorHandler != null) {
            wx.hideLoading();
            this.setErrorHandler({msg:'网络错误请稍后重试！'})
          }
          reject(res)
        })
      })
    })
  }
}

export default Axions