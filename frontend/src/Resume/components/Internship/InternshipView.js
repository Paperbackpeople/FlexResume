import React, { useState } from 'react';
import './InternshipView.css';

const InternshipView = ({ data }) => {
    const [selectedInternship, setSelectedInternship] = useState(null);

    if (!data?.internshipData) return null;

    return (
        <div className="internship-section">
            <h2>Internship Experience</h2>
            <div className="internship-list">
                {Object.entries(data.internshipData).map(([key, internship]) => (
                    <div 
                        key={key}
                        className="internship-item"
                        onClick={() => setSelectedInternship(internship)}
                    >
                        <div className="internship-header">
                            <h3>{internship.companyName}</h3>
                            <span className="duration">{internship.duration}</span>
                        </div>
                        <p className="position">{internship.position}</p>
                        <p className="summary">{internship.summary}</p>
                    </div>
                ))}
            </div>

            {selectedInternship && (
                <div className="internship-detail-modal">
                    <div className="modal-content">
                        <button 
                            className="close-button"
                            onClick={() => setSelectedInternship(null)}
                        >
                            ×
                        </button>
                        <h2>{selectedInternship.companyName}</h2>
                        <div className="detail-content">
                            <div className="header-info">
                                <p className="position">{selectedInternship.position}</p>
                                <p className="duration">{selectedInternship.duration}</p>
                            </div>
                            <div className="main-content">
                                <h3>{selectedInternship.detailTitle}</h3>
                                <div dangerouslySetInnerHTML={{ __html: selectedInternship.detailContent }} />
                                
                                {selectedInternship.mediaPreview && (
                                    <div className="media-section">
                                        {selectedInternship.mediaType === 'image' ? (
                                            <img 
                                                src={selectedInternship.mediaPreview} 
                                                alt="Internship media" 
                                            />
                                        ) : (
                                            <video controls>
                                                <source src={selectedInternship.mediaPreview} type="video/mp4" />
                                                Your browser does not support video playback.
                                            </video>
                                        )}
                                        <p className="media-description">
                                            {selectedInternship.mediaDescription}
                                        </p>
                                    </div>
                                )}

                                <h3>{selectedInternship.otherTitle}</h3>
                                <div dangerouslySetInnerHTML={{ __html: selectedInternship.otherContent }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternshipView; 