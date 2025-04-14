import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CustomLogin from './Login';
import ResumeView from './Resume/components/ResumeView';

function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/resume/:username/:version" element={<ResumeView />} />
        <Route path="/app" element={<App />} />
        <Route path="/" element={<CustomLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Root;
