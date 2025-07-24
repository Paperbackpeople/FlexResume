import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  fetchPersonalInfo, 
  fetchEducationInfo, 
  fetchProjectInfo, 
  fetchSkillInfo,
  fetchWorkInternshipInfo,
  saveAllDataToCache
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
      setError(null); // 新增：不报错
      setResumeData({
        personalInfo: null,
        education: null,
        projects: null,
        workinternship: null,
        skills: null
      });
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

      // 为每个API调用添加重试机制
      const retryFetch = async (fetchFn, retries = 2) => {
        for (let i = 0; i <= retries; i++) {
          try {
            return await fetchFn();
          } catch (error) {
            if (i === retries) throw error;
            if (error.message.includes('502') || error.message.includes('Bad Gateway')) {
              console.log(`API调用失败，${2 - i}次重试剩余...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            } else {
              throw error;
            }
          }
        }
      };

      const [
        personalInfo,
        education,
        projects,
        workinternship,
        skills
      ] = await Promise.all([
        retryFetch(() => fetchPersonalInfo(username, version)),
        retryFetch(() => fetchEducationInfo(username, version)),
        retryFetch(() => fetchProjectInfo(username, version)),
        retryFetch(() => fetchWorkInternshipInfo(username, version)),
        retryFetch(() => fetchSkillInfo(username, version))
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
      // 如果是网络错误，提供更友好的错误信息
      if (err.message.includes('502') || err.message.includes('Bad Gateway')) {
        setError('服务器暂时不可用，请稍后再试');
      } else {
        setError('加载简历数据失败');
      }
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
            // 立即保存数据到Redis缓存
            saveAllDataToCache(newData, username, version);
            return newData;
          } else {
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
    }, 1000); // 500ms 防抖延迟
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