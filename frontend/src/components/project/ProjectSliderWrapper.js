import React, { useState, useEffect, useRef } from 'react';
import Slider from '../common/Slider';
import Project from './Project';
import axios from 'axios';

function ProjectSliderWrapper({ username, version }) {
  const [projectList, setProjectList] = useState([{ id: 0 }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allProjectData, setAllProjectData] = useState({}); 
  // or use an array if you prefer. Example: { project0: {...}, project1: {...}, ...}

  const saveTimeoutRef = useRef(null);

  // --------------------
  // 1. 初始化: fetch 已有数据
  // --------------------
  useEffect(() => {
    async function fetchProjectData() {
      try {
        const res = await axios.get('/api/project-info'); 
        // 假设后端返回一个对象数组: 
        // e.g. [{ id: 0, time: '', name: '', ...}, { id: 1, time:'', name:'', ...}, ...]
        // 也可能返回别的结构，请自行调整
        const data = res.data;

        // 假设我们存成跟 projectList 相似的结构:
        // data: [ { id:0, time:'2022', name:'xx', ... }, {...} ]
        if (data && data.length > 0) {
          setProjectList(data.map((item, idx) => ({ ...item, id: idx })));
          // 也可以将 data 映射到 allProjectData
          const tempObj = {};
          data.forEach((item, idx) => {
            tempObj[`project${idx}`] = item; 
          });
          setAllProjectData(tempObj);
        }
      } catch (err) {
        console.error('fetch project error:', err);
      }
    }
    fetchProjectData();
  }, []);

  // --------------------
  // 2. 监听 allProjectData 变化，10 秒后保存到后端
  // --------------------
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveAllProjects();
    }, 10000);

    return () => clearTimeout(saveTimeoutRef.current);
  }, [allProjectData]);

  // 统一保存函数
  const saveAllProjects = async () => {
    try {
      // demo: { username, version } 也发送给后端
      // 结构可根据你的后端接口需求而定
      const payload = {
        username,
        version,
        projectData: allProjectData,
      };
      const res = await axios.post('/api/project-all', payload);
      console.log('所有项目保存成功: ', res.data);
    } catch (error) {
      console.error('save all projects error:', error);
    }
  };

  // --------------------
  // 3. 新增/删除 project
  // --------------------
  const addProject = () => {
    setProjectList((prev) => {
      const newList = [...prev, { id: prev.length }];
      setCurrentIndex(newList.length - 1);
      return newList;
    });
  };

  const removeProject = (removeIndex) => {
    setProjectList((prev) => {
      if (prev.length === 1) return prev;
      const newList = prev.filter((_, idx) => idx !== removeIndex);

      setCurrentIndex((prevIndex) =>
        prevIndex >= removeIndex ? Math.max(0, prevIndex - 1) : prevIndex
      );
      return newList;
    });
    // 同时从 allProjectData 删除
    setAllProjectData((prev) => {
      const copy = { ...prev };
      delete copy[`project${removeIndex}`];
      return copy;
    });
  };

  // --------------------
  // 4. 子组件更新(单卡) -> 父组件合并到 allProjectData
  // --------------------
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
          index={idx}
          isLast={idx === projectList.length - 1}
          addProject={addItem}
          removeProject={() => removeItem(idx)}
          // 给子组件一个回调，用于把单卡数据传上来
          onChange={handleSingleProjectChange}
        />
      )}
      addItem={addProject}
      removeItem={removeProject}
    />
  );
}

export default ProjectSliderWrapper;
