import React, { useState } from 'react';
import Slider from '../common/Slider';
import Project from './Education';

function EducationSliderWapper() {
  const [educationList, setEducationList] = useState([{ id: 0 }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const addEducation = () => {

    setEducationList((prev) => {
        const newItem = { id: prev.length };
        return [...prev, newItem];
        }
    );
    setCurrentIndex(educationList.length);
    }

  // 删除一条 Project
  const removeEducation = (removeIndex) => {
    setEducationList((prev) => {
      if (prev.length === 1) return prev; // 保证至少一项

      const updated = [...prev];
      updated.splice(removeIndex, 1);
      return updated;
    });
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }


  return (
    <Slider
      // 必须把父组件维护的 currentIndex 传给子组件
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      items={educationList}
      renderItem={(item, index, addItem, removeItem) => (
        <Project
          key={item.id}
          index={index + 1}
          isLast={index === educationList.length - 1}
          addEducation={addItem}
          removeEducation={() => removeItem(index)}
        />
      )}
      addItem={addEducation}
      removeItem={removeEducation}
    />
  );
}

export default EducationSliderWapper;
