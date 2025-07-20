import React, { useState } from 'react';
import '../LoginModal.css';

const LoginModal = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 验证邮箱格式
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 验证手机号格式（中国大陆手机号）
  const isValidPhone = (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // 验证密码强度
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) {
      errors.push(`密码长度至少${minLength}位`);
    }
    if (!hasUpperCase) {
      errors.push('需要包含大写字母');
    }
    if (!hasLowerCase) {
      errors.push('需要包含小写字母');
    }
    if (!hasNumbers) {
      errors.push('需要包含数字');
    }
    if (!hasSpecialChar) {
      errors.push('需要包含特殊字符');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 验证输入
    if (!account || !password || (mode === 'register' && !confirm)) {
      setError('请填写所有字段');
      setIsLoading(false);
      return;
    }

    // 验证邮箱或手机号格式
    if (!isValidEmail(account) && !isValidPhone(account)) {
      setError('请输入有效的邮箱地址或手机号');
      setIsLoading(false);
      return;
    }

    // 注册时验证密码强度
    if (mode === 'register') {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setError(`密码强度不足：${passwordValidation.errors.join('、')}`);
        setIsLoading(false);
        return;
      }

      if (password !== confirm) {
        setError('两次密码不一致');
        setIsLoading(false);
        return;
      }
    }

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: account,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 登录成功，保存token和userId
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        console.log('登录成功，用户ID:', data.userId);
        onLogin(data.token);
      } else {
        setError(data.message || '登录失败，请重试');
      }
    } catch (err) {
      console.error('登录错误:', err);
      setError('网络错误，请检查连接');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-modal">
      <div className="brand-title">FlexResume</div>
      <h2>{mode === 'login' ? '登录' : '注册'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="邮箱或手机号"
          value={account}
          onChange={e => setAccount(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={isLoading}
        />
        {mode === 'register' && (
          <input
            type="password"
            placeholder="确认密码"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            disabled={isLoading}
          />
        )}
        {error && <div className="login-error">{error}</div>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? '处理中...' : (mode === 'login' ? '登录' : '注册')}
        </button>
      </form>
      <div className="login-switch">
        {mode === 'login' ? (
          <>
            没有账号？<span onClick={() => setMode('register')}>注册</span>
          </>
        ) : (
          <>
            已有账号？<span onClick={() => setMode('login')}>登录</span>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal; 