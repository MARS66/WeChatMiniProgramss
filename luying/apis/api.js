import Request from './request.js'
const  axions = new Request;
// 首页
export const getIndex=()=>{
  return axions.request({ 
    url: '/api/index/index',
    method: 'GET',
  })
}
// 获取客服
export const getKF=()=>{
  return axions.request({ 
    url: '/api/index/kf',
    method: 'GET',
  })
}
// 获取文章
export const getArticle=(url)=>{
  return axions.request({ 
    url: `/api/index/${url}`,
    method: 'GET',
  })
}
// 获取产品列表
export const getProduct=(data)=>{
  return axions.request({ 
    url: '/api/jjgl/index',
    method: 'POST',
    data: data,
  })
}
// 获取产品列表
export const getProductDetail=(id)=>{
  return axions.request({ 
    url: '/api/jjgl/details',
    method: 'POST',
    data: {
      id,
    },
  })
}
// 微信登录
export const wxlogin=(code)=>{
  return axions.request({ 
    url: '/api/user/third',
    method: 'POST',
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: {
      platform:'微信',
      code,
    },
  })
}