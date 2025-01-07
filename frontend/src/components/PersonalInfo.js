import React, { useState, useRef } from 'react';
import './PersonalInfo.css';
import axios from 'axios';

const PersonalInfo = () => {
  const [inputs, setInputs] = useState({
    title: '个人信息',
    fields: [{ label: '', value: '' }]
  });

  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef(null);

  // 更新“个人信息”标题
  const handleTitleChange = (value) => {
    setInputs((prev) => ({ ...prev, title: value }));
  };

  // 更新输入框内容
  const handleFieldChange = (index, key, newValue) => {
    const updatedFields = [...inputs.fields];
    updatedFields[index][key] = newValue;
    setInputs((prev) => ({ ...prev, fields: updatedFields }));
  };

  // 添加新输入框
  const addInputField = () => {
    setInputs((prev) => ({
      ...prev,
      fields: [...prev.fields, { label: '', value: '' }]
    }));
  };

  // 删除对应行
  const removeInputField = (index) => {
    if (inputs.fields.length === 1) return; // 防止删除最后一行
    const updatedFields = inputs.fields.filter((_, i) => i !== index);
    setInputs((prev) => ({ ...prev, fields: updatedFields }));
  };

  // 照片上传逻辑
  const handlePhotoUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // 保存数据到后端
  const savePersonalInfo = async (data) => {
    try {
      const response = await axios.post('/api/personal-info', data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 调用保存函数
  const handleSave = () => {
    const dataToSave = inputs; // 获取当前输入数据
    savePersonalInfo(dataToSave); // 调用 API 保存数据
  };

  return (
    <div className="personal-info-section">
      <div className="info-container">
        {/* 左侧内容 */}
        <div className="text-info">
          {/* 标题：个人信息 */}
          <input
            type="text"
            value={inputs.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="title-input"
          />
          {inputs.fields.map((field, index) => (
            <div key={index} className="input-row">
              {/* 左侧：标题 */}
              <div className="label-container">
                <input
                  type="text"
                  value={field.label}
                  placeholder={`标题 ${index + 1}`}
                  onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                  className="info-label"
                />
              </div>

              {/* 右侧：输入框 + 按钮 同行 */}
              <div className="input-and-buttons">
                <input
                  type="text"
                  value={field.value}
                  placeholder={`Enter info ${index + 1}`}
                  onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                  className="info-input"
                />
                {/* 只有最后一行有加号 */}
                {index === inputs.fields.length - 1 && (
                  <button onClick={addInputField} className="add-button">+</button>
                )}
                <button onClick={() => removeInputField(index)} className="remove-button">-</button>
              </div>
            </div>
          ))}
          {/* 保存按钮 */}
          <button onClick={handleSave} className="save-button">
            Save to Database
          </button>
        </div>

        {/* 右侧照片 */}
        <div className="photo-container">
          <div
            className="profile-photo"
            onClick={openFilePicker}
            style={{ cursor: 'pointer' }}
          >
            {photo ? (
              <img src={photo} alt="Uploaded" className="photo-preview" />
            ) : (
              <div className="photo-placeholder">Click to Upload</div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => handlePhotoUpload(e.target.files[0])}
            className="photo-upload"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
