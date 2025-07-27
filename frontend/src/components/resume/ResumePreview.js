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

const DETAIL_ANIMATION_DURATION = 500;
const CONTENT_ANIMATION_DURATION = 200;

const ResumePreview = ({ username, version, isPublishMode, snapshot }) => {
  const resumeDataHook = useResumeData(username, version);
  const resumeData = snapshot ? snapshot : resumeDataHook.resumeData;
  const loading = snapshot ? false : resumeDataHook.loading;
  const error = snapshot ? null : resumeDataHook.error;
  const refreshData = snapshot ? undefined : resumeDataHook.refreshData;
  const isRefreshing = snapshot ? false : resumeDataHook.isRefreshing;

  // 右侧面板及内容切换动画
  const [showDetail, setShowDetail] = useState(false);
  const [detailType, setDetailType] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [pendingType, setPendingType] = useState(null);
  const [pendingId, setPendingId] = useState(null);

  // 切换逻辑
  const toggleDetail = (type, id) => {
    if (showDetail && detailType === type && detailId === id) {
      handleDetailClose();
      return;
    }
    if (showDetail) {
      // 已有detail，内容切换动画
      setIsChanging(true);
      setPendingType(type);
      setPendingId(id);
      setTimeout(() => {
        setDetailType(type);
        setDetailId(id);
        setIsChanging(false);
      }, CONTENT_ANIMATION_DURATION);
    } else {
      // 首次打开
      setDetailType(type);
      setDetailId(id);
      setShowDetail(true);
    }
  };

  // 关闭
  const handleDetailClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowDetail(false);
      setDetailType(null);
      setDetailId(null);
      setPendingType(null);
      setPendingId(null);
      setIsClosing(false);
    }, DETAIL_ANIMATION_DURATION);
  };

  // 详情内容渲染函数
  const renderDetail = () => {
    if (isChanging && pendingType && pendingId) {
      // 正在切换时显示旧内容
      switch (detailType) {
        case 'education':
          return (
            <EducationDetail
              educationId={detailId}
              educationData={resumeData.education}
              onClose={handleDetailClose}
            />
          );
        case 'project':
          return (
            <ProjectDetail
              projectId={detailId}
              projectData={resumeData.projects}
              onClose={handleDetailClose}
            />
          );
        case 'work':
          return (
            <WorkInternshipDetail
              workId={detailId}
              workData={resumeData.workinternship}
              onClose={handleDetailClose}
            />
          );
        default:
          return null;
      }
    }
    // 切换动画完成后显示新内容
    switch (detailType) {
      case 'education':
        return (
          <EducationDetail
            educationId={detailId}
            educationData={resumeData.education}
            onClose={handleDetailClose}
          />
        );
      case 'project':
        return (
          <ProjectDetail
            projectId={detailId}
            projectData={resumeData.projects}
            onClose={handleDetailClose}
          />
        );
      case 'work':
        return (
          <WorkInternshipDetail
            workId={detailId}
            workData={resumeData.workinternship}
            onClose={handleDetailClose}
          />
        );
      default:
        return null;
    }
  };

  // 处理刷新
  const handleRefreshClick = () => {
    if (!isRefreshing) {
      // 先触发所有组件立即保存
      window.dispatchEvent(new CustomEvent('saveAllData'));
      
      // 等待一下让保存完成，然后刷新数据
      setTimeout(() => {
        refreshData();
      }, 500);
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
                {isRefreshing ? <span className="loading-spinner">⏳</span> : '🔄'}
              </button>
            )}
          </div>

          <PersonalInfo personalInfo={resumeData.personalInfo} />

          <Education
            educationData={resumeData.education}
            onEducationClick={(edu) => toggleDetail('education', edu.id)}
          />

          <WorkInternshipExperience
            workData={resumeData.workinternship}
            onWorkClick={(work) => toggleDetail('work', work.id)}
          />

          <ProjectExperience
            projectData={resumeData.projects}
            onProjectClick={(proj) => toggleDetail('project', proj.id)}
          />

          <Skills skillData={resumeData.skills} />
        </div>
      </div>

      {/* Detail Panel，始终存在，只切换内容 */}
      {(showDetail || isClosing) && (
        <div className={`detail-panel ${isClosing ? 'slide-leave' : 'slide-enter'}`}>
          <button className="close-btn" onClick={handleDetailClose}>
            返回总览
          </button>
          <div className={`detail-content ${isChanging ? 'fade-out' : 'fade-in'}`}>
            {renderDetail()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;