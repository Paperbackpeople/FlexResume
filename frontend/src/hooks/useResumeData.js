import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  fetchPersonalInfo, 
  fetchEducationInfo, 
  fetchProjectInfo, 
  fetchSkillInfo,
  fetchWorkInternshipInfo
} from '../utils/api';

export const useResumeData = (username, version) => {
  const [resumeData, setResumeData] = useState({
    personalInfo: null,
    education: null,
    projects: null,
    workinternship: null,
    skills: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // 新增：刷新状态
  const refreshTimeoutRef = useRef(null); // 新增：防抖定时器

  // 检查用户是否已登录
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return !!(token && userId);
  };

  const loadResumeData = useCallback(async () => {
    if (!username || !version) {
      setLoading(false);
      return;
    }

    // 检查登录状态
    if (!isLoggedIn()) {
      console.log('用户未登录，跳过数据获取');
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [
        personalInfo,
        education,
        projects,
        workinternship,
        skills
      ] = await Promise.all([
        fetchPersonalInfo(username, version),
        fetchEducationInfo(username, version),
        fetchProjectInfo(username, version),
        fetchWorkInternshipInfo(username, version),
        fetchSkillInfo(username, version)
      ]);

      setResumeData({
        personalInfo,
        education,
        projects,
        workinternship,
        skills
      });
    } catch (err) {
      console.error('Error loading resume data:', err);
      setError('加载简历数据失败');
    } finally {
      setLoading(false);
    }
  }, [username, version]);

  // 初始加载
  useEffect(() => {
    loadResumeData();
  }, [loadResumeData]);

  // 手动刷新函数（带防抖）
  const refreshData = useCallback(() => {
    // 如果正在刷新中，直接返回
    if (isRefreshing) {
      console.log('正在刷新中，请稍后再试');
      return;
    }

    // 检查登录状态
    if (!isLoggedIn()) {
      console.log('用户未登录，跳过手动刷新');
      return;
    }

    // 清除之前的定时器
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // 设置防抖延迟（500ms）
    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        setIsRefreshing(true);
        console.log('开始手动刷新数据...');

        const [
          personalInfo,
          education,
          projects,
          workinternship,
          skills
        ] = await Promise.all([
          fetchPersonalInfo(username, version),
          fetchEducationInfo(username, version),
          fetchProjectInfo(username, version),
          fetchWorkInternshipInfo(username, version),
          fetchSkillInfo(username, version)
        ]);

        setResumeData(prevData => {
          const newData = {
            personalInfo,
            education,
            projects,
            workinternship,
            skills
          };

          // 智能比较数据是否有变化
          const hasChanged = 
            JSON.stringify(prevData.personalInfo) !== JSON.stringify(newData.personalInfo) ||
            JSON.stringify(prevData.education) !== JSON.stringify(newData.education) ||
            JSON.stringify(prevData.projects) !== JSON.stringify(newData.projects) ||
            JSON.stringify(prevData.workinternship) !== JSON.stringify(newData.workinternship) ||
            JSON.stringify(prevData.skills) !== JSON.stringify(newData.skills);
          
          if (hasChanged) {
            console.log('检测到数据更新，刷新预览');
            return newData;
          } else {
            console.log('数据无变化');
            return prevData;
          }
        });

        setError(null);
      } catch (err) {
        console.error('手动刷新数据失败:', err);
        setError('刷新数据失败');
      } finally {
        setIsRefreshing(false);
      }
    }, 500); // 500ms 防抖延迟
  }, [username, version, isRefreshing]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  return {
    resumeData,
    loading,
    error,
    refreshData,
    isRefreshing // 新增：返回刷新状态
  };
}; 