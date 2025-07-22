import React from 'react';
import LoginModal from './LoginModal';
import '../LoginModal.css';

const LoginPage = () => (
  <div className="glass-mask">
    <img className="glass-bg" src={process.env.PUBLIC_URL + '/image.png'} alt="bg" />
    <div className="glass-title">FlexResume</div>
    <LoginModal onLogin={() => { window.location.href = '/app'; }} />
  </div>
);

export default LoginPage; 