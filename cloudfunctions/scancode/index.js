// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {scene, fileName} = event;
  async function getQrCode(scene, fileName) {
    try {
        var fileName = 'qrcode/' + fileName + '.png';
        const result = await cloud.openapi.wxacode.getUnlimited({
            scene: scene,
            is_hyaline:true,
            env_version:'release',
            check_path: true,
            page: 'pages/home/index'
        })
        if (result && result.buffer) {
            var res = await cloud.uploadFile({
                cloudPath: fileName,
                fileContent: result.buffer,
            })
            if (res.fileID) {
                return res.fileID
            }
        }
        return false
    } catch (err) {
        console.error(err)
        return false
    }
}
const  qrcode=await getQrCode(scene, fileName);
  return {
    qrcode
  }
}