import React, { useState, useRef, useContext } from 'react';
import { QuillContext } from '../App'; // 引入 Quill Context
import './PersonalInfo.css';

const PersonalInfo = () => {
    const [inputs, setInputs] = useState({ title: '个人信息', fields: [''] });
    const [photo, setPhoto] = useState(null);
    const fileInputRef = useRef(null); // 修复: 添加 fileInputRef 的定义
    const quillRef = useContext(QuillContext); // 获取全局 Quill 实例

    // 更新标题
    const handleTitleChange = (value) => {
        setInputs((prev) => ({ ...prev, title: value }));
    };

    // 添加新输入框
    const addInputField = () => {
        setInputs((prev) => ({ ...prev, fields: [...prev.fields, ''] }));
    };

    // 移除最后一个输入框
    const removeInputField = () => {
        if (inputs.fields.length === 1) return;
        const updatedFields = [...inputs.fields];
        updatedFields.pop();
        setInputs((prev) => ({ ...prev, fields: updatedFields }));
    };

    // 处理输入框内容
    const handleInputChange = (index, value) => {
        const updatedFields = [...inputs.fields];
        updatedFields[index] = value;
        setInputs((prev) => ({ ...prev, fields: updatedFields }));
    };

    // 点击字段时，将内容加载到全局 Quill 编辑器
    const handleFieldClick = (index) => {
        if (quillRef.current) {
            // 确保 Quill 已挂载
            if (!quillRef.current.root) {
                console.error("Quill editor not mounted.");
                return;
            }

            // 延迟设置内容，避免 DOM 同步问题
            setTimeout(() => {
                quillRef.current.root.innerHTML = ''; // 清空内容
                quillRef.current.root.innerHTML = inputs.fields[index]; // 设置内容

                // 聚焦编辑器
                quillRef.current.focus();

                // 监听编辑器内容变化
                quillRef.current.on('text-change', () => {
                    const updatedContent = quillRef.current.root.innerHTML;
                    const updatedFields = [...inputs.fields];
                    updatedFields[index] = updatedContent;
                    setInputs((prev) => ({ ...prev, fields: updatedFields }));
                });
            }, 0);
        }
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
        fileInputRef.current?.click(); // 修复: 正确访问 fileInputRef
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
                                value={field}
                                placeholder={`Enter info ${index + 1}`}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onClick={() => handleFieldClick(index)}
                                className="info-input"
                            />
                            {index === inputs.fields.length - 1 && (
                                <button onClick={addInputField} className="add-button">+</button>
                            )}
                            <button onClick={removeInputField} className="remove-button">-</button>
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
                        ref={fileInputRef} // 修复: 正确绑定 fileInputRef
                        onChange={(e) => handlePhotoUpload(e.target.files[0])}
                        className="photo-upload"
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;