import React, { useState } from 'react';
import Slider from '../common/Slider';
import Project from './Project';

function ProjectSliderWrapper() {
  const [projectList, setProjectList] = useState([{ id: 0 }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 新增一条 Project
  const addProject = () => {
    setProjectList((prev) => {
      const newList = [...prev, { id: prev.length }];
      // 移动到新增卡片
      setCurrentIndex(newList.length - 1);
      return newList;
    });
  };

  // 删除一条 Project
  const removeProject = (removeIndex) => {
    setProjectList((prev) => {
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
      items={projectList}
      renderItem={(item, index, addItem, removeItem) => (
        <Project
          key={item.id}
          index={index + 1}
          isLast={index === projectList.length - 1}
          addProject={addItem}
          removeProject={() => removeItem(index)}
        />
      )}
      addItem={addProject}
      removeItem={removeProject}
    />
  );
}

export default ProjectSliderWrapper;
