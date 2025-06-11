import { Footer } from '@/components';
import { login, register } from '@/services/ant-design-pro/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { history, useIntl, useModel } from '@umijs/max';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Cookies from 'js-cookie';
import './index.less';

const LogoRow = () => (
  <div className="login-logo-row">
    <img src="/logo.png" alt="D2 logo" className="login-logo-img" />
    <span className="login-logo-x" aria-label="and">
      ×
    </span>
    <img src="/logo.svg" alt="G logo" className="login-logo-img" />
  </div>
);

const Login: React.FC = () => {
  const [type, setType] = useState<string>('login');
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    console.log(userInfo, 'userInfo');
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
      const msg = await login({ ...values });
      if (msg.code === 200) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: 'Login successful!',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } else {
        message.error(msg.message);
      }
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
    const params = {
      name: values.name,
      email: values.email,
      password: values.password,
    };
    try {
      const msg = await register({ ...params });
      if (msg.code === 200) {
        Cookies.set('token', `${msg.data.token}`);
        message.success('Registration successful, please login!');
        setType('login');
      } else {
        message.error(msg.message);
      }
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: 'Login failed, please try again!',
      });
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className="login-center-container">
      <div className="login-main">
        <div className="login-content">
          <LogoRow />
          <div className="login-slogan">
            {intl.formatMessage({
              id: 'pages.layouts.userLayout.title',
              defaultMessage: 'Enabling businesses to divert surplus for good.',
            })}
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
                  rules={[{ required: true, message: 'Please input your password!' }]}
                />
                <div className="login-switch-row">
                  <span>No account?</span>
                  <a
                    tabIndex={0}
                    aria-label="Go to register"
                    className="login-switch-link text-blue-500 hover:underline cursor-pointer"
                    onClick={() => setType('register')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setType('register');
                    }}
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
                  name="name"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined />,
                    tabIndex: 0,
                    'aria-label': 'name',
                  }}
                  placeholder="name"
                  rules={[{ required: true, message: 'Please input your name!' }]}
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setType('login');
                    }}
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
