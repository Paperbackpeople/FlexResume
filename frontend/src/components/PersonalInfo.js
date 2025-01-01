import React, { useState, useRef } from 'react';
import './PersonalInfo.css';

const PersonalInfo = () => {
    const [inputs, setInputs] = useState({ title: '个人信息', fields: [''] });
    const [photo, setPhoto] = useState(null);
    const fileInputRef = useRef(null); // 用于隐藏文件选择按钮

    // 更新标题
    const handleTitleChange = (value) => {
        setInputs((prev) => ({ ...prev, title: value }));
    };

    // 更新输入框的值
    const handleInputChange = (index, value) => {
        const updatedFields = [...inputs.fields];
        updatedFields[index] = value;
        setInputs((prev) => ({ ...prev, fields: updatedFields }));
    };

    // 添加新输入框
    const addInputField = () => {
        setInputs((prev) => ({ ...prev, fields: [...prev.fields, ''] }));
    };

    // 处理照片上传
    const handlePhotoUpload = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            setPhoto(reader.result); // 设置预览的照片
        };
        reader.readAsDataURL(file);
    };

    // 打开文件选择
    const openFilePicker = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const removeInputField = () => {
        if (inputs.fields.length === 1) {
            return;
        }
        const updatedFields = [...inputs.fields];
        updatedFields.pop();
        setInputs((prev) => ({ ...prev, fields: updatedFields }));
    };

    return (
        <div className="personal-info-section">
            <div className="info-container">
                {/* 左侧内容 */}
                <div className="text-info">
                    {/* 标题 */}
                    <input
                        type="text"
                        value={inputs.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="title-input"
                    />

                    {/* 动态输入框 */}
                    {inputs.fields.map((field, index) => (
                        <div key={index} className="input-row">
                            <input
                                type="text"
                                placeholder={`Enter info ${index + 1}`}
                                value={field}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                className="info-input"
                            />
                            <button onClick={removeInputField} className="remove-button">-</button>
                            {index === inputs.fields.length - 1 && (
                                <button onClick={addInputField} className="add-button">+</button>
                            )}
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