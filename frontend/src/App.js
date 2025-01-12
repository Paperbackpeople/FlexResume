import React, { useState } from 'react';
import 'quill/dist/quill.snow.css'; // 引入 Quill 样式
import PersonalInfo from './components/personalInfo/PersonalInfo';
import ProjectSliderWrapper from './components/project/ProjectSliderWrapper';
import EducationSliderWapper from './components/education/ EducationSliderWrapper';
import InternshipSliderWrapper from './components/internship/InternshipSliderWrapper';
import WorkExperienceSliderWrapper from './components/workexperience/WorkExperienceSliderWrapper';
import Skill from './components/skill/Skill';

import './App.css';

function App() {
    const [activeSection, setActiveSection] = useState('Personal Info');

    return (
        <div className="container">
            <div className="App">
                <h1>Resume Builder</h1>
                <nav className="nav">
                    <ul className="tabs">
                        {[
                            { name: 'Personal Info', icon: 'fa-user' },
                            { name: 'Education', icon: 'fa-graduation-cap' },
                            { name: 'Project', icon: 'fa-code' },
                            { name: 'Internship', icon: 'fa-building' },
                            { name: 'Work', icon: 'fa-briefcase' },
                            { name: 'Skills', icon: 'fa-lightbulb' }
                        ].map((section, index) => (
                            <li
                                key={section.name}
                                className={`tabs-item tab ${activeSection === section.name ? 'tab-is-active' : ''}`}
                                onClick={() => setActiveSection(section.name)}
                            >
                                <div className="tab-circle"></div>
                                <i className={`fa ${section.icon} tab-icon`}></i>
                                <span className="tab-name">{section.name}</span>
                            </li>
                        ))}
                    </ul>
                </nav>
                {/* Dynamic Sections */}
                {activeSection === 'Personal Info' && (
                    <div className="PersonalInfo-border">
                        <PersonalInfo />
                    </div>
                )}
                {activeSection === 'Education' && <EducationSliderWapper />}
                {activeSection === 'Project' && <ProjectSliderWrapper />}
                {activeSection === 'Internship' && <InternshipSliderWrapper />}
                {activeSection === 'Work' && <WorkExperienceSliderWrapper />}
                {activeSection === 'Skills' && <Skill />}
            </div>
            <div className="divider"></div> {/* 中间分割线 */}
            <div className="preview">
                <h1>Preview</h1>
            </div>
        </div>
    );
}

export default App;
