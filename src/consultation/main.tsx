import React from 'react';
import {createRoot} from 'react-dom/client';
import {App,ConfigProvider} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import './consultation.css';
import ConsultationForm from './ConsultationForm';

class FormBoundary extends React.Component<React.PropsWithChildren,{failed:boolean}>{
  state={failed:false};static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<div className="cq-page"><div className="cq-form-card"><h2>页面暂时无法使用</h2><p>请检查浏览器是否允许本地存储，然后刷新重试。</p><button onClick={()=>location.reload()}>刷新页面</button></div></div>:this.props.children;}
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><ConfigProvider locale={zhCN} theme={{token:{colorPrimary:'#2867d9',borderRadius:8,fontFamily:'Inter, "PingFang SC", "Microsoft YaHei", sans-serif'}}}><App><FormBoundary><ConsultationForm/></FormBoundary></App></ConfigProvider></React.StrictMode>);
