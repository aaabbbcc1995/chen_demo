import './loginPage.css';
import { Input, Button, message, Tooltip } from "antd";
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import Logo from '../../assets/logo.png';
import { useState } from "react";
import {useNavigate} from "react-router";

const accountList = {
  zongjingli: {
    account: 'zongjingli',
    password: '123'
  },
  xiaoshou: {
    account: 'xiaoshou',
    password: '123'
  },
  shengchan: {
    account: 'shengchan',
    password: '123'
  },
  cangku: {
    account: 'cangku',
    password: '123'
  }
};

export default function LoginPage() {
  const [info, setInfo] = useState({ account: '', password: '' });
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    const { account, password } = info;
    const accountInfo = accountList[account];
    setLoading(true);

    if (accountInfo) {
      if (password === accountInfo.password) {
        messageApi.success('登陆成功');
        setTimeout(() => {
          localStorage.setItem('role', account);
          navigate('/homepage');
        }, 500);
      } else {
        setTimeout(() => {
          messageApi.error('输入账号/密码错误');
          setLoading(false);
        }, 500);
      }
    } else {
      setTimeout(() => {
        messageApi.error('输入账号/密码错误');
        setLoading(false);
      }, 500);
    }
  };

  const TooltipTitle = () => (
    <span>
      账号：zongjingli 密码：123
      <br />
      账号：xiaoshou 密码：123
      <br />
      账号：shengchan 密码：123
      <br />
      账号：cangku 密码：123
      <br />
    </span>
  );

  return (
    <div className='login-page'>
      {contextHolder}
      <div className='login-page-container'>
        <img src={Logo} style={{ height: '300px' }} alt='' />
        <Input
          placeholder="输入用户名"
          prefix={<UserOutlined className="site-form-item-icon" />}
          suffix={
            <Tooltip title={<TooltipTitle />}>
              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
          }
          style={{ marginBottom: '20px' }}
          onChange={e => setInfo(prevInfo => ({ ...prevInfo, account: e.target.value }))}
        />
        <Input.Password
          placeholder="输入密码"
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          onChange={e => setInfo(prevInfo => ({ ...prevInfo, password: e.target.value }))}
        />
        <Button
          style={{ height: '50px', marginTop: '50px', width: '150px' }}
          type="primary"
          onClick={handleClick}
          loading={loading}
          disabled={!info?.account || !info?.password}
        >
          登陆
        </Button>
      </div>
    </div>
  );
}
