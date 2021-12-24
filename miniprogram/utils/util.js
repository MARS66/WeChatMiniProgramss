const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

  // 填写日志
  const  setLog=(params)=>{
    const time= new Date().getTime();
    const {familyId,nickName,avatarUrl}=wx.getStorageSync('user');
    const db = wx.cloud.database();
    db.collection('logs').add({data:{
      familyId,
      nickName,
      formatTime:formatTime(new Date()),
      avatarUrl,
      time,
      ...params
    }})
  };

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
};

module.exports = {
  formatTime,
  setLog,
}
