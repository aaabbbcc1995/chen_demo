import './homePage.css';

import React, {useState} from 'react';
import {
  ContainerOutlined,
  AccountBookOutlined,
  PieChartOutlined,
  HomeOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import {Button, Menu, message} from 'antd';
import {useNavigate} from "react-router";
import SalePage from "../salePage/salePage";
import ProductPage from "../productPage/productPage";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem('看板', '1', <PieChartOutlined/>),
  getItem('销售部', '2', <AccountBookOutlined/>),
  getItem('生产部', '3', <ContainerOutlined/>),
  getItem('仓库', '4', <HomeOutlined/>),
];

const itemCommon = [
  getItem('销售部', '2', <AccountBookOutlined/>),
  getItem('生产部', '3', <ContainerOutlined/>),
  getItem('仓库', '4', <HomeOutlined/>),
];

export default function Homepage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [menuKey, setMenuKey] = useState('1');

  const logout = () => {
    messageApi.success('登出成功');
    setTimeout(() => {
      localStorage.removeItem('role');
      navigate('/login');
    }, 500);
  }
  return (
    <div className='homepage'>
      {contextHolder}
      <div className='homepage-slider'>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="light"
          items={localStorage.getItem('role') === 'zongjingli' ? items : itemCommon}
          onClick={(item) => {
            setMenuKey(item.key)
          }}
        />
      </div>
      <div className='homepage-content'>
        <div className='homepage-logout'>
          <Button type="primary" icon={<LogoutOutlined/>} onClick={logout}>
            退出登陆
          </Button>
        </div>
        {menuKey === '2' && <SalePage/>}
        {menuKey === '3' && <ProductPage/>}
      </div>
    </div>
  );
};
