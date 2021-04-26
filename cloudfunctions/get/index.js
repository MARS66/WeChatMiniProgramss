// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk');
const dayjs = require('dayjs')
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
function sortArr(arr){
  let newarr=[...arr];
  console.log(newarr);
  for (let i = 0; i < newarr.length; i++) {
    for (let j = 0; j < newarr.length-1; j++) {
      console.log(newarr[j].birth);
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
  const _ = db.command
  const wxContext = cloud.getWXContext();
  const funcObj={
    // openid
    async getOpenid(){
      return wxContext.OPENID;
    },
    // checkAuth
    async checkAuth({familyId}){
      const {OPENID} = wxContext
      const {data} = await db.collection('user').where({bindId:OPENID,familyId}).get();
      const result = data.length>0;
      return result;
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
     // 删除人员
     async deletePerson({_id,familyId}){
      const {OPENID} = wxContext
      const {data:user} = await db.collection('user').where({bindId:OPENID}).get();
      // const {data} = await db.collection('user').where({familyId}).limit(1000).get();
      const {data} = await this.getAlluser({familyId});
      if (!data) {
        return false;  
      }
      const deletedP= data.filter(item=>item._id===_id)[0];
      const date =new Date();
      const str=date.toLocaleString()+'----'+ user[0].yiwen+user[0].hanwen+'---删除了'+deletedP.yiwen+deletedP.hanwen+'支系';
      function deleteP(_id) {
        const ids=  data.filter((item)=>item.pId===_id).map((item)=>item.id);
        try {
          db.collection('user').where({pId:_id}).remove();
        } catch (error) {
          console.log(error);
        } 
        if (ids.length>0) {
          ids.forEach(item=>{
            deleteP(item);
          })
        }
        try {
          db.collection('user').where({_id}).remove();  
        } catch (error) {
          console.log(error);
        } 
      }
      let result = true;
      try {
      deleteP(_id);
      } catch (error) {
        result = false;
      }
      db.collection('family').doc(familyId).update({
        data: {
          logs: _.unshift(str)
        }
      })
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
    // 获取我的
    async getMyCard({_id,familyId}){ 
      // const {data} = await db.collection('user').where({familyId}).limit(1000).get();
    const {data} = await this.getAlluser({familyId});
    if (!data) {
      return [];  
    }
      const {data:familyRoot} = await db.collection('family').where({_id:familyId}).get();
      const fs=[];
      function getF(pId){
        const f= data.find(item=> item._id===pId);
        if (f) {
          const {yiwen,hanwen}=f;
          fs.unshift({yiwen,hanwen});
          getF(f.pId);
        }
      };
      getF(_id);
      return {puyuan:familyRoot[0].familyRoot.concat([...fs].splice(1)),sort:fs.length};
    },
    // 获取条形图数据
    async getbar({familyId}){ 
      // const {data} = await db.collection('user').where({familyId}).limit(1000).get();
    const {data} = await this.getAlluser({familyId});
    if (!data) {
      return [];  
    }
      const reslut = [];
      const bar=['学生','教师','医生','警察','毕摩','苏尼','务农','公务员','事业单位','私企职员','国企职员','自由职业','自主创业'];
     bar.forEach(item=>{reslut.push(data.filter(j=>j.job===item).length)}
     );
     reslut.push(10)
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
    const diplomas=['在读','小学','初中','高中','中专','大专','本科','研究生','博士生'];
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


