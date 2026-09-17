import React from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css';
import './platform.css';
import PlatformApp from './PlatformApp';

class Boundary extends React.Component<React.PropsWithChildren,{error:Error|null}>{
  state={error:null as Error|null};
  static getDerivedStateFromError(error:Error){return {error};}
  render(){return this.state.error?<div style={{padding:40}}><h2>页面暂时无法显示</h2><p>{this.state.error.message}</p><button onClick={()=>window.location.reload()}>刷新重试</button></div>:this.props.children;}
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Boundary><PlatformApp/></Boundary></React.StrictMode>);
