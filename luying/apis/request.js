
import config from '../config.js'
class Axions {
  constructor() {
    this._header = null
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