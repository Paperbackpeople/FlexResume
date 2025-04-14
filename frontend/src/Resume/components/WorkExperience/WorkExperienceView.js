import React, { useState } from 'react';
import './WorkExperienceView.css';

const WorkExperienceView = ({ data }) => {
    const [selectedWork, setSelectedWork] = useState(null);

    if (!data?.workExperienceData) return null;

    return (
        <div className="work-section">
            <h2>Work Experience</h2>
            <div className="work-list">
                {Object.entries(data.workExperienceData).map(([key, work]) => (
                    <div 
                        key={key}
                        className="work-item"
                        onClick={() => setSelectedWork(work)}
                    >
                        <div className="work-header">
                            <h3>{work.companyName}</h3>
                            <span className="duration">{work.duration}</span>
                        </div>
                        <p className="position">{work.position}</p>
                        <p className="summary">{work.summary}</p>
                    </div>
                ))}
            </div>

            {selectedWork && (
                <div className="work-detail-modal">
                    <div className="modal-content">
                        <button 
                            className="close-button"
                            onClick={() => setSelectedWork(null)}
                        >
                            ×
                        </button>
                        <h2>{selectedWork.companyName}</h2>
                        <div className="detail-content">
                            <div className="header-info">
                                <p className="position">{selectedWork.position}</p>
                                <p className="duration">{selectedWork.duration}</p>
                            </div>
                            <div className="main-content">
                                <h3>{selectedWork.detailTitle}</h3>
                                <div dangerouslySetInnerHTML={{ __html: selectedWork.detailContent }} />
                                
                                {selectedWork.mediaPreview && (
                                    <div className="media-section">
                                        {selectedWork.mediaType === 'image' ? (
                                            <img 
                                                src={selectedWork.mediaPreview} 
                                                alt="Work media" 
                                            />
                                        ) : (
                                            <video controls>
                                                <source src={selectedWork.mediaPreview} type="video/mp4" />
                                                Your browser does not support video playback.
                                            </video>
                                        )}
                                        <p className="media-description">
                                            {selectedWork.mediaDescription}
                                        </p>
                                    </div>
                                )}

                                <h3>{selectedWork.otherTitle}</h3>
                                <div dangerouslySetInnerHTML={{ __html: selectedWork.otherContent }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkExperienceView; 