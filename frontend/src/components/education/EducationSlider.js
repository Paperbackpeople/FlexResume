import React, { useState } from 'react';
import Education from './Education'; // 引入你写好的 Education 组件
import './Slider.css'; // 存放轮播相关的 CSS

function EducationSlider() {
    // 这里假设一开始只有一个 Education
    // 也可以用你现在的方式，或者从 props 里接收
    const [educationList, setEducationList] = useState([{ id: 0 }]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 新增一条 Education
    const addEducation = () => {
        setEducationList((prev) => {
            const newItem = { id: prev.length };
            return [...prev, newItem];
        });
        // 切换到最新一页
        setCurrentIndex(educationList.length);
    };

    // 删除一条 Education
    // 你可以决定是否允许删除到只剩一条
    const removeEducation = (removeIndex) => {
        setEducationList((prev) => {
            if (prev.length === 1) return prev; // 保证至少一项
            const updated = [...prev];
            updated.splice(removeIndex, 1);
            return updated;
        });
        // 如果当前删除的就是当前索引，需要回退到上一张
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    // 切换到上一张
    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    // 切换到下一张
    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, educationList.length - 1));
    };

    return (
        <div className="Education-border">

            {/* 左右切换按钮 */}
            <div className="slider-controls">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="slider-button"
                >
                    &lt; Prev
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentIndex === educationList.length - 1}
                    className="slider-button"
                >
                    Next &gt;
                </button>
            </div>
            {/* 轮播容器 */}
            <div className="slider">
                <div
                    className="slider-content"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {educationList.map((item, index) => (
                        <div className="slide" key={item.id}>
                            <Education
                                // 这里把 add/remove 的回调函数下放给每个 Education
                                // 并在内部用来调用这里的 addEducation / removeEducation
                                index={index + 1}
                                isLast={index === educationList.length - 1}
                                addEducation={addEducation}
                                removeEducation={() => removeEducation(index)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EducationSlider;
