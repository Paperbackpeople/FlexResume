import React, { useState, useEffect, useRef } from 'react';
import Slider from '../common/Slider';
import Education from './Education';
import axios from 'axios';

function EducationSliderWapper({ username, version }) {
    const [educationList, setEducationList] = useState([{ id: 0 }]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 结构: { education1: {...}, education2: {...} }
    const [educationData, setEducationData] = useState({});

    // 定时器，10 秒自动保存
    const saveTimeoutRef = useRef(null);

    // --------------------------
    // 1. 加载时, fetch 已有数据
    // --------------------------
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`/api/education-info?username=${username}&version=${version}`);
                if (res.data && res.data.education) {
                    const eduObj = res.data.education;
                    const keys = Object.keys(eduObj);

                    const newList = keys.map((key, idx) => ({
                        id: idx,
                    }));
                    setEducationList(newList);
                    setEducationData(eduObj);
                } else {
                    setEducationList([{ id: 0 }]);
                    setEducationData({});
                }
            } catch (error) {
                console.error('Error fetching education data:', error);
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
    }, [educationData]);

    // --------------------------
    // 3. 统一保存函数
    // --------------------------
    const saveAllEducationData = async () => {
        try {
            // payload: { username, version, education: { education1: {...}, ...} }
            const payload = {
                username,
                version,
                education: educationData,
            };
            // POST /api/education-info
            const response = await axios.post('/api/education-info', payload);
            console.log('All educations saved:', response.data);
        } catch (error) {
            console.error('Error saving all education data:', error);
        }
    };

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
                    initialData={educationData[`education${index + 1}`]} // 将数据传递给子组件
                />
            )}
            addItem={addEducation}
            removeItem={removeEducation}
        />
    );
}

export default EducationSliderWapper;