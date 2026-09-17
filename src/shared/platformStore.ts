import { useSyncExternalStore } from 'react';
import { salesAccounts, aiSalesSeatLicense } from '../data/appData';
import { assignSeats, Enterprise, License, Operator, PlatformData, serviceStatus, syncLicense, todayString, validateLicense, WecomAccount } from './platformDomain';

const STORAGE_KEY = 'sabuddy-platform-demo-v1';
export const DEFAULT_ENTERPRISE_ID = 'ent-xinghe';
const subscribers = new Set<() => void>();
let cache: PlatformData | undefined;
export const uid = (prefix:string) => `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
const time = () => new Date().toLocaleString('zh-CN',{hour12:false});
export function makeAccounts(id:string, count=12): WecomAccount[] {
  return Array.from({length:count},(_,i) => ({key:`${id}-wecom-${i+1}`,name:`${['销售顾问','客户顾问','服务顾问'][i%3]}${String(i+1).padStart(2,'0')}`,wecom:`demo_${id.slice(-6)}_${i+1}`,wecomId:String(i+1),department:i%3===0?'客户服务部':'销售部',assignedUser:'',accountRole:'普通员工',role:'销售',channel:'句子通道已连接',online:i%4!==3,aiSeatEnabled:false,hosted:false,customerTotal:0,hostedCustomers:0,syncedAt:time()}));
}
function seed():PlatformData {
  const start=todayString();
  const relative=(days:number)=>{const d=new Date(`${start}T12:00:00`);d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const company=(id:string,name:string,total:number,used:number,status:License['status'],end:string,industry:string):Enterprise=>{
    const license:License={total,startsAt:relative(-45),expiresAt:end,status};
    return {id,name,industry,contact:'张经理',phone:'13800008888',note:'演示企业 · 线下签约后开通',adminName:'张经理',adminLogin:`${id.replace('ent-','')}_admin`,demoPassword:'demo123456',activated:false,license,appliedLicense:{...license},accounts:makeAccounts(id,Math.max(used+4,12)).map((a,i)=>({...a,aiSeatEnabled:i<used,hosted:i<used,aiSeatOpenedAt:i<used?relative(-30):'',assignedUser:i<used?'企业管理员':''})),createdAt:relative(-45),syncedAt:time(),revision:1,appliedRevision:1};
  };
  const primary=company(DEFAULT_ENTERPRISE_ID,'星河教育科技',aiSalesSeatLicense.total,10,'active',aiSalesSeatLicense.expiresAt,'教育培训');
  primary.accounts=structuredClone(salesAccounts);
  primary.adminLogin='3';
  primary.adminName='企业管理员';
  primary.activated=true;
  const entries=[primary,company('ent-qiming','启明科技',20,18,'active',relative(16),'企业服务'),company('ent-yuanhang','远航咨询',5,0,'draft',relative(365),'咨询服务'),company('ent-yunshan','云杉生活服务',15,9,'active',relative(180),'本地生活'),company('ent-mingde','明德成长中心',8,6,'active',relative(-5),'教育培训'),company('ent-anhe','安禾健康管理',10,4,'suspended',relative(90),'健康服务')];
  return {version:1,enterprises:entries,operators:[{id:'op-admin',name:'平台管理员',login:'admin',password:'demo123456',role:'admin',enabled:true},{id:'op-ops',name:'运营专员',login:'operator',password:'demo123456',role:'operator',enabled:true}],logs:entries.map(c=>({id:uid('log'),at:time(),actor:'平台管理员',companyId:c.id,company:c.name,action:'初始化演示企业',detail:`授权 ${c.license.total} 席 · ${c.license.expiresAt} 到期`}))};
}
export function getPlatformData():PlatformData {
  if (cache) return cache;
  try {
    const raw=typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY):null;
    if(raw){const data=JSON.parse(raw);if(data.version===1 && Array.isArray(data.enterprises) && Array.isArray(data.operators) && Array.isArray(data.logs)) return cache=data;}
  } catch { /* 旧的或不可用的演示缓存回退至初始数据。 */ }
  cache=seed();
  if(typeof localStorage!=='undefined') {try{localStorage.setItem(STORAGE_KEY,JSON.stringify(cache));}catch{ /* 读取仍可使用初始数据，写入会报告错误。 */ }}
  return cache;
}
function emit(){subscribers.forEach(fn=>fn());}
if(typeof window!=='undefined') window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY||event.key===null){cache=undefined;emit();}});
export function usePlatformData(){return useSyncExternalStore(fn=>{subscribers.add(fn);return()=>{subscribers.delete(fn);};},getPlatformData,getPlatformData);}
export function updateData(action:(data:PlatformData)=>PlatformData){
  cache=undefined;
  const next=action(structuredClone(getPlatformData()));
  if(typeof localStorage!=='undefined') localStorage.setItem(STORAGE_KEY,JSON.stringify(next));
  cache=next;emit();
}
function log(data:PlatformData,company:Enterprise|undefined,actor:string,action:string,detail:string){data.logs.unshift({id:uid('log'),at:time(),actor,action,detail,companyId:company?.id||'',company:company?.name||'平台'});}
export function changeEnterprise(id:string,actor:string,action:string,detail:string,update:(company:Enterprise)=>Enterprise){
  updateData(data=>{const index=data.enterprises.findIndex(c=>c.id===id);if(index<0)throw new Error('企业不存在');const next=update(data.enterprises[index]);data.enterprises[index]=next;log(data,next,actor,action,detail);return data;});
}
export function createEnterprise(input:Omit<Enterprise,'id'|'appliedLicense'|'accounts'|'createdAt'|'syncedAt'|'revision'|'appliedRevision'|'demoPassword'|'activated'>,actor:string){
  const id=uid('ent');
  updateData(data=>{
    if(data.enterprises.some(c=>c.name.trim()===input.name.trim())) throw new Error('该企业名称已存在');
    validateLicense(input.license,[]);
    const company:Enterprise={...input,name:input.name.trim(),id,accounts:[],createdAt:time(),syncedAt:'尚未同步',revision:1,appliedRevision:0,demoPassword:'demo123456',activated:false,appliedLicense:{...input.license,total:0,status:'draft'}};
    data.enterprises.unshift(company);log(data,company,actor,input.license.status==='draft'?'保存待开通企业':'开通企业',`授权 ${input.license.total} 席，等待企业端同步`);return data;
  });return id;
}
export function configureLicense(id:string,license:License,actor:string,reason:string){
  changeEnterprise(id,actor,'变更服务授权',reason,c=>{validateLicense(license,c.accounts);return {...c,license:{...license},revision:c.revision+1};});
}
export function applyLicense(id:string,actor:string){changeEnterprise(id,actor,'模拟同步授权','企业端已接收最新服务状态、席位额度和有效期',syncLicense);}
export function changeSeats(id:string,keys:string[],enabled:boolean){changeEnterprise(id,'企业管理员',enabled?'分配托管席位':'释放托管席位',`${keys.length} 个企微账号`,c=>assignSeats(c,keys,enabled));}
export function updateEnterpriseAccounts(id:string,updater:(rows:WecomAccount[])=>WecomAccount[],detail='更新企微账号配置'){
  changeEnterprise(id,'企业管理员','配置企微账号',detail,c=>{const accounts=updater(c.accounts);validateLicense(c.appliedLicense,accounts);if(!['active','expiring'].includes(serviceStatus(c.appliedLicense)) && accounts.some((a,i)=>a.hosted&&!c.accounts[i]?.hosted))throw new Error('当前企业服务不可用，无法开启 AI');return {...c,accounts};});
}
export const selectedEnterpriseId=()=>typeof window==='undefined'||!window.location?DEFAULT_ENTERPRISE_ID:new URLSearchParams(window.location.search).get('enterprise')||DEFAULT_ENTERPRISE_ID;
export const enterpriseUrl=(id:string)=>`./index.html?enterprise=${encodeURIComponent(id)}#wecomAccounts`;
export function saveOperator(operator:Operator,actor:string){updateData(data=>{if(data.operators.some(o=>o.id!==operator.id&&o.login===operator.login))throw new Error('登录账号已存在');const i=data.operators.findIndex(o=>o.id===operator.id);if(i<0)data.operators.push(operator);else data.operators[i]=operator;log(data,undefined,actor,'更新平台账号',`${operator.name} · ${operator.enabled?'启用':'停用'}`);return data;});}
