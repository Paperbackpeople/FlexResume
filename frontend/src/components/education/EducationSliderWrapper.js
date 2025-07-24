import React, { useState, useEffect, useRef, useCallback } from 'react';
import Slider from '../common/Slider';
import Education from './Education';
import axios from 'axios';

// 获取token的工具函数
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

function EducationSliderWapper({ username, version }) {
    const [educationList, setEducationList] = useState([{ id: 0 }]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 结构: { education1: {...}, education2: {...} }
    const [educationData, setEducationData] = useState({});

    // 定时器，10 秒自动保存
    const saveTimeoutRef = useRef(null);

    // 检查用户是否已登录
    const isLoggedIn = () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        return !!(token && userId);
    };

    // 判断是否有有效数据：字段非空或数组字段非空
    const isValidEducationData = (dataObj) => {
        return Object.values(dataObj).some((fieldValue) => {
            if (Array.isArray(fieldValue)) {
                return fieldValue.some((item) =>
                    Object.values(item).some((val) => val && val.trim())
                );
            }
            return fieldValue && fieldValue.toString().trim();
        });
    };

    // 统一保存函数
    const saveAllEducationData = useCallback(async () => {
        // 检查登录状态
        if (!isLoggedIn()) {
            console.log('用户未登录，跳过教育数据保存');
            return;
        }
        
        if (!username || username === 'undefined' || !version) {
            console.log('用户名或版本无效，跳过教育数据保存', { username, version });
            return;
        }

        try {
            // 过滤空数据
            const filteredData = {};
            Object.entries(educationData).forEach(([key, value]) => {
                if (isValidEducationData(value)) {
                    filteredData[key] = value;
                }
            });

            if (Object.keys(filteredData).length === 0) {
                console.log("没有有效数据，不进行保存。");
                return;
            }

            const payload = {
                username,
                version,
                education: filteredData,
            };

            // 发送保存请求 - 添加认证头
            const response = await axios.post('/api/education-info', payload, { headers: getAuthHeaders() });
            console.log('教育信息保存成功:', response.data);
        } catch (error) {
            console.error('保存教育信息时出错:', error);
            console.error('错误详情:', error.response?.data);
        }
    }, [educationData, username, version]);

    // --------------------------
    // 1. 加载时, fetch 已有数据
    // --------------------------
    useEffect(() => {
        async function fetchData() {
            // 检查登录状态
            if (!isLoggedIn()) {
                console.log('用户未登录，跳过教育数据获取');
                return;
            }

            try {
                const res = await axios.get('/api/education-info', { 
                    params: { username, version },
                    headers: getAuthHeaders()
                });
                const doc = res.data;  // doc 就是单个对象
                if (doc && doc.education) {
                    const eduObj = doc.education; // {education1: {...}, education2: {...}}
                    const newList = Object.keys(eduObj).map((key, idx) => ({ id: idx }));
                    setEducationList(newList);
                    setEducationData(eduObj);
                } else {
                    setEducationList([{ id: 0 }]);
                    setEducationData({});
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // 404 表示没有数据，这是正常的，不需要报错
                    console.log('用户暂无教育经历数据');
                } else {
                    console.error("Error fetching education data:", error);
                }
            }
        }

        if (username && version) {
            fetchData();
        }
    }, [username, version]);

    // --------------------------
    // 2. 监听 educationData, 10秒后自动保存
    // --------------------------
    useEffect(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            saveAllEducationData();
        }, 10000);

        return () => clearTimeout(saveTimeoutRef.current);
    }, [educationData, saveAllEducationData]);

    // 立即保存方法：清除定时器并立即保存当前变更
    const saveImmediately = useCallback(async () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
            // 只有存在定时器时才说明有未保存的变更
            await saveAllEducationData();
        }
    }, [saveAllEducationData]);

    // 监听全局保存事件
    useEffect(() => {
        const handleSaveAll = () => {
            saveImmediately();
        };
        
        window.addEventListener('saveAllData', handleSaveAll);
        return () => window.removeEventListener('saveAllData', handleSaveAll);
    }, [saveImmediately]);

    // --------------------------
    // 4. 子组件 -> 父组件
    // --------------------------
    const handleChildChange = (educationKey, cardData) => {
        setEducationData((prev) => ({
            ...prev,
            [educationKey]: cardData,
        }));
    };

    // 新增
    const addEducation = () => {
        setEducationList((prev) => {
            const newItem = { id: prev.length };
            return [...prev, newItem];
        });
        setCurrentIndex(educationList.length);
    };

    // 删除
    const removeEducation = (removeIndex) => {
        setEducationList((prev) => {
            if (prev.length === 1) return prev; // 保留至少1条
            const updated = prev.filter((_, i) => i !== removeIndex);
            setCurrentIndex((prevIndex) =>
                prevIndex >= removeIndex ? Math.max(0, prevIndex - 1) : prevIndex
            );
            return updated;
        });

        // 同步删除 data
        setEducationData((prev) => {
            const newData = { ...prev };
            const keyToDelete = `education${removeIndex + 1}`;
            delete newData[keyToDelete];
            return newData;
        });
    };

    // --------------------------
    // 渲染
    // --------------------------
    return (
        <Slider
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            items={educationList}
            renderItem={(item, index, addItem, removeItem) => (
                <Education
                    key={item.id}
                    index={index}
                    isLast={index === educationList.length - 1}
                    addEducation={addItem}
                    removeEducation={() => removeItem(index)}
                    onChange={handleChildChange}
                    initialData={educationData[`education${index + 1}`]}
                />
            )}
            addItem={addEducation}
            removeItem={removeEducation}
        />
    );
}

export default EducationSliderWapper;