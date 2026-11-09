export type ConsultationStatus = 'pending' | 'following' | 'won' | 'invalid';
export interface ConsultationInput { name:string; phone:string; company?:string; expectedSeats?:number|null; needs?:string }
export interface Followup { at:string; actor:string; note:string; status:ConsultationStatus; ownerId:string }
export interface Consultation extends ConsultationInput {
  id:string; submittedAt:string; status:ConsultationStatus; ownerId:string; updatedAt:string;
  enterpriseId:string; history:Followup[];
}
export interface ConsultationData { version:1; records:Consultation[]; formUrl:string }
export const consultationLabels:Record<ConsultationStatus,string>={pending:'待联系',following:'跟进中',won:'已成交',invalid:'无效咨询'};
export const consultationColors:Record<ConsultationStatus,string>={pending:'orange',following:'blue',won:'green',invalid:'default'};
export function cleanConsultationInput(input:ConsultationInput):ConsultationInput {
  const name=input.name?.trim()||'',phone=input.phone?.trim()||'';
  if(!name||name.length>30)throw new Error('请填写姓名，最多 30 个字');
  if(!/^1[3-9]\d{9}$/.test(phone))throw new Error('请填写有效的 11 位手机号');
  if(input.expectedSeats!=null&&(!Number.isInteger(input.expectedSeats)||input.expectedSeats<1||input.expectedSeats>100000))throw new Error('预计账号数须为 1～100000 的整数');
  if((input.company||'').length>60)throw new Error('企业名称最多 60 个字');
  if((input.needs||'').length>1000)throw new Error('需求描述最多 1000 个字');
  return {name,phone,company:input.company?.trim()||'',expectedSeats:input.expectedSeats??null,needs:input.needs?.trim()||''};
}
export function addConsultation(records:Consultation[],input:ConsultationInput,id:string,at:string):Consultation[] {
  if(records.some(r=>r.id===id))return records;
  if(!id)throw new Error('缺少提交凭据，请刷新页面');
  const clean=cleanConsultationInput(input);
  return [{...clean,id,submittedAt:at,status:'pending',ownerId:'',updatedAt:at,enterpriseId:'',history:[]},...records];
}
export function followConsultation(record:Consultation,change:{status:ConsultationStatus;ownerId:string;note:string},actor:string,at:string):Consultation {
  if(!Object.hasOwn(consultationLabels,change.status))throw new Error('请选择有效跟进状态');
  if(record.enterpriseId&&change.status!=='won')throw new Error('已开通企业的咨询保持已成交状态');
  if(!change.note.trim()||change.note.length>1000)throw new Error('请填写跟进内容，最多 1000 个字');
  return {...record,status:change.status,ownerId:change.ownerId,updatedAt:at,history:[{...change,note:change.note.trim(),actor,at},...record.history]};
}
export function assertCanOpenEnterprise(record:Consultation){
  if(record.enterpriseId)throw new Error('该咨询已关联企业，请查看现有企业');
  if(record.status!=='won')throw new Error('请先确认成交，再开通企业');
}
export function linkConsultation(record:Consultation,enterpriseId:string):Consultation {
  assertCanOpenEnterprise(record);
  return {...record,enterpriseId};
}
export function validFormUrl(value:string){
  try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)&&!!url.hostname&&!url.username&&!url.password;}catch{return false;}
}
export const formatConsultationTime=(value:string)=>new Date(value).toLocaleString('zh-CN',{hour12:false});
