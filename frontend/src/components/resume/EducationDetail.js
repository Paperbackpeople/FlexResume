import React from 'react';
import './Resume.css';

const EducationDetail = ({ educationId, educationData, onClose }) => {
  if (
    !educationData ||
    !educationData.education ||
    !educationData.education[educationId]
  ) {
    return null;
  }

  const education = educationData.education[educationId];

  const validAwards = (education.awards || []).filter(
    aw => (aw.time?.trim() || aw.name?.trim())
  );

  return (
    <div className="education-detail">
      <div className="detail-content">
        <h2>{education.school}</h2>
        <div className="detail-info">
          <div className="degree-info">
            <p className="major">
              <span className="highlight">{education.fieldOfStudy}</span>&nbsp;
              <span className="period">{education.startDate ? new Date(education.startDate).getFullYear() : ''} - {education.graduationYear ? new Date(education.graduationYear).getFullYear() : ''}</span>
            </p>
            <p className="honors">
              {education.honours && <span>{education.honours}</span>}&nbsp;
              {education.gpa && (
                <span className="GPA">
                  GPA: {education.gpa}
                  {education.ranking && `（${education.ranking}）`}
                </span>
              )}
            </p>
          </div>

          {education.courses && education.courses.length > 0 && (
            <div className="modules">
              <h3>主要课程</h3>
              <ul>
                {education.courses.map((course, index) => (
                  <li key={index}>{course.name}</li>
                ))}
              </ul>
            </div>
          )}

          {validAwards.length > 0 && (
            <div className="scholarships">
              <h3>奖学金</h3>
              <ul>
                {validAwards.map((award, index) => (
                  <li key={index} className="scholarship-item">
                    <span className="year">{award.time}</span>
                    <span className="award">{award.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationDetail;
