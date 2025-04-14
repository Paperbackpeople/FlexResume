import React, { useState } from 'react';
import './ProjectView.css';

const ProjectView = ({ data }) => {
    const [selectedProject, setSelectedProject] = useState(null);

    if (!data?.projectData) return null;

    return (
        <div className="project-section">
            <h2>Project Experience</h2>
            <div className="project-list">
                {Object.entries(data.projectData).map(([key, project]) => (
                    <div 
                        key={key}
                        className="project-item"
                        onClick={() => setSelectedProject(project)}
                    >
                        <h3>{project.name}</h3>
                        <p className="project-summary">{project.summary}</p>
                        <div className="tech-stack">
                            {project.technologies?.map((tech, index) => (
                                <span key={index} className="tech-tag">{tech}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {selectedProject && (
                <div className="project-detail-modal">
                    <div className="modal-content">
                        <button 
                            className="close-button"
                            onClick={() => setSelectedProject(null)}
                        >
                            ×
                        </button>
                        <h2>{selectedProject.name}</h2>
                        <div className="detail-content">
                            <p>{selectedProject.description}</p>
                            {selectedProject.mediaPreview && (
                                <div className="media-preview">
                                    {selectedProject.mediaType === 'image' ? (
                                        <img 
                                            src={selectedProject.mediaPreview} 
                                            alt="Project preview" 
                                        />
                                    ) : (
                                        <video controls>
                                            <source src={selectedProject.mediaPreview} type="video/mp4" />
                                            Your browser does not support video playback.
                                        </video>
                                    )}
                                </div>
                            )}
                            <div className="project-details">
                                <h3>Details</h3>
                                <div dangerouslySetInnerHTML={{ __html: selectedProject.detailContent }} />
                            </div>
                            <div className="additional-info">
                                <h3>{selectedProject.otherTitle}</h3>
                                <div dangerouslySetInnerHTML={{ __html: selectedProject.otherContent }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectView; 