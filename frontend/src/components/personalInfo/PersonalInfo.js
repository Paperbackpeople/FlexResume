import React, { useState, useRef, useEffect } from 'react';
import './PersonalInfo.css';
import axios from 'axios';

// 获取token和userId的工具函数
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (userId) headers['X-User-Id'] = userId;
  return headers;
}

const PersonalInfo = ({ username, version }) => {
  const [inputs, setInputs] = useState({
    username: username || '',
    version: version || 1,
    profilePhoto: '',
    fields: [{ label: '', value: '' }]
  });

  const saveTimeout = useRef(null); // 用于存储定时器的引用
  const fileInputRef = useRef(null);

  // 当username或version变化时，更新inputs状态
  useEffect(() => {
    setInputs(prev => ({
      ...prev,
      username: username || '',
      version: version || 1
    }));
  }, [username, version]);

  // 自动保存逻辑
  useEffect(() => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current); // 清除已有的定时器
    }

    // 设置新的定时器，10 秒后保存数据
    saveTimeout.current = setTimeout(() => {
      const dataToSave = inputs;
      savePersonalInfo(dataToSave);
    }, 10000);

    // 清理定时器
    return () => clearTimeout(saveTimeout.current);
  }, [inputs]);

  // 保存数据到后端
  const savePersonalInfo = async (data) => {
    // 检查是否有有效数据
    const hasValidData = data.fields.some(field => 
      field.label.trim() !== '' || field.value.trim() !== ''
    ) || data.profilePhoto !== '';
    
    if (!hasValidData) {
      console.log('没有有效数据，跳过保存');
      return;
    }

    try {
      const response = await axios.post('/api/personal-info', data, { headers: getAuthHeaders() });
      console.log('保存成功:', response.data);
    } catch (error) {
      console.error('保存个人信息出错:', error);
    }
  };

// 新增从后端获取数据的方法
  const fetchPersonalInfo = async (username, version) => {
    try {
      const response = await axios.get(`/api/personal-info/${username}/${version}`, { headers: getAuthHeaders() });
      const fetchedData = response.data;
      if (fetchedData) {
        setInputs(fetchedData);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // 404 表示没有数据，这是正常的，不需要报错
        console.log('用户暂无个人信息数据');
      } else {
      console.error('获取个人信息出错:', error);
      }
    }
  };

// 使用 useEffect 在组件加载时调用 fetchPersonalInfo
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId || !username) return; // 未登录或没有username不请求
    fetchPersonalInfo(username, version);
  }, [username, version]);

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
      setInputs((prev) => ({ ...prev, profilePhoto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="personal-info-section">
      <div className="info-container">
        {/* 左侧内容 */}
        <div className="text-info">
          {/* 标题：个人信息 */}
          <label className="info-title">个人信息：</label>
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
        </div>

        {/* 右侧照片 */}
        <div className="photo-container">
          <div
            className="profile-photo"
            onClick={openFilePicker}
            style={{ cursor: 'pointer' }}
          >
            {inputs.profilePhoto ? (
              <img src={inputs.profilePhoto} alt="Uploaded" className="photo-preview" />
            ) : (
              <div className="photo-placeholder">Click to Upload Your Photo</div>
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
