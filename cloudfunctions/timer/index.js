// 云函数入口文件
const cloud = require('wx-server-sdk');
const dayjs = require('dayjs');

cloud.init(
  {
    env: cloud.DYNAMIC_CURRENT_ENV
  }
)

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const _ = db.command
 const {total} = await db.collection('logs').count()
 const MAX_LIMIT = 1000
  // 计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    //get()操作返回的是Promise对象，每获取一个Promise就压栈进入tasks数组
    const promise = db.collection('logs').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  const logs= (await Promise.all(tasks)).reduce((acc, cur) => {
    return acc.data.concat(cur.data);
  })
  if (logs.length===0) return;
 for (let index = 0; index < logs.length; index++) {
   const {time,_id} = logs[index];
   if (dayjs(time).isBefore(dayjs().subtract(30, 'date'))) {
    db.collection('logs').where({_id}).remove();
   }
 }
}