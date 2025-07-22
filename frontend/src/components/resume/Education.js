import React from 'react';
import './Resume.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  return `${year}.${month.toString().padStart(2, '0')}`;
}

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
            {/* 左侧校徽 */}
            <div className="edu-logo">
              {edu.logo ? (
                <img 
                  src={edu.logo} 
                  alt={`${edu.school} logo`}
                  className="school-logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : null}
            </div>
            
            {/* 右侧内容 */}
            <div className="edu-right">
              <div className="edu-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <h3 className="school-name" style={{ margin: 0 }}>{edu.school}</h3>
                <span className="edu-period">
                  {edu.startDate ? formatDate(edu.startDate) : ''} - {edu.graduationYear ? formatDate(edu.graduationYear) : '至今'}
                </span>
              </div>
              <div className="edu-content">
                <p className="major">专业: {edu.fieldOfStudy}</p>
                <p className="degree">学位: {edu.degree}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;