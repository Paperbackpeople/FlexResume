import React, { useState } from 'react';
import './EducationView.css';

const EducationView = ({ data }) => {
    const [selectedSchool, setSelectedSchool] = useState(null);

    if (!data?.education) return null;

    const handleSchoolClick = (schoolData) => {
        setSelectedSchool(schoolData);
    };

    return (
        <div className="education-section">
            <h2>Education</h2>
            <div className="education-list">
                {Object.entries(data.education).map(([key, edu]) => (
                    <div 
                        key={key}
                        className="education-item"
                        onClick={() => handleSchoolClick(edu)}
                    >
                        <div className="edu-left">
                            <div className="edu-period">{edu.duration}</div>
                            {edu.logo && (
                                <div className="edu-logo">
                                    <img src={edu.logo} alt="School logo" />
                                </div>
                            )}
                        </div>
                        <div className="edu-content">
                            <h3>{edu.school}</h3>
                            <p>Major: {edu.major}</p>
                            <p>Degree: {edu.degree}</p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedSchool && (
                <div className="education-detail">
                    <button onClick={() => setSelectedSchool(null)}>Close</button>
                    <h2>{selectedSchool.school}</h2>
                    <div className="detail-content">
                        <p>Duration: {selectedSchool.duration}</p>
                        <p>Major: {selectedSchool.major}</p>
                        <p>GPA: {selectedSchool.gpa}</p>
                        {/* 其他详细信息 */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EducationView; 