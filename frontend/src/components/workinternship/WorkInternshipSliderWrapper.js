import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Slider from '../common/Slider';
import WorkInternship from './WorkInternship';
import axios from 'axios';

// 获取token的工具函数
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

function WorkInternshipSliderWrapper({ username, version }) {
  const [workList, setWorkList] = useState([{ id: 'work0' }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allWorkData, setAllWorkData] = useState({});
  const saveTimeoutRef = useRef(null);

  // 检查登录状态
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  // 从后端获取工作经历数据
  useEffect(() => {
    async function fetchWorkData() {
      if (!username || !version) return;
      if (!isLoggedIn()) {
        console.log('用户未登录，跳过工作经历数据获取');
        return;
      }
      try {
        const res = await axios.get('/api/workinternship-info', {
          params: { username, version },
          headers: getAuthHeaders()
        });
        if (res.data && res.data.workInternshipData) {
          const workData = res.data.workInternshipData;
          const keys = Object.keys(workData).sort();
          const normalizedData = {};
          keys.forEach((key) => { normalizedData[key] = workData[key]; });
          const newList = keys.map((key) => ({ id: key }));
          setWorkList(newList);
          setAllWorkData(normalizedData);
        } else {
          setWorkList([{ id: 'work0' }]);
          setAllWorkData({});
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.log('用户暂无工作经历数据');
        } else {
          console.error('fetch workinternship error:', err);
        }
      }
    }
    fetchWorkData();
  }, [username, version]);

  const isValidWorkData = (dataObj) => {
    return Object.values(dataObj).some((val) => {
      if (val == null) return false;
      if (typeof val === 'string' && val.trim() === '') return false;
      return true;
    });
  };

  const saveAllWorks = useCallback(async () => {
    if (!isLoggedIn()) {
      console.log('用户未登录，跳过工作经历数据保存');
      return;
    }
    
    if (!username || username === 'undefined' || !version) {
      console.log('用户名或版本无效，跳过工作经历数据保存', { username, version });
      return;
    }
    try {
      const filteredData = {};
      Object.entries(allWorkData).forEach(([key, value]) => {
        if (isValidWorkData(value)) {
          filteredData[key] = value;
        }
      });
      if (Object.keys(filteredData).length === 0) {
        console.log('工作经历数据全部为空, 不执行保存');
        return;
      }
      const payload = {
        username,
        version,
        workInternshipData: filteredData,
      };
      const res = await axios.post('/api/workinternship-info', payload, {
        headers: getAuthHeaders()
      });
      console.log('自动保存成功:', res.data);
    } catch (error) {
      console.error('自动保存失败:', error);
    }
  }, [allWorkData, username, version]);

  // 立即保存方法：清除定时器并立即保存当前变更
  const saveImmediately = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      // 只有存在定时器时才说明有未保存的变更
      await saveAllWorks();
    }
  }, [saveAllWorks]);

  // 监听全局保存事件
  useEffect(() => {
    const handleSaveAll = () => {
      saveImmediately();
    };
    
    window.addEventListener('saveAllData', handleSaveAll);
    return () => window.removeEventListener('saveAllData', handleSaveAll);
  }, [saveImmediately]);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveAllWorks();
    }, 10000);
    return () => clearTimeout(saveTimeoutRef.current);
  }, [allWorkData, saveAllWorks]);

  const addWork = () => {
    setWorkList((prev) => {
      const newId = `work${prev.length}`;
      const newList = [...prev, { id: newId }];
      setCurrentIndex(newList.length - 1);
      return newList;
    });
  };

  const removeWork = (removeIndex) => {
    setWorkList((prev) => {
      if (prev.length === 1) return prev;
      const newList = prev.filter((_, idx) => idx !== removeIndex);
      setCurrentIndex((prevIndex) =>
        prevIndex >= removeIndex ? Math.max(0, prevIndex - 1) : prevIndex
      );
      return newList.map((_, idx) => ({ id: `work${idx}` }));
    });
    setAllWorkData((prev) => {
      const values = Object.values(prev).filter((_, idx) => idx !== removeIndex);
      const newData = {};
      values.forEach((v, idx) => {
        newData[`work${idx}`] = v;
      });
      return newData;
    });
  };

  const handleSingleWorkChange = (workKey, newWorkData) => {
    setAllWorkData((prev) => ({
      ...prev,
      [workKey]: newWorkData,
    }));
  };

  return (
    <Slider
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      items={workList}
      renderItem={useCallback((item, idx, addItem, removeItem) => (
        <WorkInternship
          key={item.id}
          itemId={item.id}
          index={idx}
          isLast={idx === workList.length - 1}
          addWorkInternship={addItem}
          removeWorkInternship={() => removeItem(idx)}
          onChange={handleSingleWorkChange}
          initialData={allWorkData[item.id]}
        />
      ), [allWorkData, handleSingleWorkChange])}
      addItem={addWork}
      removeItem={removeWork}
    />
  );
}

export default WorkInternshipSliderWrapper; 