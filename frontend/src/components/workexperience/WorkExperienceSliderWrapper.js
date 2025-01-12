import React, { useState } from 'react';
import Slider from '../common/Slider';
import WorkExperience from './WorkExperience'; // 引入你刚才创建的 WorkExperience 组件

function WorkExperienceSliderWrapper() {
  const [workExperienceList, setWorkExperienceList] = useState([{ id: 0 }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 新增一条 WorkExperience
  const addWorkExperience = () => {
    setWorkExperienceList((prev) => {
      const newList = [...prev, { id: prev.length }];
      // 移动到新增卡片
      setCurrentIndex(newList.length - 1);
      return newList;
    });
  };

  // 删除一条 WorkExperience
  const removeWorkExperience = (removeIndex) => {
    setWorkExperienceList((prev) => {
      if (prev.length === 1) return prev; // 保证至少一项

      const newList = prev.filter((_, index) => index !== removeIndex);
      // 如果当前删除的是最后一张，回退到上一张
      setCurrentIndex((prevIndex) =>
        prevIndex >= removeIndex ? Math.max(0, prevIndex - 1) : prevIndex
      );
      return newList;
    });
  };

  return (
    <Slider
      // 必须把父组件维护的 currentIndex 传给子组件
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      items={workExperienceList}
      renderItem={(item, index, addItem, removeItem) => (
        <WorkExperience
          key={item.id}
          index={index + 1}
          isLast={index === workExperienceList.length - 1}
          addWorkExperience={addItem}
          removeWorkExperience={() => removeItem(index)}
        />
      )}
      addItem={addWorkExperience}
      removeItem={removeWorkExperience}
    />
  );
}

export default WorkExperienceSliderWrapper;
