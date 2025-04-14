import React from 'react';
import './SkillView.css';

const SkillView = ({ data }) => {
    if (!data?.skillData) return null;

    return (
        <div className="skill-section">
            <h2>Skills</h2>
            <div className="skills-container">
                {Object.entries(data.skillData).map(([category, skills]) => (
                    <div key={category} className="skill-category">
                        <h3>{category}</h3>
                        <div className="skill-list">
                            {skills.map((skill, index) => (
                                <div key={index} className="skill-item">
                                    <span className="skill-name">{skill.name}</span>
                                    <div className="skill-level">
                                        <div 
                                            className="skill-progress"
                                            style={{ width: `${skill.level}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillView; 