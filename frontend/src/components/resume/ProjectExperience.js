import React from 'react';
import './Resume.css';

const ProjectExperience = ({ projectData, onProjectClick }) => {
  if (!projectData || Object.keys(projectData).length === 0) {
    return (
      <section className="project-experience-section">
        <h2 className="section-title">项目经历</h2>
        <div className="project-list">
          <p>暂无项目数据</p>
        </div>
      </section>
    );
  }

  // 将对象转换为数组，并保持原有的key作为id
  const projectList = Object.entries(projectData)
    .map(([key, project]) => ({
      id: key,
      ...project
    }))
    .filter(project => project.name || project.summary); // 过滤掉空项目

  return (
    <section className="project-experience-section">
      <h2 className="section-title">项目经历</h2>
      <div className="project-list">
        {projectList.map((project) => (
          <div 
            key={project.id} 
            className="project-item clickable"
            onClick={() => onProjectClick(project)}
          >
            <div className="project-header">
              <h3>{project.name || '未命名项目'}</h3>
              {project.time && (
                <span className="project-time">{project.time}</span>
              )}
            </div>
            {project.summary && (
              <p className="brief">{project.summary}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectExperience;