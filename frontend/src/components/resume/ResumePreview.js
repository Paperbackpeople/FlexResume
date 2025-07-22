import React, { useState } from 'react';
import PersonalInfo from './PersonalInfo';
import Education from './Education';
import ProjectExperience from './ProjectExperience';
import Skills from './Skills';
import EducationDetail from './EducationDetail';
import ProjectDetail from './ProjectDetail';
import WorkInternshipExperience from './WorkInternshipExperience';
import WorkInternshipDetail from './WorkInternshipDetail';
import { useResumeData } from '../../hooks/useResumeData';
import './Resume.css';

const ResumePreview = ({ username, version, isPublishMode, snapshot }) => {
  // 始终调用 useResumeData
  const resumeDataHook = useResumeData(username, version);

  // 根据 snapshot 是否存在决定用哪个数据
  const resumeData = snapshot ? snapshot : resumeDataHook.resumeData;
  const loading = snapshot ? false : resumeDataHook.loading;
  const error = snapshot ? null : resumeDataHook.error;
  const refreshData = snapshot ? undefined : resumeDataHook.refreshData;
  const isRefreshing = snapshot ? false : resumeDataHook.isRefreshing;
  
  // 详情面板状态
  const [showDetail, setShowDetail] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentEducationId, setCurrentEducationId] = useState(null);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [currentWorkId, setCurrentWorkId] = useState(null);
  const DETAIL_ANIMATION_DURATION = 500; // ms，和CSS动画一致
  // 新增：用于缓存待打开的 detail
  const [pendingDetail, setPendingDetail] = useState(null);

  // 处理教育详情
  const handleEducationClick = (education) => {
    if (showDetail) {
      setPendingDetail({ type: 'education', id: education.id });
      handleDetailClose();
    } else {
      setCurrentProjectId(null);
      setCurrentWorkId(null);
      setCurrentEducationId(education.id);
      setShowDetail(true);
    }
  };

  // 处理项目详情
  const handleProjectClick = (project) => {
    if (showDetail) {
      setPendingDetail({ type: 'project', id: project.id });
      handleDetailClose();
    } else {
      setCurrentEducationId(null);
      setCurrentWorkId(null);
      setCurrentProjectId(project.id);
      setShowDetail(true);
    }
  };

  // 处理工作经历详情
  const handleWorkClick = (work) => {
    if (showDetail) {
      setPendingDetail({ type: 'work', id: work.id });
      handleDetailClose();
    } else {
      setCurrentEducationId(null);
      setCurrentProjectId(null);
      setCurrentWorkId(work.id);
      setShowDetail(true);
    }
  };

  // 修改关闭详情面板函数
  const handleDetailClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDetail(false);
      setCurrentProjectId(null);
      setCurrentEducationId(null);
      setCurrentWorkId(null);
      setIsClosing(false);
      // 动画结束后，如果有待打开的 detail，则自动打开
      if (pendingDetail) {
        if (pendingDetail.type === 'education') {
          setCurrentEducationId(pendingDetail.id);
          setShowDetail(true);
        } else if (pendingDetail.type === 'project') {
          setCurrentProjectId(pendingDetail.id);
          setShowDetail(true);
        } else if (pendingDetail.type === 'work') {
          setCurrentWorkId(pendingDetail.id);
          setShowDetail(true);
        }
        setPendingDetail(null);
      }
    }, DETAIL_ANIMATION_DURATION);
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
  <div className={`resume-preview-container ${showDetail ? 'show-detail' : ''}`} style={{ position: 'relative' }}>
    <div className="resume-container">
      <div className="resume">
        <div className="resume-header">
          <h1>个人简历</h1>
          {!isPublishMode && (
            <button 
              className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              title={isRefreshing ? "刷新中..." : "刷新数据"}
            >
              {isRefreshing ? '⏳' : '🔄'}
            </button>
          )}
        </div>
        
        <PersonalInfo personalInfo={resumeData.personalInfo} />
        
        <Education 
          educationData={resumeData.education} 
          onEducationClick={handleEducationClick}
        />
        
        <WorkInternshipExperience 
          workData={resumeData.workinternship} 
          onWorkClick={handleWorkClick}
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
          
          {currentProjectId && (
            <ProjectDetail
              projectId={currentProjectId}
              projectData={resumeData.projects}
              onClose={handleDetailClose}
            />
          )}

          {currentWorkId && (
            <WorkInternshipDetail
              workId={currentWorkId}
              workData={resumeData.workinternship}
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
