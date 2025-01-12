import React, { useState, useEffect, useRef } from 'react';
import Slider from '../common/Slider';
import Education from './Education'; // 刚才的子组件
import axios from 'axios';

function EducationSliderWapper() {
    const [educationList, setEducationList] = useState([{ id: 0 }]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 整体数据: { education1: {...}, education2: {...} }
    const [educationData, setEducationData] = useState({});

    // 定时器，10 秒自动保存
    const saveTimeoutRef = useRef(null);

    // 监听 educationData 变化，10秒后自动保存
    useEffect(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            saveAllEducationData();
        }, 10000);

        return () => clearTimeout(saveTimeoutRef.current);
    }, [educationData]);

    // 父组件一次性 POST 到后端
    const saveAllEducationData = async () => {
        try {
            // 后端期望的结构: { education: { education1: {...}, education2: {...} } }
            const payload = { education: educationData };
            const response = await axios.post('/api/education-info', payload);
            console.log('All educations saved:', response.data);
        } catch (error) {
            console.error('Error saving all education data:', error);
        }
    };

    // 子组件传回：key = "education1" / "education2" ... , value = {...}
    const handleChildChange = (educationKey, cardData) => {
        setEducationData((prev) => ({
            ...prev,
            [educationKey]: cardData,
        }));
    };

    // 新增一条 Education
    const addEducation = () => {
        setEducationList((prev) => {
            const newItem = { id: prev.length };
            return [...prev, newItem];
        });
        setCurrentIndex(educationList.length);
    };

    // 删除一条 Education
    const removeEducation = (removeIndex) => {
        setEducationList((prev) => {
            if (prev.length === 1) return prev; // 至少一项
            const updated = [...prev];
            updated.splice(removeIndex, 1);
            return updated;
        });
        setCurrentIndex((prev) => Math.max(0, prev - 1));

        // 同时从 educationData 中删除对应 key
        setEducationData((prev) => {
            const newData = { ...prev };
            const keyToDelete = `education${removeIndex + 1}`;
            delete newData[keyToDelete];
            return newData;
        });
    };

    return (
        <Slider
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            items={educationList}
            renderItem={(item, index, addItem, removeItem) => (
                <Education
                    key={item.id}
                    index={index} // 让 child 里以 index+1 显示
                    isLast={index === educationList.length - 1}
                    addEducation={addItem}
                    removeEducation={() => removeItem(index)}
                    onChange={handleChildChange} // 核心: 接收每个子组件的数据
                />
            )}
            addItem={addEducation}
            removeItem={removeEducation}
        />
    );
}

export default EducationSliderWapper;