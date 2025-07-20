import React, {useEffect, useState} from 'react';
import 'quill/dist/quill.snow.css'; // 引入 Quill 样式
import PersonalInfo from './components/personalInfo/PersonalInfo';
import ProjectSliderWrapper from './components/project/ProjectSliderWrapper';
import EducationSliderWapper from './components/education/ EducationSliderWrapper';
import InternshipSliderWrapper from './components/internship/InternshipSliderWrapper';
import WorkExperienceSliderWrapper from './components/workexperience/WorkExperienceSliderWrapper';
import Skill from './components/skill/Skill';
import ResumePreview from './components/resume/ResumePreview';
import ErrorBoundary from './components/resume/ErrorBoundary';
import LoginModal from './components/LoginModal';

import './App.css';

function App() {
    const [activeSection, setActiveSection] = useState('Personal Info');
    const [username, setUsername] = useState('');
    const [version, setVersion] = useState(1);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isLogin, setIsLogin] = useState(!!localStorage.getItem('token'));

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

    // 监听登录状态变化，更新用户信息
    useEffect(() => {
        if (isLogin) {
            // 登录后，从localStorage获取userId作为username
            const userId = localStorage.getItem('userId');
            if (userId) {
                setUsername(userId);
                setVersion(1); // 默认加载版本1
                console.log('用户登录成功，加载用户数据:', userId, '版本:', 1);
            }
        } else {
            // 未登录时清空用户信息
            setUsername('');
            setVersion(1);
        }
    }, [isLogin]);

    // 初始化时检查登录状态并设置用户信息
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (token && userId) {
            // 如果已有登录信息，直接设置
            setUsername(userId);
            setVersion(1);
            setIsLogin(true);
            console.log('检测到已有登录信息，加载用户数据:', userId, '版本:', 1);
        }
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
                        <PersonalInfo username={username} version={version}/>
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

            {!isLogin && (
                <div className="glass-mask">
                    <img className="glass-bg" src={process.env.PUBLIC_URL + '/image.png'} alt="bg" />
                    <div className="glass-title">FlexResume</div>
                    <LoginModal onLogin={token => {
                        localStorage.setItem('token', token);
                        setIsLogin(true);
                    }} />
                </div>
            )}

            {!isSmallScreen ? (
                isLogin ? (
                    <div className="preview">
                        <h1>Preview</h1>
                        <ErrorBoundary>
                        <ResumePreview username={username} version={version} />
                        </ErrorBoundary>
                    </div>
                ) : (
                    <div className="preview">
                        <h1>Preview</h1>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            height: '100%',
                            color: '#666',
                            fontSize: '1.2rem'
                        }}>
                            请先登录以查看简历预览
                        </div>
                    </div>
                )
                ) : (
                <button 
                    className="preview-button"
                    onClick={() => {
                    // 在新窗口或模态框中打开预览
                    window.open(`/preview/${username}/${version}`, '_blank');
                    }}
                >
                    预览简历
                </button>
                )}
        </div>
    );
}

export default App;
