import React, { useEffect, useState } from 'react';
import { Alert, App, Button, Card, Col, Descriptions, Drawer, Form, Input, InputNumber, Modal, Result, Row, Select, Space, Steps, Tag, Typography } from 'antd';
import { CheckCircleOutlined, CopyOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Enterprise, License, seatUsage, serviceStatus, statusColors, statusLabels, todayString } from '../shared/platformDomain';
import { configureLicense, createEnterprise, enterpriseUrl } from '../shared/platformStore';

export const { Text, Title, Paragraph } = Typography;
export function ServiceTag({company}:{company:Enterprise}){const s=serviceStatus(company.license);return <Tag color={statusColors[s]}>{statusLabels[s]}</Tag>;}
export function SyncTag({company}:{company:Enterprise}){return <Tag bordered={false} color={company.revision===company.appliedRevision?'success':'warning'}>{company.revision===company.appliedRevision?'已生效':'待同步'}</Tag>;}
export function SeatMeter({company}:{company:Enterprise}){const used=seatUsage(company).used;const total=company.license.total;return <div className="po-seat-meter"><div><b>{used}</b><span> / {total} 席</span></div><div className="po-meter-track"><i style={{width:`${total?Math.min(100,used/total*100):0}%`,background:used>=total?'#e69c35':'#3978e9'}} /></div></div>;}
export function Metrics({items}:{items:{label:string;value:React.ReactNode;hint?:string;icon?:React.ReactNode}[]}){return <div className="po-metrics">{items.map(item=><Card key={item.label}><div className="po-metric-label">{item.label}{item.icon}</div><div className="po-metric-value">{item.value}</div>{item.hint&&<div className="po-metric-hint">{item.hint}</div>}</Card>)}</div>;}
export function Delivery({company,onClose}:{company:Enterprise|null;onClose:()=>void}){
  const {message}=App.useApp();
  if(!company)return null;
  const link=new URL(enterpriseUrl(company.id),window.location.href).href;
  const content=`企业：${company.name}\n企业管理端：${link}\n管理员账号：${company.adminLogin}\n初始演示密码：demo123456（首次登录设置新密码）\n授权席位：${company.license.total}\n服务期限：${company.license.startsAt} 至 ${company.license.expiresAt}`;
  return <Modal open title="企业交付信息" onCancel={onClose} footer={<Space><Button onClick={onClose}>关闭</Button><Button icon={<CopyOutlined/>} onClick={async()=>{try{await navigator.clipboard.writeText(content);message.success('交付信息已复制');}catch{message.info('请选中下方信息手动复制');}}}>复制交付信息</Button><Button type="primary" href={link} target="_blank" rel="noreferrer">打开企业端</Button></Space>} width={640}>
    <Result status="success" title={`${company.name}已${company.license.status==='draft'?'保存':'开通'}`} subTitle="先完成授权同步，再交付给企业管理员。" className="po-small-result"/>
    <Alert type="info" showIcon title="本页为演示交付信息，未发送真实短信或邮件。"/>
    <pre className="po-delivery-text">{content}</pre>
  </Modal>;
}
const nextYear=()=>`${Number(todayString().slice(0,4))+1}${todayString().slice(4)}`;
export function EnterpriseWizard({open,onClose,onCreated,actor}:{open:boolean;onClose:()=>void;onCreated:(id:string)=>void;actor:string}){
  const [step,setStep]=useState(0);const [form]=Form.useForm();const {message}=App.useApp();
  useEffect(()=>{if(open){setStep(0);form.resetFields();}},[open,form]);
  const fields=[['name','industry','contact','phone'],['adminName','adminLogin'],['total','startsAt','expiresAt']];
  const next=async()=>{try{await form.validateFields(fields[step]);setStep(step+1);}catch{/* Form renders errors. */}};
  const submit=async(status:License['status'])=>{try{await form.validateFields();const v=form.getFieldsValue(true);const id=createEnterprise({name:v.name.trim(),industry:v.industry,contact:v.contact.trim(),phone:v.phone,note:v.note||'',adminName:v.adminName.trim(),adminLogin:v.adminLogin.trim(),license:{total:v.total,startsAt:v.startsAt,expiresAt:v.expiresAt,status}},actor);onClose();onCreated(id);message.success(status==='draft'?'企业已保存，等待开通':'企业已开通，等待授权同步');}catch(e){if(e instanceof Error)message.error(e.message);}};
  return <Drawer title="新增企业" width={620} open={open} onClose={onClose} footer={<div className="po-drawer-footer"><Button onClick={onClose}>取消</Button><Space>{step>0&&<Button onClick={()=>setStep(step-1)}>上一步</Button>}{step<2?<Button type="primary" onClick={next}>下一步</Button>:<><Button onClick={()=>submit('draft')}>保存待开通</Button><Button type="primary" onClick={()=>submit('active')}>确认开通</Button></>}</Space></div>}>
    <Steps current={step} size="small" items={[{title:'企业信息'},{title:'企业管理员'},{title:'服务配置'}]} className="po-wizard-steps"/>
    <Form form={form} layout="vertical" initialValues={{industry:'教育培训',total:10,startsAt:todayString(),expiresAt:nextYear()}} requiredMark="optional">
      <div style={{display:step===0?'block':'none'}}><Title level={4}>录入签约企业</Title><Paragraph type="secondary">用于服务开通、日常联系与交付跟进。</Paragraph><Form.Item name="name" label="企业名称" rules={[{required:true,whitespace:true,message:'请输入企业名称'}]}><Input placeholder="请输入企业完整名称" maxLength={60}/></Form.Item><Form.Item name="industry" label="所属行业" rules={[{required:true}]}><Select options={['教育培训','咨询服务','企业服务','本地生活','健康服务','其他'].map(value=>({value,label:value}))}/></Form.Item><Row gutter={16}><Col span={12}><Form.Item name="contact" label="联系人" rules={[{required:true,whitespace:true,message:'请输入联系人'}]}><Input placeholder="例如：张经理" maxLength={20}/></Form.Item></Col><Col span={12}><Form.Item name="phone" label="联系电话" rules={[{required:true,message:'请输入联系电话'},{pattern:/^[\d+()\-\s]{7,20}$/,message:'请输入有效联系电话'}]}><Input placeholder="手机号或固定电话" maxLength={20}/></Form.Item></Col></Row><Form.Item name="note" label="备注"><Input.TextArea rows={3} maxLength={300} showCount placeholder="补充签约或交付注意事项"/></Form.Item></div>
      <div style={{display:step===1?'block':'none'}}><Title level={4}>设置初始管理员</Title><Paragraph type="secondary">企业管理员可在自己的管理端分配席位、配置员工及运营业务。</Paragraph><Form.Item name="adminName" label="管理员姓名" rules={[{required:true,whitespace:true,message:'请输入管理员姓名'}]}><Input placeholder="请输入管理员姓名" maxLength={20}/></Form.Item><Form.Item name="adminLogin" label="登录账号" rules={[{required:true,message:'请输入登录账号'},{pattern:/^[A-Za-z0-9_]{3,30}$/,message:'使用 3～30 位字母、数字或下划线'}]}><Input placeholder="例如：xinghe_admin" autoComplete="off"/></Form.Item><Alert type="info" showIcon title="首次登录激活" description="交付初始演示密码 demo123456。企业管理员首次登录时设置新密码；可在企业详情中重置激活。"/></div>
      <div style={{display:step===2?'block':'none'}}><Title level={4}>配置服务授权</Title><Paragraph type="secondary">一个托管席位对应一个企微账号，企业自行分配。</Paragraph><Form.Item name="total" label="托管席位数" rules={[{required:true,message:'请输入席位数'}]}><InputNumber min={0} max={100000} precision={0} addonAfter="席" style={{width:'100%'}}/></Form.Item><Row gutter={16}><Col span={12}><Form.Item name="startsAt" label="服务开始时间" rules={[{required:true,message:'请选择开始时间'}]}><Input type="date"/></Form.Item></Col><Col span={12}><Form.Item name="expiresAt" label="服务到期时间" rules={[{required:true,message:'请选择到期时间'}]}><Input type="date"/></Form.Item></Col></Row><Alert type="info" showIcon title="开通后完成授权同步" description="企业入口将在创建后生成。平台配置保存后，通过模拟同步让企业端获得最新额度。"/></div>
    </Form>
  </Drawer>;
}
export function LicenseDialog({company,mode,onClose,actor}:{company:Enterprise|null;mode:'seats'|'renew'|'open';onClose:()=>void;actor:string}){
  const [form]=Form.useForm();const {message}=App.useApp();
  useEffect(()=>{if(company){form.resetFields();form.setFieldsValue({...company.license,reason:''});}},[company,form]);
  const submit=async()=>{try{const v=await form.validateFields();if(!company)return;configureLicense(company.id,{total:v.total,startsAt:v.startsAt,expiresAt:v.expiresAt,status:mode==='open'?'active':company.license.status},actor,`${company.license.total} → ${v.total} 席；${company.license.expiresAt} → ${v.expiresAt}；${v.reason}`);message.success('授权已更新，待同步至企业端');onClose();}catch(e){if(e instanceof Error)message.error(e.message);}};
  return <Modal open={!!company} title={mode==='seats'?'调整托管席位':mode==='renew'?'续期服务':'开通企业服务'} onCancel={onClose} onOk={submit} okText="保存授权" cancelText="取消" width={520}>
    {company&&<><div className="po-dialog-context"><SafetyCertificateOutlined/> {company.name}<br/><Text type="secondary">当前授权 {company.license.total} 席 · 已分配 {seatUsage(company).used} 席</Text></div><Form form={form} layout="vertical"><Form.Item name="total" label="调整后授权席位" rules={[{required:true,message:'请输入授权席位数'}]}><InputNumber min={seatUsage(company).used} max={100000} precision={0} style={{width:'100%'}} addonAfter="席"/></Form.Item><Row gutter={16}><Col span={12}><Form.Item label="开始时间" name="startsAt" rules={[{required:true}]}><Input type="date"/></Form.Item></Col><Col span={12}><Form.Item label="到期时间" name="expiresAt" rules={[{required:true}]}><Input type="date"/></Form.Item></Col></Row><Form.Item name="reason" label="变更原因" rules={[{required:true,whitespace:true,message:'请填写变更原因'}]}><Input.TextArea rows={3} placeholder="例如：客户增购 10 个托管席位" maxLength={200}/></Form.Item><Alert type="info" showIcon title="保存后需模拟同步授权，企业端才会生效。"/></Form></>}
  </Modal>;
}
