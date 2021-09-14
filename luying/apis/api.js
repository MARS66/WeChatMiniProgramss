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
export const getProduct=(data)=>{
  return axions.request({ 
    url: '/index',
    method: 'POST',
    data: data,
  })
}