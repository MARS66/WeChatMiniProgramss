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
  const _ = db.command;
  async function  query(collection){
  const {total} = await db.collection(collection).count();
   if (total===0) return {data:[]};
    const MAX_LIMIT = 1000
     // 计算需分几次取
     const batchTimes = Math.ceil(total / MAX_LIMIT)
     // 承载所有读操作的 promise 的数组
     const tasks = []
     for (let i = 0; i < batchTimes; i++) {
       //get()操作返回的是Promise对象，每获取一个Promise就压栈进入tasks数组
       const promise = db.collection(collection).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
       tasks.push(promise)
     }
    return  (await Promise.all(tasks)).reduce((acc, cur) => {
       return acc.data.concat(cur.data);
     })
  }
  
 async function  deleteEmptys(_id){
  const {total} = await db.collection('user').where({familyId:_id}).count();
  if (total<1) db.collection('family').where({_id}).remove();
 }

//  删除一月以上的操作记录
const {data:logs}= await query('logs');
for (let index = 0; index < logs.length; index++) {
   const {time,_id} = logs[index];
   if (dayjs(time).isBefore(dayjs().subtract(30, 'date'))) {
    db.collection('logs').where({_id}).remove();
   }
 }
//  删除空家族
const {data:emptys}= await query('family');
 for (let index = 0; index < emptys.length; index++) {
   const {_id} = emptys[index];
   deleteEmptys(_id);
 }
}