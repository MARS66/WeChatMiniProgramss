
import {setLog} from '../../utils/util.js';
let that= null;
Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    header:1,
    alignIndex:1,
    colorIndex:1,
    colors:['#000','#f20c00','#f2be45','#606266'],
    align:['left' ,'center' , 'right' ,'justify'],
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    const {alignIndex,colors,colorIndex}=this.data;
    switch (name) {
      case 'header':
          that.loopStatus(name,value,6)
        break;

        case 'align':
          that.loopStatus('alignIndex',alignIndex,4)
        break;

        case 'color':
          that.loopStatus('colorIndex',colorIndex,colors.length);
          value=colors[colorIndex];
        break;
      default:
        break;
    }
    this.editorCtx.format(name, value)
  },
//  样式循环控制
  loopStatus(key,value,max){
    if (value===max) {
      this.setData({ [key]:1});
    }else{
      this.setData({ [key]: value+1 });
    }
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context;
      that.setContents()
    }).exec()
  },
  // 设置数据
  async setContents(){
    const {familyId}=wx.getStorageSync('user') 
    const db = wx.cloud.database();
    const {data} = await db.collection('family').where({_id:familyId}).get();
    this.editorCtx.setContents({
      html: data[0]?.info
    })
  },
  blur() {
    this.editorCtx.blur()
  },
// 
  editorCtxComen(e) {
    console.log(e);
    let { funcname } = e.currentTarget.dataset
    if (!funcname) return;
    this.editorCtx[funcname]();
  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },

  insertDivider() {
    this.editorCtx.insertDivider()
  },
  // 清除内容
  clear() {
    this.editorCtx.clear()
  },
  // 清除样式
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  // 插入时间
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  // 插入图片
  insertImage() {
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '80%',
        })
      }
    })
  },

  // 提交数据
  submitFamilyInfo(){
    this.editorCtx.getContents({
      success({html}){
        that.undateFamily(html)
      }
    })
  },
  // 更新库中的数据
  async undateFamily(info){
    const {familyId,nickName}=wx.getStorageSync('user') 
    const db = wx.cloud.database();
    const  {errMsg} = await db.collection('family').doc(familyId).update({ 
      data: { 
        info,
    } });
   if (errMsg==="document.update:ok") {
      wx.showToast({
        title: '修改成功!',
        icon:'success',
        success(){
          
          setLog({
            type:'update',
            text:'修改了家族简介',
          });
          wx.navigateBack({
            delta: 1,
          })
        }
      })
   }else{
    wx.showToast({
      title: '网络异常请稍后重试!',
      icon:'error'
    })
   }
  }
})
