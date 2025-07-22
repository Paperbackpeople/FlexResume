import React from 'react';
import './Resume.css';

const WorkInternshipExperience = ({ workData, onWorkClick }) => {
  if (!workData || Object.keys(workData).length === 0) {
    return (
      <section className="project-experience-section">
        <h2 className="section-title">工作经历</h2>
        <div className="internship-list">
          <p>暂无工作/实习数据</p>
        </div>
      </section>
    );
  }
  const workList = Object.entries(workData)
    .map(([key, work]) => ({ id: key, ...work }))
    .filter(work => work.company || work.position);
  return (
    <section className="project-experience-section">
      <h2 className="section-title">工作经历</h2>
      <div className="project-list">
        {workList.map((work) => (
          <div
            key={work.id}
            className="project-item clickable"
            onClick={() => onWorkClick(work)}
          >
            <div className="project-header">
              <h3>
                {work.type === 'internship' ? <span style={{color:'#2e5b87',fontWeight:'bold',marginRight:6}}>[实习]</span> : null}
                {work.type === 'work' ? <span style={{color:'#42b983',fontWeight:'bold',marginRight:6}}>[正式]</span> : null}
                {work.link ? (
                  <a
                    href={work.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="internship-link"
                  >
                    {work.company || '未命名单位'}
                  </a>
                ) : (
                  work.company || '未命名单位'
                )}
              </h3>
              {work.time && <span className="project-time">{work.time}</span>}
            </div>
            {work.position && <p className="brief">{work.position}</p>}
            {work.summary && <p className="brief">{work.summary}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkInternshipExperience; 