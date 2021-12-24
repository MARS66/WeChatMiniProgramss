// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk');
const dayjs = require('dayjs');
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
function sortArr(arr){
  let newarr=[...arr];
  for (let i = 0; i < newarr.length; i++) {
    for (let j = 0; j < newarr.length-1; j++) {
        if ( dayjs(newarr[j].birth).isAfter(dayjs(newarr[j+1].birth))) {
            let pre = newarr[j];
            newarr[j] = newarr[j+1];
            newarr[j+1] = pre;
        };
    };
};
return newarr;
};
// 将具有父子关系的数组转成树形数组
function coverArray (array = [], pidStr = 'pId', idStr = 'id', chindrenStr = 'children') {
    const coverArr = [];
    const hash = {};
    const arr = array.map((item) => {
      hash[item[idStr]] = { ...item };
      return hash[item[idStr]];
    });
    arr.forEach((item) => {
      const parentNode = hash[item[pidStr]];
      if (parentNode) {
        if (!parentNode[chindrenStr]) {
          parentNode[chindrenStr] = [];
        }
        parentNode[chindrenStr].push(item);
      } else {
        coverArr.push(item);
      }
    });
    return coverArr;
};
/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
 const {func, params,coll} = event;
  const db = cloud.database();
  const _ = db.command;
  const wxContext = cloud.getWXContext();
  const funcObj={
    // openid
    async getOpenid(){
      return wxContext.OPENID;
    },
    
    // 获取微信用户
    async getWeChatUser({familyId}){
      const {OPENID} = wxContext
      return await db.collection('wechat_user').where({_openid:OPENID, familyId}).get();
    },
    // 记录微信用户
    async addWeChatUser(user){
      const {OPENID} = wxContext
      return await db.collection('wechat_user').add({data:{ ...user,_openid:OPENID}})
    },
    
    // 加入/创建家族
    async joinOrCreated({familyType,code}){
      const {OPENID} = wxContext
      const {data} = await db.collection('family').where({familyType,code}).get();
      if (data.length) return data[0]._id;
      const res=  await db.collection('family').add({data:{familyType,code,creater:OPENID}})
      return res._id;
    },
    // 获取所有家庭成员
    async getAlluser(obj){
      const {total} = await db.collection('user').where(obj).count();
      if (total==0) {
        return false;
      }
      const MAX_LIMIT = 1000;
      // 承载所有读操作的 promise 的数组
      const tasks = [];
      // 计算需分几次取
      const batchTimes = Math.ceil(total / MAX_LIMIT);
      for (let i = 0; i < batchTimes; i++) {
        //get()操作返回的是Promise对象，每获取一个Promise就压栈进入tasks数组
        const promise = db.collection('user').where(obj).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
        tasks.push(promise)
      }
      return (await Promise.all(tasks)).reduce((acc, cur) => {
        return sortArr(acc.data.concat(cur.data));
      })
    },
    
    // 获取该家族所有微信用户
    async getAllWechatUser(obj){
      const {total} = await db.collection('wechat_user').where(obj).count();
      if (total==0) {
        return false;
      }
      const MAX_LIMIT = 1000;
      // 承载所有读操作的 promise 的数组
      const tasks = [];
      // 计算需分几次取
      const batchTimes = Math.ceil(total / MAX_LIMIT);
      for (let i = 0; i < batchTimes; i++) {
        //get()操作返回的是Promise对象，每获取一个Promise就压栈进入tasks数组
        const promise = db.collection('wechat_user').where(obj).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
        tasks.push(promise)
      }
      return (await Promise.all(tasks)).reduce((acc, cur) => {
        return sortArr(acc.data.concat(cur.data));
      })
    },
    // 获取家族信息通过家族名称
    async joinFamily({familyType}){
      const res = await db.collection(coll).where({familyType}).get();
      return res;
    },
    // 获取家谱树
    async getFamliyTree({familyId}){ 
      // const {data} = await db.collection('user').where({familyId}).limit(1000).get();
     const {data} = await this.getAlluser({familyId});
      if (data) {
       const newPerson = sortArr(data);
       return coverArray(newPerson, pidStr = 'pId', idStr = '_id', chindrenStr = 'children')[0];
      }
      return null
    },
    // 获取家族列表
    async getFamilyList({familyId}){
      // const {data} = await db.collection('user').where({familyId}).limit(1000).get();
     const {data} = await this.getAlluser({familyId});
     if (!data) {
      return [];  
    }
      const result = [];
      function listArr(arr){
        let keys=[];
        let sons=[]; 
        arr.forEach(item=>{
          sons = sons.concat(data.filter(i=> i.pId===item));
        });
        keys=keys.concat([...sons].map(item=>item._id));
        if (keys&&keys.length>0) result.push(sons)
        if (keys&&keys.length>0) listArr(keys);
      }
      listArr(['0']);
      return result;
    },
     // 搜索
     async search({keyword,familyId}){
      // const {data} = await db.collection('user').where({familyId}).limit(1000).get();
      const {data} = await this.getAlluser({familyId});
      if (!data) {
        return [];  
      }
      return data.filter(item=>{
        const str = item.yiwen+item.hanwen+item.job+item.province+item.city+item.county;
        const reg = new RegExp(keyword);
        return str.match(reg)
      });
    },
    // 微信用户查询
    async queryUser({keyword,familyId}){
      const {OPENID} = wxContext
     const {data} = await this.getAllWechatUser({familyId});
     const count=data.length;
     if (!data)  return{
      result:[],
      count,
      };  
     return {result:data.filter(item=>{
       const str = item.nickName;
       const reg = new RegExp(keyword);
       return str.match(reg)&&item._openid!==OPENID;
     }),
     count,
    };
   },
  //  递归删除人员
   async deleteP(_id,familyId) {
     await db.collection('user').where({_id}).remove();
    const  {data} = await db.collection('user').where({pId:_id,familyId}).get();
    const ids = data.map((item)=>item._id);
    if (ids.length>0) {
      ids.forEach(item=>{
       this.deleteP(item,familyId);
      })
    }
  },
     // 删除人员
     async deletePerson({_id,familyId}){
      let result = true;
      try {
        this.deleteP(_id,familyId);
      } catch (error) {
        result = false;
      }
      return result;
    },
    // 获取个人详情
    async getPerson({_id,familyId}){ 
      const {data} = await this.getAlluser({familyId});
      const person = {...data.filter(item=>_id===item._id)[0]};
      person.parents= {...data.filter(item=>person.pId===item._id)[0]};
      person.children= sortArr([...data.filter(item=>item.pId===person._id)]);
      person.peer= sortArr([...data.filter(item=>item.pId===person.pId)]);
      return  person
    },
    
    // 获取条形图数据
    async getbar({familyId}){ 
      // const {data} = await db.collection('user').where({familyId}).limit(1000).get();
    const {data} = await this.getAlluser({familyId});
    const reslut = [];
      if (!data)  return reslut;  
      const bar=['学生','毕摩','苏尼','公务员','事业编','民企','国企','自主创业','务农人员','其他'];
      bar.forEach(item=>{
        reslut.push(data.filter(j=>j.job===item).length)
      });
     return reslut;
   },
  // 获取男女比例
  async getGender({familyId}){ 
    // const {data} = await db.collection('user').where({familyId}).limit(1000).get();
    const {data} = await this.getAlluser({familyId});
    if (!data) {
      return [];  
    }
    const result=[];
    const men = data.filter(item=>item.isBoy==='true').length;
    const women = data.filter(item=>item.isBoy==='false').length;
    if (men) {
      result.push({
        name:'男',
        value: men
      })
    }
    if (women) {
      result.push({
        name:'女',
        value: women
      })
    }
    return result;
  },
  // 获取教育水平
  async getEducation({familyId}){ 
    // const {data} = await db.collection('user').where({familyId}).limit(1000).get();
    const {data} = await this.getAlluser({familyId});
    if (!data) {
      return [];  
    }
    const result=[];  
    const diplomas=['在读','小学','初中','高中','中专','大专','本科','硕士','博士'];
    diplomas.forEach((item)=>{
      result.push({
        name:item,
        value: data.filter(p=>p.diploma===item).length,
      });
    });
    return result;
  },
  // 获取人口分析
  async getPopulation({familyId}){
    const {data} = await this.getAlluser({familyId});
    if (!data) {
       return {};
     }
    const nowYear = dayjs().get("year");
    const digit=String(nowYear).charAt(3)
    const x=[String(nowYear)];
    const born = [];
    const death = [];
    const total =[];
    for (let index = 0; index < 10; index++) {
      const curDate = nowYear-Number(digit)-(index*10);
      x.unshift(String(curDate));
      total.unshift(data.filter(item=>item.isGone==='false'&& dayjs(item.birth).isBefore(dayjs(`${String(curDate)}-12-31`))).length);
      born.unshift(data.filter(item=>dayjs(item.birth.slice(0,4)).isBefore(dayjs(`${String(curDate)}-12-31`)) && dayjs(item.birth.slice(0,4)).isAfter(dayjs(`${String(curDate-10)}-12-31`))).length);
      death.unshift(data.filter(item=> item.isGone==='true'&& dayjs(item.death.slice(0,4)).isBefore(dayjs(`${String(curDate)}-12-31`)) && dayjs(item.death.slice(0,4)).isAfter(dayjs(`${String(curDate-10)}-12-31`))).length);
    }
    death.push(data.filter(item=>item.isGone==='true'&& dayjs(item.death.slice(0,4)).isBefore(dayjs()) && dayjs(item.death.slice(0,4)).isAfter(dayjs(`${String(nowYear-digit)}-12-31`))).length);
    born.push(data.filter(item=>dayjs(item.birth.slice(0,4)).isBefore(dayjs() && dayjs(item.birth.slice(0,4)).isAfter(dayjs(`${String(nowYear-digit)}-12-31`)))).length);
    total.push(data.filter(item=>item.isGone==='false'&& dayjs(item.birth.slice(0,4)).isBefore(dayjs())).length)
  const xAxis=  x.map((item,index,arr)=>{
      if (index===0) {
        return (Number(item.slice(2,4))-10)+'到'+item.slice(2,4);
      }
     return arr[index-1].slice(2,4) +'到'+item.slice(2,4)
    }
    );
    return {
      xAxis,
      born,
      total,
      death,
    };
  },

  // 获取全国分布
  async getScattered({familyId}){ 
    // const {data} = await db.collection('user').where({familyId}).limit(1000).get();
    const {data} = await this.getAlluser({familyId});
    const result=[];
   if (!data) {
    return result;
   }
    data.forEach(item=>{
      if (item.province&&!result.find(p=>p.name===item.province)) {
        result.push({
          name:item.province,
          value: data.filter(i=>i.province===item.province).length,
        })
      }
    })
    return result;
  },
  // 获取某个省的数据
  async getSichuan({familyId,province}){ 
    // const {data} = await db.collection('user').where({familyId,province}).limit(1000).get();
    const {data} = await this.getAlluser({familyId,province});
    const result=[];
    if (!data) {
      return result;
     }
    data.forEach(item=>{
      if (item.city&&!result.find(p=>p.name===item.city)) {
        result.push({
          name:item.city,
          value: data.filter(i=>i.city===item.city).length,
        })
      }
    })
    return result;
  },





};
  return funcObj[func](params);
}


