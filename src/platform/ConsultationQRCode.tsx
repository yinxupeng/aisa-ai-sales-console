import React,{useRef,useState} from 'react';
import {Alert,App,Button,Form,Input,Modal,QRCode,Space,Typography} from 'antd';
import {CopyOutlined,DownloadOutlined,EditOutlined,ExportOutlined} from '@ant-design/icons';
import {defaultConsultationUrl,saveConsultationUrl,useConsultationData} from '../shared/consultationStore';
import {validFormUrl} from '../shared/consultationDomain';

export default function ConsultationQRCode({open,onClose}:{open:boolean;onClose:()=>void}){
  const data=useConsultationData(),link=data.formUrl||defaultConsultationUrl();
  const qrRef=useRef<HTMLDivElement>(null);const [editing,setEditing]=useState(false);const [form]=Form.useForm();const {message}=App.useApp();
  const copy=async()=>{try{await navigator.clipboard.writeText(link);message.success('表单链接已复制');}catch{message.info('请选中下方链接手动复制');}};
  const download=()=>{const canvas=qrRef.current?.querySelector('canvas');if(!canvas){message.error('二维码尚未生成');return;}const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='Sabuddy-客户咨询二维码.png';a.click();};
  const save=async()=>{try{const v=await form.validateFields();saveConsultationUrl(v.url||'');setEditing(false);message.success('表单链接与二维码已更新');}catch(e){if(e instanceof Error)message.error(e.message);}};
  const local=link.startsWith('file:')||/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/)/.test(link);
  return <Modal title="咨询二维码" open={open} onCancel={()=>{setEditing(false);onClose();}} footer={<Button onClick={onClose}>完成</Button>} width={600}>
    <div className="po-qr-preview"><div ref={qrRef}><QRCode type="canvas" value={link||' '} size={224}/></div><Typography.Title level={5}>扫码填写咨询信息</Typography.Title><Typography.Text type="secondary">留下联系方式，客服将为你介绍产品与服务</Typography.Text></div>
    <Space wrap className="po-qr-actions"><Button icon={<DownloadOutlined/>} onClick={download}>下载二维码</Button><Button icon={<CopyOutlined/>} onClick={copy}>复制链接</Button><Button icon={<ExportOutlined/>} href={link} target="_blank" rel="noreferrer">预览表单</Button><Button icon={<EditOutlined/>} onClick={()=>{form.setFieldsValue({url:data.formUrl});setEditing(true);}}>编辑 / 更换</Button></Space>
    <Input readOnly value={link} aria-label="当前咨询表单链接" onFocus={e=>e.target.select()} style={{margin:'12px 0'}}/>
    {editing&&<Form form={form} layout="vertical" className="po-qr-editor"><Form.Item label="表单访问地址" name="url" extra="留空使用本项目的咨询表单。修改链接会生成新二维码，已发出的旧二维码不会自动更新。" rules={[{validator:(_,v)=>!v?.trim()||validFormUrl(v.trim())?Promise.resolve():Promise.reject(new Error('请输入有效的 http 或 https 链接'))}]}><Input placeholder="https://你的域名/consultation.html" maxLength={1500}/></Form.Item><Space><Button type="primary" onClick={save}>保存并更换二维码</Button><Button onClick={()=>form.setFieldValue('url','')}>恢复默认链接</Button><Button onClick={()=>setEditing(false)}>取消</Button></Space></Form>}
    <Alert type={local?'warning':'info'} showIcon title={local?'当前是本地演示链接':'二维码链接需对应本系统的咨询表单'} description={local?'手机无法直接访问电脑上的 localhost 或文件地址。可先在本浏览器预览；正式对外使用需部署页面和接收接口。':'更换为其他系统的表单，不会自动回流咨询。本原型只在同一浏览器、同一访问地址下保存和展示记录，尚未接入跨设备收集。'}/>
  </Modal>;
}
