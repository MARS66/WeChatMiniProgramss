// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    env: cloud.DYNAMIC_CURRENT_ENV
  }
)

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command
 const {total} = await db.collection('family').count()
 const MAX_LIMIT = 1000
  // 计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    //get()操作返回的是Promise对象，每获取一个Promise就压栈进入tasks数组
    const promise = db.collection('family').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  const families= (await Promise.all(tasks)).reduce((acc, cur) => {
    return acc.data.concat(cur.data);
  })
 const clears = families.data.filter(item=>item.logs&&item.logs.length>100);
 clears.forEach(element => {
  const logs=element.logs.splice(99,element.logs.length-100);
  db.collection('family').doc(element._id).update({
    data: {
      logs,
    }
  })
 });
}