
import config from '../config.js'
class Axions {
  constructor() {
    this._header = {
      'content-type': 'application/json'
    }
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
      wx.request({
        url: config.baseUrl + url,
        data,
        header,
        method,
        success: (res => {
          if (res.statusCode === 200) {
            //200: 服务端业务处理正常结束
            resolve(res)
          } else {
            //其它错误，提示用户错误信息
            if (this.setErrorHandler != null) {
            //如果有统一的异常处理，就先调用统一异常处理函数对异常进行处理
              this.setErrorHandler(res)
            }
            reject(res)
          }
        }),
        fail: (res => {
          if (this.setErrorHandler != null) {
            this.setErrorHandler({msg:'网络错误请稍后重试！'})
          }
          reject(res)
        })
      })
    })
  }
}

export default Axions