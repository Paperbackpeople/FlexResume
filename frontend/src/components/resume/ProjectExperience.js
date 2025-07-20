import React from 'react';
import './Resume.css';

const ProjectExperience = ({ projectData, onProjectClick }) => {
  if (!projectData || !projectData.projectData) {
    return (
      <div className="section">
        <h2 className="section-title">项目经验</h2>
        <div className="project-container">
          <p>暂无数据</p>
        </div>
      </div>
    );
  }

  const projectList = Object.values(projectData.projectData);

  return (
    <div className="section">
      <h2 className="section-title">项目经验</h2>
      <div className="resume-project-container">
        {projectList.map((project, index) => (
          <div key={index} className="resume-project-item" onClick={() => onProjectClick(project)}>
            <div className="project-header">
              <h3>{project.name}</h3>
              <span className="project-time">{project.time}</span>
            </div>
            <p className="project-brief">{project.brief}</p>
            {project.technologies && (
              <div className="project-technologies">
                <strong>技术栈：</strong>
                {project.technologies.join(', ')}
              </div>
            )}
            {project.video && (
              <div className="project-media">
                <video controls className="project-video">
                  <source src={project.video} type="video/mp4" />
                  您的浏览器不支持视频播放。
                </video>
              </div>
            )}
            {project.images && project.images.length > 0 && (
              <div className="project-images">
                {project.images.map((image, imgIndex) => (
                  <img key={imgIndex} src={image} alt={`项目截图 ${imgIndex + 1}`} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectExperience; 