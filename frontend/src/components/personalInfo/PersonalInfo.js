import React, { useState, useRef, useEffect, useCallback } from 'react';
import './PersonalInfo.css';
import axios from 'axios';

// 获取token的工具函数
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

const PersonalInfo = ({ username, version }) => {
  const [inputs, setInputs] = useState({
    username: username || '',
    version: version || 1,
    profilePhoto: '',
    fields: [{ label: '名字', value: '名字' }]
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

  // 立即保存方法：清除定时器并立即保存当前变更
  const saveImmediately = useCallback(() => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
      // 只有存在定时器时才说明有未保存的变更
      const dataToSave = inputs;
      savePersonalInfo(dataToSave);
    }
  }, [inputs]);

  // 监听全局保存事件
  useEffect(() => {
    const handleSaveAll = () => {
      saveImmediately();
    };
    
    window.addEventListener('saveAllData', handleSaveAll);
    return () => window.removeEventListener('saveAllData', handleSaveAll);
  }, [saveImmediately]);

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
    // 检查用户名有效性
    if (!data.username || data.username === 'undefined' || !data.version) {
      console.log('用户名或版本无效，跳过个人信息保存', { username: data.username, version: data.version });
      return;
    }
    
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
        // 确保第一个字段有默认值
        if (fetchedData.fields && fetchedData.fields.length > 0) {
          // 如果第一个字段的label或value为空，设置默认值
          if (!fetchedData.fields[0].label || fetchedData.fields[0].label.trim() === '') {
            fetchedData.fields[0].label = '名字';
          }
          if (!fetchedData.fields[0].value || fetchedData.fields[0].value.trim() === '') {
            fetchedData.fields[0].value = '名字';
          }
        } else {
          // 如果没有fields数组，创建默认的第一个字段
          fetchedData.fields = [{ label: '名字', value: '名字' }];
        }
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

  // 照片上传逻辑（添加压缩）
  const handlePhotoUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }
    
    // 文件大小检查（10MB）
    if (file.size > 10 * 1024 * 1024) {
      alert('图片大小不能超过10MB');
      return;
    }

    // 压缩图片
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // 设置最大尺寸
      const maxWidth = 800;
      const maxHeight = 800;
      let { width, height } = img;
      
      // 计算新尺寸
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // 绘制并压缩
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% 质量
      
      setInputs((prev) => ({ ...prev, profilePhoto: compressedDataUrl }));
    };
    
    img.onerror = () => {
      alert('图片加载失败，请重试');
    };
    
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
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
                  placeholder={index === 0 ? '名字' : `标题 ${index + 1}`}
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
