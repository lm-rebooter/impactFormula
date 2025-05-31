import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useModel, Helmet } from '@umijs/max';
import { Alert, message, Tabs } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { createStyles } from 'antd-style';
import './index.less';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const ActionIcons = () => {
  const { styles } = useStyles();

  return (
    <>
      <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.action} />
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.action} />
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.action} />
    </>
  );
};


const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const LogoRow = () => (
  <div className="login-logo-row">
    <img src="/logo.png" alt="D2 logo" className="login-logo-img" />
    <span className="login-logo-x" aria-label="and">×</span>
    <img src="/logo.svg" alt="G logo" className="login-logo-img" />
  </div>
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('login');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      const msg = await login({ ...values, type: 'account' });
      if (msg.status === 'ok') {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: 'Login successful!',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: 'Login failed, please try again!',
      });
      message.error(defaultLoginFailureMessage);
    }
  };

  // Register logic (local mock)
  const handleRegister = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }
    message.success('Registration successful, please login!');
    setType('login');
  };

  const { status, type: loginType } = userLoginState;

  return (
    <div className="login-center-container">
      <div className="login-main">
        <div className="login-content">
          <LogoRow />
          <div className="login-slogan">
            {intl.formatMessage({ id: 'pages.layouts.userLayout.title', defaultMessage: 'Enabling businesses to divert surplus for good.' })}
          </div>
          <LoginForm
            contentStyle={{ minWidth: 320, maxWidth: '75vw' }}
            initialValues={{ autoLogin: true }}
            submitter={{
              searchConfig: {
                submitText: type === 'login' ? 'Login' : 'Register',
              },
            }}
            onFinish={async (values) => {
              if (type === 'login') {
                await handleSubmit(values as API.LoginParams);
              } else {
                await handleRegister(values);
              }
            }}
          >
            <Tabs
              activeKey={type}
              onChange={setType}
              centered
              items={[
                {
                  key: 'login',
                  label: 'Account Login',
                },
                {
                  key: 'register',
                  label: 'Register',
                },
              ]}
            />

            {/* Login form */}
            {type === 'login' && (
              <>
                {status === 'error' && loginType === 'account' && (
                  <LoginMessage
                    content={intl.formatMessage({
                      id: 'pages.login.accountLogin.errorMessage',
                      defaultMessage: 'Incorrect username or password (admin/ant.design)',
                    })}
                  />
                )}
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined />,
                    tabIndex: 0,
                    'aria-label': 'Username',
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.username.placeholder',
                    defaultMessage: 'Username: admin or user',
                  })}
                  rules={[
                    { required: true, message: 'Please input your username!' },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined />,
                    tabIndex: 0,
                    'aria-label': 'Password',
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.password.placeholder',
                    defaultMessage: 'Password: ant.design',
                  })}
                  rules={[
                    { required: true, message: 'Please input your password!' },
                  ]}
                />
                <div className="login-switch-row">
                  <span>No account?</span>
                  <a
                    tabIndex={0}
                    aria-label="Go to register"
                    className="login-switch-link text-blue-500 hover:underline cursor-pointer"
                    onClick={() => setType('register')}
                    onKeyDown={(e) => { if (e.key === 'Enter') setType('register'); }}
                  >
                    Register
                  </a>
                </div>
              </>
            )}

            {/* Register form */}
            {type === 'register' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined />,
                    tabIndex: 0,
                    'aria-label': 'Username',
                  }}
                  placeholder="Username"
                  rules={[
                    { required: true, message: 'Please input your username!' },
                  ]}
                />
                <ProFormText
                  name="email"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined />,
                    tabIndex: 0,
                    'aria-label': 'Email',
                  }}
                  placeholder="Email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Invalid email format!' },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined />,
                    tabIndex: 0,
                    'aria-label': 'Password',
                  }}
                  placeholder="Password"
                  rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' },
                  ]}
                />
                <ProFormText.Password
                  name="confirmPassword"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined />,
                    tabIndex: 0,
                    'aria-label': 'Confirm Password',
                  }}
                  placeholder="Confirm Password"
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }: any) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    }),
                  ]}
                />
                <div className="login-switch-row">
                  <span>Already have an account?</span>
                  <a
                    tabIndex={0}
                    aria-label="Go to login"
                    className="login-switch-link text-blue-500 hover:underline cursor-pointer"
                    onClick={() => setType('login')}
                    onKeyDown={(e) => { if (e.key === 'Enter') setType('login'); }}
                  >
                    Login
                  </a>
                </div>
              </>
            )}
          </LoginForm>
        </div>
      </div>
      <Footer className="login-footer" />
    </div>
  );
};

export default Login;
