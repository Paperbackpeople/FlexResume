import React from 'react';
import './Resume.css';

const Skills = ({ skillData }) => {
  console.log('Skills skillData:', skillData); // 调试信息
  
  if (!skillData || !skillData.content) {
    return (
      <div className="section">
        <h2 className="section-title">专业技能</h2>
        <div className="skills-container">
          <p>暂无数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <h2 className="section-title">专业技能</h2>
      <div className="skills-container">
        <div className="skill-content" dangerouslySetInnerHTML={{ __html: skillData.content }} />
      </div>
    </div>
  );
};

export default Skills; 