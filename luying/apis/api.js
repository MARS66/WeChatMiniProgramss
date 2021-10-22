import Request from './request.js'
const  axions = new Request;
// 首页
export const getIndex=(loading)=>{
  return axions.request({ 
    url: '/api/index/index',
    method: 'GET',
    loading,
  })
}
// 获取客服
export const getKF=()=>{
  return axions.request({ 
    url: '/api/index/kf',
    method: 'GET',
    loading: true,
  })
}
// 获取文章
export const getArticle=(url)=>{
  return axions.request({ 
    url: `/api/index/${url}`,
    method: 'GET',
    loading: true,
  })
}
// 获取产品列表
export const getProduct=(data,loading)=>{
  return axions.request({ 
    url: '/api/jjgl/index',
    method: 'POST',
    data: data,
    loading,
  })
}
// 获取新闻资讯列表
export const getNews=(data,loading)=>{
  return axions.request({ 
    url: '/api/xwzx/index',
    method: 'POST',
    loading,
    data: data,
  })
}
// 获取我的产品列表
export const getMyProduct=(data)=>{
  return axions.request({ 
    url: '/api/jjgl/my_cp',
    method: 'POST',
    data: data,
    loading: true,
  })
}

// 获取我的预约列表
export const getMyBooked=(data)=>{
  return axions.request({ 
    url: '/api/jjgl/my_yylb',
    method: 'POST',
    data: data,
    loading: true,
  })
}
// 获取产品详情
export const getProductDetail=(id,url='/api/jjgl/details')=>{
  return axions.request({ 
    url,
    method: 'POST',
    loading: true,
    data: {
      id,
    },
  })
}
//  我的 足迹/收藏 列表 

export const historyOrFav0rites=(data)=>{
  return axions.request({ 
    url: '/api/jjgl/my_sclb',
    method: 'POST',
    loading: true,
    data,
  })
}
// 产品收藏
export const collectPoduct=(id)=>{
  return axions.request({ 
    url: '/api/jjgl/sc',
    method: 'POST',
    loading: false,
    data: {
      id,
    },
  })
}
// 预约产品
export const bookProduct=(data)=>{
  return axions.request({ 
    url: '/api/jjgl/yy',
    method: 'POST',
    loading: true,
    data,
  })
}

// 获取资讯详情
export const getNewsDetail=(id)=>{
  return axions.request({ 
    url: '/api/xwzx/details',
    method: 'POST',
    loading: true,
    data:{
      id
    },
  })
}
// 微信登录
export const wxlogin=(code)=>{
  return axions.request({ 
    url: '/api/user/third',
    method: 'POST',
    loading: true,
    data: {
      platform:'微信',
      code,
    },
  })
}

// 获取用户信息
export const getUserInfo=(loading=true)=>{
  return axions.request({ 
    url: '/api/user/index',
    method: 'GET',
    loading,
  })
}
export const updateUserInfo=(data)=>{
  return axions.request({ 
    url: '/api/user/profile',
    method: 'post',
    loading: true,
    data:{
      ...data,
      tip:'正在更新用户信息...'
    },
  })
}