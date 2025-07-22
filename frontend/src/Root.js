import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import LoginPage from './components/LoginPage';
import ResumeView from './components/resume/ResumePreview';
import PublishResumeView from './PublishResumeView';

function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/resume/:username/:version" element={<ResumeView />} />
        <Route path="/app" element={<App />} />
        <Route path="/publish/:id" element={<PublishResumeView />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Root;
