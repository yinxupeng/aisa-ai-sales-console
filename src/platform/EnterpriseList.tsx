import React, { useMemo, useState } from 'react';
import { Alert, App, Button, Card, Input, Select, Space, Table, Tag } from 'antd';
import { ApartmentOutlined, CheckCircleOutlined, CloudSyncOutlined, PlusOutlined, SearchOutlined, TeamOutlined } from '@ant-design/icons';
import { Enterprise, seatUsage, serviceStatus, statusLabels } from '../shared/platformDomain';
import { applyLicense } from '../shared/platformStore';
import { Metrics, Paragraph, SeatMeter, ServiceTag, SyncTag, Text, Title } from './components';

export default function EnterpriseList({companies,seatsView,actor,onCreate,onView,onEdit}:{companies:Enterprise[];seatsView:boolean;actor:string;onCreate:()=>void;onView:(id:string)=>void;onEdit:(c:Enterprise,mode:'seats'|'renew'|'open')=>void}){
  const [search,setSearch]=useState('');const [status,setStatus]=useState('all');const [sync,setSync]=useState('all');const {message}=App.useApp();
  const filtered=useMemo(()=>companies.filter(c=>(`${c.name} ${c.contact} ${c.adminLogin} ${c.id}`).toLowerCase().includes(search.toLowerCase().trim())&&(status==='all'||serviceStatus(c.license)===status)&&(sync==='all'||(sync==='pending'?c.revision!==c.appliedRevision:c.revision===c.appliedRevision))),[companies,search,status,sync]);
  const total=companies.reduce((n,c)=>n+c.license.total,0),used=companies.reduce((n,c)=>n+seatUsage(c).used,0),pending=companies.filter(c=>c.revision!==c.appliedRevision).length;
  const doSync=(c:Enterprise)=>{try{applyLicense(c.id,actor);message.success(`${c.name}授权已模拟同步`);}catch(e){message.error((e as Error).message);}};
  return <div className="po-page-stack"><div className="po-page-heading"><div><Title level={3}>{seatsView?'托管席位管理':'企业管理'}</Title><Paragraph type="secondary">{seatsView?'统一配置企业托管额度，跟踪席位使用与授权生效情况。':'管理签约企业的入驻、服务开通与日常交付。'}</Paragraph></div>{!seatsView&&<Button type="primary" icon={<PlusOutlined/>} onClick={onCreate}>新增企业</Button>}</div>
    <Metrics items={seatsView?[{label:'授权席位总数',value:total,hint:'所有企业的配置额度',icon:<ApartmentOutlined/>},{label:'已分配席位',value:used,hint:'企业绑定的企微账号',icon:<TeamOutlined/>},{label:'企业端剩余席位',value:companies.reduce((n,c)=>n+seatUsage(c).remaining,0),hint:'按已生效额度计算',icon:<CheckCircleOutlined/>},{label:'待同步企业',value:pending,hint:'授权变更尚未生效',icon:<CloudSyncOutlined/>}]:[{label:'入驻企业',value:companies.length,hint:'已录入的签约企业',icon:<ApartmentOutlined/>},{label:'服务中企业',value:companies.filter(c=>['active','expiring'].includes(serviceStatus(c.license))).length,hint:'当前处于有效服务期',icon:<CheckCircleOutlined/>},{label:'即将到期',value:companies.filter(c=>serviceStatus(c.license)==='expiring').length,hint:'未来 30 天内到期',icon:<CloudSyncOutlined/>},{label:'托管席位使用',value:<>{used}<span className="po-metric-denominator"> / {total}</span></>,hint:'已分配 / 平台授权',icon:<TeamOutlined/>}]}/>
    {pending>0&&<Alert type="warning" showIcon title={`有 ${pending} 家企业的授权等待同步，企业端仍按原授权运行。`} action={<Button type="link" size="small" onClick={()=>setSync('pending')}>查看待同步</Button>}/>}
    <Card className="po-list-card"><div className="po-table-heading"><Text strong>{seatsView?'企业席位授权':'企业列表'}</Text><Text type="secondary">共 {companies.length} 家企业</Text></div><div className="po-filterbar"><Input prefix={<SearchOutlined/>} placeholder="搜索企业名称、联系人或账号" allowClear value={search} onChange={e=>setSearch(e.target.value)} style={{width:290}}/><Select aria-label="服务状态" value={status} onChange={setStatus} style={{width:140}} options={[{value:'all',label:'全部服务状态'},...Object.entries(statusLabels).map(([value,label])=>({value,label}))]}/><Select aria-label="授权状态" value={sync} onChange={setSync} style={{width:140}} options={[{value:'all',label:'全部授权状态'},{value:'pending',label:'待同步'},{value:'applied',label:'已生效'}]}/><Button onClick={()=>{setSearch('');setStatus('all');setSync('all');}}>重置</Button><span className="po-filter-count">{filtered.length} 条结果</span></div>
      <Table rowKey="id" size="middle" scroll={{x:1160}} dataSource={filtered} pagination={{pageSize:8,showSizeChanger:false,showTotal:t=>`共 ${t} 家企业`}} columns={[
        {title:'企业名称',dataIndex:'name',width:220,render:(value,c)=><div className="po-company-cell"><span className="po-company-avatar">{value.slice(0,1)}</span><div><Button type="link" onClick={()=>onView(c.id)}>{value}</Button><div className="po-subtext">{c.industry}</div></div></div>},
        ...(!seatsView?[{title:'企业管理员',dataIndex:'adminName',width:140,render:(value:string,c:Enterprise)=><><Text>{value}</Text><div className="po-subtext">{c.adminLogin}</div></>}]:[]),
        {title:'服务状态',width:115,render:(_,c)=><ServiceTag company={c}/>},
        {title:'已分配 / 授权',width:160,render:(_,c)=><SeatMeter company={c}/>},
        ...(seatsView?[{title:'企业端剩余',width:115,render:(_:unknown,c:Enterprise)=><Text>{seatUsage(c).remaining} 席</Text>}]:[]),
        {title:'服务到期时间',width:140,dataIndex:'license',render:(_,c)=><><Text>{c.license.expiresAt}</Text>{serviceStatus(c.license)==='expiring'&&<div className="po-warning-text">请及时跟进续期</div>}</>},
        {title:'授权同步',width:100,render:(_,c)=><SyncTag company={c}/>},
        {title:'操作',width:240,fixed:'right',render:(_,c)=><Space size={0}><Button type="link" size="small" onClick={()=>onView(c.id)}>详情</Button><Button type="link" size="small" onClick={()=>onEdit(c,c.license.status==='draft'?'open':'seats')}>{c.license.status==='draft'?'开通':'调整席位'}</Button>{c.revision!==c.appliedRevision?<Button type="link" size="small" onClick={()=>doSync(c)}>模拟同步</Button>:<Button type="link" size="small" onClick={()=>onEdit(c,'renew')}>续期</Button>}</Space>}
      ]}/>
    </Card>
    <div className="po-footnote">平台配置服务权益，企业自主分配企微账号。授权与使用情况在两个管理端关联展示。</div>
  </div>;
}
