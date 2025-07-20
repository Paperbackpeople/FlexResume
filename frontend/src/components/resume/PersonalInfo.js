import React from 'react';
import './Resume.css';

const PersonalInfo = ({ personalInfo }) => {
  if (!personalInfo || !personalInfo.fields) {
    return (
      <div className="section">
        <h2>个人信息</h2>
        <div className="info-container">
          <div className="text-info">
            <p>姓名：加载中...</p>
            <p>邮箱：加载中...</p>
            <p>电话：加载中...</p>
          </div>
          <div className="profile-photo-placeholder"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <h2 className="section-title">个人信息</h2>
      <div className="resume-info-container">
        <div className="resume-text-info">
          {personalInfo.fields && personalInfo.fields.length > 0 ? (
            personalInfo.fields.map((field, index) => (
              <p key={index}>
                {field.label}: {field.value}
              </p>
            ))
          ) : (
            <>
              <p>姓名: 加载中...</p>
              <p>邮箱: 加载中...</p>
              <p>电话: 加载中...</p>
            </>
          )}
        </div>
        {personalInfo.profilePhoto && (
          <img 
            className="resume-profile-photo" 
            src={personalInfo.profilePhoto} 
            alt="个人照片" 
          />
        )}
      </div>
    </div>
  );
};

export default PersonalInfo; 