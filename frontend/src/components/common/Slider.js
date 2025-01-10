import React from 'react';
import './Slider.css';

function Slider({
  items,
  renderItem,
  addItem,
  removeItem,
  currentIndex,       // 父组件传来的
  setCurrentIndex,    // 父组件传来的
}) {
  // 切换到上一张
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // 切换到下一张
  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
  };

  return (
    <div className="slider-container">
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
          disabled={currentIndex === items.length - 1}
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
          {items.map((item, index) => (
            <div className="slide" key={index}>
              {renderItem(item, index, addItem, removeItem)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Slider;
