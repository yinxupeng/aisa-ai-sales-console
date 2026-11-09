import {useSyncExternalStore} from 'react';
import {addConsultation,Consultation,ConsultationData,ConsultationInput,ConsultationStatus,followConsultation,linkConsultation,validFormUrl} from './consultationDomain';
const KEY='sabuddy-consultations-v1';
let cache:ConsultationData|undefined;
const listeners=new Set<()=>void>();
const empty=():ConsultationData=>({version:1,records:[],formUrl:''});
export function getConsultationData():ConsultationData{
  if(cache)return cache;
  if(typeof localStorage!=='undefined'){
    const raw=localStorage.getItem(KEY);
    if(raw){const data=JSON.parse(raw);if(data.version!==1||!Array.isArray(data.records))throw new Error('咨询数据格式异常，请保留浏览器数据并联系管理员');return cache=data;}
  }
  return cache=empty();
}
function emit(){listeners.forEach(fn=>fn());}
if(typeof window!=='undefined')window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null){cache=undefined;emit();}});
export function useConsultationData(){return useSyncExternalStore(fn=>{listeners.add(fn);return()=>{listeners.delete(fn);};},getConsultationData,getConsultationData);}
export function updateConsultations(fn:(data:ConsultationData)=>ConsultationData){
  cache=undefined;const next=fn(structuredClone(getConsultationData()));
  if(typeof localStorage==='undefined')throw new Error('当前环境无法保存咨询');
  localStorage.setItem(KEY,JSON.stringify(next));cache=next;emit();
}
export function submitConsultation(input:ConsultationInput,id:string){updateConsultations(data=>({...data,records:addConsultation(data.records,input,id,new Date().toISOString())}));}
export function saveFollowup(id:string,change:{status:ConsultationStatus;ownerId:string;note:string},actor:string){
  updateConsultations(data=>{const record=data.records.find(r=>r.id===id);if(!record)throw new Error('咨询记录不存在');return {...data,records:data.records.map(r=>r.id===id?followConsultation(r,change,actor,new Date().toISOString()):r)};});
}
export function connectConsultation(id:string,enterpriseId:string){
  updateConsultations(data=>({...data,records:data.records.map(r=>r.id===id?(r.enterpriseId===enterpriseId?r:linkConsultation(r,enterpriseId)):r)}));
}
export function saveConsultationUrl(value:string){
  const url=value.trim();if(url&&!validFormUrl(url))throw new Error('请输入有效的 http 或 https 表单链接');
  updateConsultations(data=>({...data,formUrl:url}));
}
export const defaultConsultationUrl=()=>typeof window==='undefined'?'':new URL('./consultation.html',window.location.href).href;
export function getLatestConsultation(id:string):Consultation|undefined {cache=undefined;return getConsultationData().records.find(r=>r.id===id);}
