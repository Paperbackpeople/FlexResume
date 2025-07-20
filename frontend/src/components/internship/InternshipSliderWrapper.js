import React, { useState, useRef, useEffect, useCallback } from 'react';
import Slider from '../common/Slider';
import Internship from './Internship';
import axios from 'axios';

function InternshipSliderWrapper({ username, version }) {
  const [internshipList, setInternshipList] = useState([{ id: 'internship0' }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allInternshipData, setAllInternshipData] = useState({});
  const saveTimeoutRef = useRef(null);

  // 检查用户是否已登录
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return !!(token && userId);
  };

  // 1. 加载后端已有实习经历
  useEffect(() => {
    async function fetchInternshipData() {
      if (!username || !version) return;
      
      // 检查登录状态
      if (!isLoggedIn()) {
        console.log('用户未登录，跳过实习数据获取');
        return;
      }

      try {
        const res = await axios.get('/api/internship-info', {
          params: { username, version },
        });
        console.log('Fetched internship data:', res.data);

        if (res.data && res.data.internshipData) {
          const internshipData = res.data.internshipData;
          const keys = Object.keys(internshipData).sort();
          
          // 使用原始的 key
          const normalizedData = {};
          keys.forEach((key) => {
            normalizedData[key] = internshipData[key];
          });

          const newList = keys.map((key) => ({ id: key }));
          setInternshipList(newList);
          setAllInternshipData(normalizedData);
        } else {
          setInternshipList([{ id: 'internship0' }]);
          setAllInternshipData({});
        }
      } catch (err) {
        console.error('fetch internship error:', err);
      }
    }
    fetchInternshipData();
  }, [username, version]);

  // 2. 当数据改变后，10秒后自动保存
  const saveAllInternships = useCallback(async () => {
    // 检查登录状态
    if (!isLoggedIn()) {
      console.log('用户未登录，跳过实习数据保存');
      return;
    }

    try {
      const filteredData = {};
      Object.entries(allInternshipData).forEach(([key, value]) => {
        if (isValidInternshipData(value)) {
          filteredData[key] = value;
        }
      });

      if (Object.keys(filteredData).length === 0) {
        console.log('实习数据全部为空, 不执行保存');
        return;
      }

      const payload = {
        username,
        version,
        internshipData: filteredData,
      };
      const res = await axios.post('/api/internship-info', payload);
      console.log('自动保存成功:', res.data);
    } catch (error) {
      console.error('自动保存失败:', error);
    }
  }, [allInternshipData, username, version]);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveAllInternships();
    }, 10000);

    return () => clearTimeout(saveTimeoutRef.current);
  }, [allInternshipData, saveAllInternships]);

  // 判断数据是否为空
  const isValidInternshipData = (dataObj) => {
    return Object.values(dataObj).some((val) => {
      if (val == null) return false;
      if (typeof val === 'string' && val.trim() === '') return false;
      return true;
    });
  };

  // 4. 新增/删除实习经历
  const addInternship = () => {
    setInternshipList((prev) => {
      const newId = `internship${prev.length}`;
      const newList = [...prev, { id: newId }];
      setCurrentIndex(newList.length - 1);
      return newList;
    });
  };

  const removeInternship = (removeIndex) => {
    setInternshipList((prev) => {
      if (prev.length === 1) return prev;
      const newList = prev.filter((_, idx) => idx !== removeIndex);

      setCurrentIndex((prevIndex) =>
        prevIndex >= removeIndex ? Math.max(0, prevIndex - 1) : prevIndex
      );
      return newList;
    });

    setAllInternshipData((prev) => {
      const copy = { ...prev };
      const keyToDelete = `internship${removeIndex}`;
      delete copy[keyToDelete];
      return copy;
    });
  };

  // 子组件更新 -> 父组件
  const handleSingleInternshipChange = (internshipKey, newInternshipData) => {
    setAllInternshipData((prev) => ({
      ...prev,
      [internshipKey]: newInternshipData,
    }));
  };

  return (
    <Slider
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      items={internshipList}
      renderItem={(item, idx, addItem, removeItem) => (
        <Internship
          key={item.id}
          itemId={item.id}
          index={idx}
          isLast={idx === internshipList.length - 1}
          addInternship={addItem}
          removeInternship={() => removeItem(idx)}
          onChange={handleSingleInternshipChange}
          initialData={allInternshipData[item.id]}
        />
      )}
      addItem={addInternship}
      removeItem={removeInternship}
    />
  );
}

export default InternshipSliderWrapper;
