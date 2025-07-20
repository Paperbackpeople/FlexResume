import React, { useState } from 'react';
import PersonalInfo from './PersonalInfo';
import Education from './Education';
import ProjectExperience from './ProjectExperience';
import InternshipExperience from './InternshipExperience';
import Skills from './Skills';
import EducationDetail from './EducationDetail';
import ProjectDetail from './ProjectDetail';
import InternshipDetail from './InternshipDetail';
import { useResumeData } from '../../hooks/useResumeData';
import './Resume.css';

const ResumePreview = ({ username, version }) => {
  // 使用自定义hook获取简历数据
  const { resumeData, loading, error, refreshData, isRefreshing } = useResumeData(username, version);
  
  // 详情面板状态
  const [showDetail, setShowDetail] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentEducationId, setCurrentEducationId] = useState(null);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [currentInternshipId, setCurrentInternshipId] = useState(null);

  // 处理教育详情
  const handleEducationClick = (education) => {
    if (showDetail) {
      handleDetailClose();
      setTimeout(() => {
        setCurrentProjectId(null);
        setCurrentInternshipId(null);
        setCurrentEducationId(education.id);
        setShowDetail(true);
      }, 300);
    } else {
      setCurrentProjectId(null);
      setCurrentInternshipId(null);
      setCurrentEducationId(education.id);
      setShowDetail(true);
    }
  };

  // 处理项目详情
  const handleProjectClick = (project) => {
    if (showDetail) {
      handleDetailClose();
      setTimeout(() => {
        setCurrentEducationId(null);
        setCurrentInternshipId(null);
        setCurrentProjectId(project.id);
        setShowDetail(true);
      }, 300);
    } else {
      setCurrentEducationId(null);
      setCurrentInternshipId(null);
      setCurrentProjectId(project.id);
      setShowDetail(true);
    }
  };

  // 处理实习详情
  const handleInternshipClick = (internship) => {
    if (showDetail) {
      handleDetailClose();
      setTimeout(() => {
        setCurrentProjectId(null);
        setCurrentEducationId(null);
        setCurrentInternshipId(internship.id);
        setShowDetail(true);
      }, 300);
    } else {
      setCurrentProjectId(null);
      setCurrentEducationId(null);
      setCurrentInternshipId(internship.id);
      setShowDetail(true);
    }
  };

  // 修改关闭详情面板函数
  const handleDetailClose = () => {
    setIsClosing(true);
    // 等待淡出动画完成后再清除状态
    setTimeout(() => {
      setShowDetail(false);
      setCurrentProjectId(null);
      setCurrentEducationId(null);
      setCurrentInternshipId(null);
      setIsClosing(false);
    }, 500); // 与CSS动画时长一致
  };

  // 处理刷新按钮点击
  const handleRefreshClick = () => {
    if (!isRefreshing) {
      refreshData();
    }
  };

  if (loading) {
    return (
      <div className="resume-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resume-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
  <div className={`resume-preview-container ${showDetail ? 'show-detail' : ''}`}>
          <div className="resume-container">
        <div className="resume">
          <div className="resume-header">
            <h1>个人简历</h1>
            <button 
              className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              title={isRefreshing ? "刷新中..." : "刷新数据"}
            >
              {isRefreshing ? '⏳' : '🔄'}
            </button>
          </div>
        
        <PersonalInfo personalInfo={resumeData.personalInfo} />
        
        <Education 
          educationData={resumeData.education} 
          onEducationClick={handleEducationClick}
        />
        
        <InternshipExperience 
          internshipData={resumeData.internships} 
          onInternshipClick={handleInternshipClick}
        />
        
        <ProjectExperience 
          projectData={resumeData.projects} 
          onProjectClick={handleProjectClick}
        />
        
        <Skills skillData={resumeData.skills} />
      </div>
    </div>

    {/* 详情面板 - 添加离开动画控制 */}
    {(showDetail || isClosing) && (
      <div className={`detail-panel ${showDetail && !isClosing ? 'slide-enter' : ''} ${isClosing ? 'slide-leave' : ''}`}>
        <button className="close-btn" onClick={handleDetailClose}>
          返回总览
        </button>
        <div className="detail-content">
          {currentEducationId && (
            <EducationDetail
              educationId={currentEducationId}
              educationData={resumeData.education}
              onClose={handleDetailClose}
            />
          )}
          
          {currentInternshipId && (
            <InternshipDetail
              internshipId={currentInternshipId}
              internshipData={resumeData.internships}
              onClose={handleDetailClose}
            />
          )}
          
          {currentProjectId && (
            <ProjectDetail
              projectId={currentProjectId}
              projectData={resumeData.projects}
              onClose={handleDetailClose}
            />
          )}
        </div>
      </div>
    )}
  </div>
);

};

export default ResumePreview;
