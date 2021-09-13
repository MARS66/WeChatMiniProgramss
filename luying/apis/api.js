import Request from './request.js'
const  axions = new Request;
// 首页
export const getIndex=(data)=>{
  return axions.request({ 
    url: '/index',
    method: 'GET',
    data,
  })
}

export const getProduct=(data)=>{
  return axions.request({ 
    url: '/index',
    method: 'POST',
    data: data,
  })
}