import React,{useRef,useState} from 'react';
import {App,Button,Form,Input,InputNumber,Result,Space,Typography} from 'antd';
import {ArrowRightOutlined,CheckCircleOutlined,PhoneOutlined,TeamOutlined} from '@ant-design/icons';
import {ConsultationInput} from '../shared/consultationDomain';
import {getConsultationData,submitConsultation} from '../shared/consultationStore';

const TOKEN_KEY='sabuddy-consultation-submission';
const newToken=()=>`inq-${globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
function pendingToken(){try{const value=sessionStorage.getItem(TOKEN_KEY);if(value)return value;const next=newToken();sessionStorage.setItem(TOKEN_KEY,next);return next;}catch{return newToken();}}
export default function ConsultationForm(){
  const {message}=App.useApp();const [form]=Form.useForm();const [token,setToken]=useState(pendingToken);const [done,setDone]=useState(()=>getConsultationData().records.some(r=>r.id===token));const [submitting,setSubmitting]=useState(false);const lock=useRef(false);
  const submit=async(values:ConsultationInput)=>{
    if(lock.current||done)return;lock.current=true;setSubmitting(true);
    try{submitConsultation(values,token);setDone(true);}catch(e){message.error(e instanceof Error?e.message:'提交失败，请稍后重试');}finally{lock.current=false;setSubmitting(false);}
  };
  return <main className="cq-page"><div className="cq-wrap"><header className="cq-brand"><span>S</span><b>Sabuddy</b><small>企微智能销售</small></header>
    {done?<section className="cq-form-card cq-success"><Result status="success" title="咨询信息已提交" subTitle="我们已收到你的需求，客服将尽快与你联系。请留意电话，感谢你的信任。" extra={<Button size="large" onClick={()=>{const next=newToken();try{sessionStorage.setItem(TOKEN_KEY,next);}catch{/* 当前标签页仍可提交 */}setToken(next);form.resetFields();setDone(false);}}>再提交一条咨询</Button>}/><div className="cq-success-note"><CheckCircleOutlined/> 无需重复提交，你的信息已保存</div></section>:<><section className="cq-intro"><div className="cq-eyebrow">让每一次客户沟通，都更进一步</div><h1>留下联系方式和需求，我们将为你介绍适合的企微托管方案与服务。</h1><div className="cq-benefits"><span><TeamOutlined/> 专属顾问沟通</span><span><PhoneOutlined/> 按需介绍方案</span></div></section><section className="cq-form-card"><div className="cq-form-heading"><Typography.Title level={4}>填写咨询信息</Typography.Title><Typography.Text type="secondary">约 1 分钟，了解你的需求</Typography.Text></div><Form form={form} layout="vertical" onFinish={submit} size="large" requiredMark={false}>
      <Form.Item label={<span>你的姓名 <em className="cq-required">*</em></span>} name="name" rules={[{required:true,whitespace:true,message:'请填写你的姓名'}]}><Input placeholder="怎么称呼你" maxLength={30} autoComplete="name"/></Form.Item>
      <Form.Item label={<span>手机号码 <em className="cq-required">*</em></span>} name="phone" rules={[{required:true,message:'请填写手机号码'},{pattern:/^1[3-9]\d{9}$/,message:'请填写有效的 11 位手机号'}]}><Input type="tel" inputMode="tel" placeholder="用于客服联系你" maxLength={11} autoComplete="tel"/></Form.Item>
      <Form.Item label={<span>企业名称 <small className="cq-optional">选填</small></span>} name="company"><Input placeholder="填写企业或团队名称" maxLength={60} autoComplete="organization"/></Form.Item>
      <Form.Item label={<span>预计托管企微账号数 <small className="cq-optional">选填</small></span>} name="expectedSeats"><InputNumber min={1} max={100000} precision={0} placeholder="例如：10" controls={false} inputMode="numeric" style={{width:'100%'}}/></Form.Item>
      <Form.Item label={<span>你希望解决的问题 <small className="cq-optional">选填</small></span>} name="needs"><Input.TextArea rows={4} maxLength={1000} showCount placeholder="例如：希望自动跟进客户、减少销售重复沟通，或了解产品价格与部署方式。"/></Form.Item>
      <p className="cq-contact-note">你填写的信息仅用于本次产品咨询和客服跟进。</p><Button type="primary" htmlType="submit" loading={submitting} block size="large">提交咨询 <ArrowRightOutlined/></Button>
    </Form></section></>}
    <footer className="cq-footer">Sabuddy · 企微智能销售<br/><span>产品演示页面 · 本次提交仅保存在当前浏览器</span></footer>
  </div></main>;
}
