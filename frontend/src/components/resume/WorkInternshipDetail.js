import React from 'react';
import DOMPurify from 'dompurify';
import './Resume.css';

const WorkInternshipDetail = ({ workId, workData, onClose }) => {
  if (!workData || !workData[workId]) {
    return null;
  }
  const work = workData[workId];
  const renderHtmlContent = (htmlContent) => {
    if (!htmlContent) return null;
    const cleanHtml = DOMPurify.sanitize(htmlContent);
    return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
  };
  return (
    <div className="project-detail">
      <div className="detail-content">
        <h2>{work.company}</h2>
        <div className="detail-info">
          {work.time && (
            <p className="project-period">
              <span className="highlight">时间：</span>
              <span className="period">{work.time}</span>
            </p>
          )}
          {work.position && (
            <div className="project-summary">
              <p>{work.position}</p>
            </div>
          )}
          {work.summary && (
            <div className="project-summary">
              <p>{work.summary}</p>
            </div>
          )}
          {work.detailContent && (
            <div className="project-details-section">
              <h3>{work.detailTitle || '详情'}</h3>
              {renderHtmlContent(work.detailContent)}
            </div>
          )}
          {work.mediaPreview && (
            <div className="media-section">
              {work.mediaDescription && (
                <p className="media-description" style={{ marginBottom: 8 }}>{work.mediaDescription}</p>
              )}
              {work.mediaType === 'video' ? (
                <div className="video-container" style={{ width: '100%', maxWidth: '1000px', maxHeight: '500px', margin: '20px auto', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <video controls className="project-video" style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain', display: 'block' }}>
                    <source src={work.mediaPreview} type="video/mp4" />
                    您的浏览器不支持视频播放
                  </video>
                </div>
              ) : (
                <div className="image-container" style={{ width: '100%', maxWidth: '1000px', maxHeight: '500px', margin: '20px auto', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={work.mediaPreview}
                    alt="工作/实习展示"
                    className="project-image"
                    style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain', display: 'block' }}
                  />
                </div>
              )}
            </div>
          )}
          {work.otherContent && (
            <div className="other-section">
              <h3>{work.otherTitle || '其他内容'}</h3>
              {renderHtmlContent(work.otherContent)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkInternshipDetail; 