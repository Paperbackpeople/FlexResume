import React, { useState, useRef, useEffect, useCallback } from 'react';
import Slider from '../common/Slider';
import WorkExperience from './WorkExperience';
import axios from 'axios';

function WorkExperienceSliderWrapper({ username, version }) {
  const [workExperienceList, setWorkExperienceList] = useState([{ id: 'workexperience0' }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allWorkExperienceData, setAllWorkExperienceData] = useState({});
  const saveTimeoutRef = useRef(null);

  // 检查用户是否已登录
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return !!(token && userId);
  };

  useEffect(() => {
    async function fetchWorkExperienceData() {
      if (!username || !version) return;
      
      // 检查登录状态
      if (!isLoggedIn()) {
        console.log('用户未登录，跳过工作经验数据获取');
        return;
      }

      try {
        const res = await axios.get('/api/work-experience-info', {
          params: { username, version },
        });
        console.log('Fetched work experience data:', res.data);

        if (res.data && res.data.workExperienceData) {
          const workExperienceData = res.data.workExperienceData;
          const keys = Object.keys(workExperienceData).sort();

          const normalizedData = {};
          keys.forEach((key) => {
            normalizedData[key] = workExperienceData[key];
          });

          const newList = keys.map((key) => ({ id: key }));
          setWorkExperienceList(newList);
          setAllWorkExperienceData(normalizedData);
        } else {
          setWorkExperienceList([{ id: 'workexperience0' }]);
          setAllWorkExperienceData({});
        }
      } catch (err) {
        console.error('fetch work experience error:', err);
      }
    }
    fetchWorkExperienceData();
  }, [username, version]);

  const saveAllWorkExperiences = useCallback(async () => {
    // 检查登录状态
    if (!isLoggedIn()) {
      console.log('用户未登录，跳过工作经验数据保存');
      return;
    }

    try {
      await axios.post('/api/work-experience-info', {
        username,
        version,
        workExperienceData: allWorkExperienceData,
      });
      console.log('Work experience data saved successfully');
    } catch (err) {
      console.error('Error saving work experience data:', err);
    }
  }, [allWorkExperienceData, username, version]);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveAllWorkExperiences();
    }, 10000);

    return () => clearTimeout(saveTimeoutRef.current);
  }, [allWorkExperienceData, saveAllWorkExperiences]);

  const addWorkExperience = () => {
    setWorkExperienceList((prev) => {
      const newList = [...prev, { id: `workexperience${prev.length}` }];
      setCurrentIndex(newList.length - 1);
      return newList;
    });
  };

  const removeWorkExperience = (removeIndex) => {
    setWorkExperienceList((prev) => {
      if (prev.length === 1) return prev;
      const newList = prev.filter((_, idx) => idx !== removeIndex);

      setCurrentIndex((prevIndex) =>
        prevIndex >= removeIndex ? Math.max(0, prevIndex - 1) : prevIndex
      );
      return newList;
    });

    setAllWorkExperienceData((prev) => {
      const copy = { ...prev };
      const keyToDelete = `workexperience${removeIndex}`;
      delete copy[keyToDelete];
      return copy;
    });
  };

  const handleSingleWorkExperienceChange = (workExperienceKey, newWorkExperienceData) => {
    setAllWorkExperienceData((prev) => ({
      ...prev,
      [workExperienceKey]: newWorkExperienceData,
    }));
  };

  return (
    <Slider
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      items={workExperienceList}
      renderItem={(item, idx, addItem, removeItem) => (
        <WorkExperience
          key={item.id}
          itemId={item.id}
          index={idx}
          isLast={idx === workExperienceList.length - 1}
          addWorkExperience={addItem}
          removeWorkExperience={() => removeItem(idx)}
          onChange={handleSingleWorkExperienceChange}
          initialData={allWorkExperienceData[item.id]}
        />
      )}
      addItem={addWorkExperience}
      removeItem={removeWorkExperience}
    />
  );
}

export default WorkExperienceSliderWrapper;
