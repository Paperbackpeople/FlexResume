import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '@react-login-page/page5';

const css = {
  '--login-bg': '#5b6ef4',
  '--login-color': '#fff',
  '--login-input': '#333',
  '--login-input-bg': '#fff',
  '--login-input-before': 'rgb(62 41 255 / 15%)',
  '--login-input-after': 'rgb(49 141 255 / 20%)',
  '--login-btn': '#fff',
  '--login-btn-bg': '#5b6ef4',
  '--login-btn-focus': '#3648c6',
  '--login-btn-hover': '#3648c6',
  '--login-btn-active': '#5b6ef4',
  '--login-footer': '#ffffff99',
};

const CustomLogin = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  const handleSendCode = () => {
    if (!email) {
      alert('Please enter your email.');
      return;
    }

    setIsSending(true);
    setTimer(60);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setIsSending(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogin = () => {
    if (!email || !code) {
      alert('Please enter both email and verification code.');
      return;
    }

    // Mock API call to verify code
    const success = true; // 假设验证成功
    if (success) {
      alert('Verification successful!');
      navigate('/app');
    } else {
      alert('Invalid verification code.');
    }
  };

  return (
    <Login style={{ height: 380, ...css }}>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
          }}
        />
        <button
          onClick={handleSendCode}
          disabled={isSending}
          style={{
            padding: '10px',
            backgroundColor: isSending ? '#ccc' : '#5b6ef4',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: isSending ? 'not-allowed' : 'pointer',
          }}
        >
          {isSending ? `${timer}s` : 'Send Code'}
        </button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
          }}
        />
      </div>
      <button
        onClick={handleLogin}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#5b6ef4',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Login
      </button>
    </Login>
  );
};

export default CustomLogin;
