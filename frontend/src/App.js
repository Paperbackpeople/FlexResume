import React, {useEffect, useState} from 'react';
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
    const [username, setUsername] = useState('');
    const [version, setVersion] = useState(1);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // 动态检测屏幕大小
    useEffect(() => {
        const handleResize = () => {
            // 如果屏幕宽度小于 768px，认为是小屏幕
            setIsSmallScreen(window.innerWidth < 768);
        };

        // 初始化检测
        handleResize();

        // 添加事件监听
        window.addEventListener('resize', handleResize);

        // 清理事件监听
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        // 模拟从 API 或登录状态中获取
        setUsername('zhaoyu');
        setVersion(1);
    }, []);
    return (
        <div className="container">
            <div className="App">
                <h1>Resume Builder</h1>
                <nav className="nav">
                    <ul className="tabs">
                        {[
                            {name: 'Personal Info', icon: 'fa-user'},
                            {name: 'Education', icon: 'fa-graduation-cap'},
                            {name: 'Project', icon: 'fa-code'},
                            {name: 'Internship', icon: 'fa-building'},
                            {name: 'Work', icon: 'fa-briefcase'},
                            {name: 'Skills', icon: 'fa-lightbulb'}
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
                <div className="dynamic-sections">
                    <div className={`section ${activeSection === 'Personal Info' ? 'is-visible' : 'is-hidden'}`}>
                        <PersonalInfo/>
                    </div>
                    <div className={`section ${activeSection === 'Education' ? 'is-visible' : 'is-hidden'}`}>
                        <EducationSliderWapper username={username} version={version}/>
                    </div>
                    <div className={`section ${activeSection === 'Project' ? 'is-visible' : 'is-hidden'}`}>
                        <ProjectSliderWrapper username={username} version={version} />
                    </div>
                    <div className={`section ${activeSection === 'Internship' ? 'is-visible' : 'is-hidden'}`}>
                        <InternshipSliderWrapper username={username} version={version} />
                    </div>
                    <div className={`section ${activeSection === 'Work' ? 'is-visible' : 'is-hidden'}`}>
                        <WorkExperienceSliderWrapper username={username} version={version} />
                    </div>
                    <div className={`section ${activeSection === 'Skills' ? 'is-visible' : 'is-hidden'}`}>
                        <Skill username={username} version={version}/>
                    </div>
                </div>
            </div>
            {/* 中间分割线 */}
            {!isSmallScreen && (<div className="divider"></div>)}

            {!isSmallScreen &&
                (<div className="preview">
                        <h1>Preview</h1>
                        <button 
                            onClick={() => window.open(`/resume/${username}/${version}`, '_blank')}
                            className="preview-button"
                        >
                            Open Preview
                        </button>
                    </div>
                )}
        </div>
    );
}

export default App;
