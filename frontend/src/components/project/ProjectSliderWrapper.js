import React, { useState, useEffect, useRef, useCallback } from 'react';
import Slider from '../common/Slider';
import Project from './Project';
import axios from 'axios';

function ProjectSliderWrapper({ username, version }) {
  // projectList 用来控制 Slider 里的卡片渲染。这里用 { id: 'project0' } 这种形式
  const [projectList, setProjectList] = useState([{ id: 'project0' }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 父组件保存所有卡片数据: { "project0": {...}, "project1": {...}, ... }
  const [allProjectData, setAllProjectData] = useState({});

  // 定时器 ref，用来控制 10 秒后自动保存
  const saveTimeoutRef = useRef(null);

  // 检查用户是否已登录
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return !!(token && userId);
  };

  // 1. 加载后端已有项目
  useEffect(() => {
    async function fetchProjectData() {
      if (!username || !version) return;
      
      // 检查登录状态
      if (!isLoggedIn()) {
        console.log('用户未登录，跳过项目数据获取');
        return;
      }

      try {
        const res = await axios.get('/api/project-info', {
          params: { username, version },
        });
        console.log('Fetched project data:', res.data);

        if (res.data && res.data.projectData) {
          const projectData = res.data.projectData;
          const keys = Object.keys(projectData).sort();
          
          // 修改这里的数据规范化逻辑
          const normalizedData = {};
          keys.forEach((key) => {
            // 直接使用原始的 key，不要重新生成
            normalizedData[key] = projectData[key];
          });

          // 使用原始的 key 生成列表
          const newList = keys.map((key) => ({ id: key }));

          setProjectList(newList);
          setAllProjectData(normalizedData);
        } else {
          setProjectList([{ id: 'project0' }]);
          setAllProjectData({});
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          if (err.response && err.response.status === 404) {
            // 仅开发环境下可选打印
            // console.log('用户暂无项目经历数据');
          } else {
            console.error('fetch project error:', err);
          }
        }
      }
    }
    fetchProjectData();
  }, [username, version]);

  // 判断卡片是否为空（至少有一个字段非空即认为有效）
  const isValidProjectData = (dataObj) => {
    return Object.values(dataObj).some((val) => {
      if (val == null) return false;
      if (typeof val === 'string' && val.trim() === '') return false;
      return true;
    });
  };

  // 3. 保存函数
  const saveAllProjects = useCallback(async () => {
    // 检查登录状态
    if (!isLoggedIn()) {
      console.log('用户未登录，跳过项目数据保存');
      return;
    }

    try {
      // 过滤掉完全空的卡片
      const filteredData = {};
      Object.entries(allProjectData).forEach(([key, value]) => {
        if (isValidProjectData(value)) {
          filteredData[key] = value;
        }
      });

      if (Object.keys(filteredData).length === 0) {
        console.log('项目数据全部为空, 不执行保存');
        return;
      }

      const payload = {
        username,
        version,
        projectData: filteredData,
      };
      const res = await axios.post('/api/project-info', payload);
      console.log('自动保存成功:', res.data);
    } catch (error) {
      console.error('自动保存失败:', error);
    }
  }, [allProjectData, username, version]);

  // 2. 当 allProjectData 改变后，10秒后自动保存
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveAllProjects();
    }, 10000);

    return () => clearTimeout(saveTimeoutRef.current);
  }, [allProjectData, saveAllProjects]);

  // 4. 新增/删除项目
  const addProject = () => {
    setProjectList((prev) => {
      // 新卡片 id: "project" + 下标
      const newId = `project${prev.length}`;
      const newList = [...prev, { id: newId }];
      setCurrentIndex(newList.length - 1);
      return newList;
    });
  };

  const removeProject = (removeIndex) => {
    setProjectList((prev) => {
      if (prev.length === 1) return prev; // 保证至少1卡
      const newList = prev.filter((_, idx) => idx !== removeIndex);
      setCurrentIndex((prevIndex) =>
          prevIndex >= removeIndex ? Math.max(0, prevIndex - 1) : prevIndex
      );
      // 重新编号，保证 key 连续
      return newList.map((_, idx) => ({ id: `project${idx}` }));
    });

    setAllProjectData((prev) => {
      // 重新整理 key，保证 key 连续
      const values = Object.values(prev).filter((_, idx) => idx !== removeIndex);
      const newData = {};
      values.forEach((v, idx) => {
        newData[`project${idx}`] = v;
      });
      return newData;
    });
  };

  // 子组件更新 -> 父组件
  const handleSingleProjectChange = (projKey, newProjData) => {
    setAllProjectData((prev) => ({
      ...prev,
      [projKey]: newProjData,
    }));
  };

  return (
      <Slider
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          items={projectList}
          renderItem={(item, idx, addItem, removeItem) => (
              <Project
                  key={item.id}
                  itemId={item.id} // 传入实际的id (e.g. "project0")
                  index={idx}
                  isLast={idx === projectList.length - 1}
                  addProject={addItem}
                  removeProject={() => removeItem(idx)}
                  onChange={handleSingleProjectChange}
                  // 传入已保存的数据
                  initialData={allProjectData[item.id]}
              />
          )}
          addItem={addProject}
          removeItem={removeProject}
      />
  );
}

export default ProjectSliderWrapper;