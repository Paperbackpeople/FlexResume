import React from 'react';
import './Resume.css';

const InternshipExperience = ({ internshipData, onInternshipClick }) => {
  if (!internshipData || !internshipData.internshipData) {
    return (
      <div className="section">
        <h2 className="section-title">实习经历</h2>
        <div className="internship-container">
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  const internshipList = Object.values(internshipData.internshipData);

  return (
    <div className="section">
      <h2 className="section-title">实习经历</h2>
      <div className="resume-internship-container">
        {internshipList.map((internship, index) => (
          <div key={index} className="resume-internship-item" onClick={() => onInternshipClick(internship)}>
            <div className="internship-header">
              <h3>{internship.name}</h3>
              <span className="internship-time">{internship.time}</span>
            </div>
            <p className="internship-brief">{internship.brief}</p>
            {internship.workDetails && (
              <div className="internship-details">
                <h4>工作内容：</h4>
                <ul>
                  {internship.workDetails.map((detail, detailIndex) => (
                    <li key={detailIndex}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
            {internship.technologies && (
              <div className="internship-technologies">
                <strong>技术栈：</strong>
                {internship.technologies.join(', ')}
              </div>
            )}
            {internship.video && (
              <div className="internship-media">
                <video controls className="internship-video">
                  <source src={internship.video} type="video/mp4" />
                  您的浏览器不支持视频播放。
                </video>
              </div>
            )}
            {internship.images && internship.images.length > 0 && (
              <div className="internship-images">
                {internship.images.map((image, imgIndex) => (
                  <img key={imgIndex} src={image} alt={`实习截图 ${imgIndex + 1}`} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InternshipExperience; 