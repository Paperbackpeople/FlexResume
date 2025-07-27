import React, { useState } from 'react';
import '../LoginModal.css';

const LoginModal = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- All your validation functions (isValidEmail, isValidPhone, validatePassword) remain the same ---
  // ... (keep them here)
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


  // --- NEW: Refactored login logic into a helper function ---
  const performLogin = async (loginAccount, loginPassword) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginAccount, password: loginPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      // If login fails, throw an error to be caught by the caller
      throw new Error(data.message || '登录失败');
    }

    // Login successful, save data and call the parent callback
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);
    console.log('登录成功，用户ID:', data.userId);
    
    onLogin({
      token: data.token,
      userId: data.userId
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // --- All your validation logic remains the same ---
    if (!account || !password || (mode === 'register' && !confirm)) {
      setError('请填写所有字段');
      setIsLoading(false);
      return;
    }
    if (!isValidEmail(account) && !isValidPhone(account)) {
      setError('请输入有效的邮箱地址或手机号');
      setIsLoading(false);
      return;
    }
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
      if (mode === 'register') {
        // --- Step 1: Register the user ---
        const registerResponse = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: account, password: password }),
        });

        const registerData = await registerResponse.json();

        if (!registerResponse.ok) {
          // If registration fails, show error and stop
          throw new Error(registerData.message || '注册失败');
        }

        // --- Step 2: If registration is successful, automatically log in ---
        console.log('注册成功，正在自动登录...');
        await performLogin(account, password);

      } else {
        // --- This is the normal login flow ---
        await performLogin(account, password);
      }
    } catch (err) {
      console.error(`${mode === 'register' ? '注册或自动登录' : '登录'}错误:`, err);
      setError(err.message || '发生未知错误，请重试');
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