import React from 'react';
import './Resume.css';

const Education = ({ educationData, onEducationClick }) => {
  if (!educationData || !educationData.education) {
    return (
      <section className="education-section">
        <h2 className="section-title">教育经历</h2>
        <div className="education-list">
          <p>加载中...</p>
        </div>
      </section>
    );
  }

  const educationList = Object.entries(educationData.education).map(([key, edu]) => ({
    id: key,
    ...edu
  }));

  return (
    <section className="education-section">
      <h2 className="section-title">教育经历</h2>
      <div className="education-list">
        {educationList.map((edu) => (
          <div 
            key={edu.id} 
            className="education-item clickable"
            onClick={() => onEducationClick(edu)}
          >
            {/* 左侧容器：时间 + 校徽 */}
            <div className="edu-left">
              <div className="edu-period">
                {edu.startDate ? new Date(edu.startDate).getFullYear() : ''} - {edu.graduationYear ? new Date(edu.graduationYear).getFullYear() : ''}
              </div>
              {edu.logo && (
                <div className="edu-logo">
                  <img 
                    src={edu.logo} 
                    alt="school logo"
                    className="school-logo"
                  />
                </div>
              )}
            </div>

            {/* 右侧文字内容区 */}
            <div className="edu-content">
              <h3 className="school-name">{edu.school}</h3>
              <p className="major">专业: {edu.fieldOfStudy}</p>
              <p className="degree">学位: {edu.degree}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;
