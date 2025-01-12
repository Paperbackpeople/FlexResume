import React, { useState } from 'react';
import Slider from '../common/Slider';
import Internship from './Internship'; // 使用 Internship 组件

function InternshipSliderWrapper() {
  const [internshipList, setInternshipList] = useState([{ id: 0 }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 新增一条 Internship
  const addInternship = () => {
    setInternshipList((prev) => {
      const newList = [...prev, { id: prev.length }];
      // 移动到新增卡片
      setCurrentIndex(newList.length - 1);
      return newList;
    });
  };

  // 删除一条 Internship
  const removeInternship = (removeIndex) => {
    setInternshipList((prev) => {
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
      items={internshipList}
      renderItem={(item, index, addItem, removeItem) => (
        <Internship
          key={item.id}
          index={index + 1}
          isLast={index === internshipList.length - 1}
          addInternship={addItem}
          removeInternship={() => removeItem(index)}
        />
      )}
      addItem={addInternship}
      removeItem={removeInternship}
    />
  );
}

export default InternshipSliderWrapper;
