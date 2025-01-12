import React, { useState, useRef, useEffect } from 'react';
import './Internship.css';
import axios from 'axios';
// 引入 Quill 相关
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const Internship = ({ index, isLast, addInternship, removeInternship }) => {
    const [internshipInfo, setInternshipInfo] = useState({
        companyName: '',
        position: '',
        duration: '',
        summary: '',
        // 可选的详情（detail）
        detailTitle: 'Internship Details', // 默认标题，可让用户自行修改
        detailContent: '',
        // 可选其他信息
        otherTitle: 'Additional Info',
        otherContent: '',
        // 以下是为媒体上传功能新增的字段
        mediaType: '',
        mediaFile: null,
        mediaPreview: null,
        mediaDescription: '',
    });

    // detailContent 和 otherContent 的富文本编辑器
    const detailEditorRef = useRef(null);
    const otherEditorRef = useRef(null);

    // 用于在初始化或组件挂载后，创建 Quill 实例
    useEffect(() => {
        if (!detailEditorRef.current) {
            detailEditorRef.current = new Quill(`#detailEditor-${index}`, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'link'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['clean'],
                    ],
                },
            });

            detailEditorRef.current.on('text-change', () => {
                setInternshipInfo((prev) => ({
                    ...prev,
                    detailContent: detailEditorRef.current.root.innerHTML,
                }));
            });
        }

        if (!otherEditorRef.current) {
            otherEditorRef.current = new Quill(`#otherEditor-${index}`, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'link'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['clean'],
                    ],
                },
            });

            otherEditorRef.current.on('text-change', () => {
                setInternshipInfo((prev) => ({
                    ...prev,
                    otherContent: otherEditorRef.current.root.innerHTML,
                }));
            });
        }
    }, [index]);

    // 处理基础信息
    const handleInputChange = (key, value) => {
        setInternshipInfo((prev) => ({ ...prev, [key]: value }));
    };

    // 处理文件选择（图片或视频）
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        let fileType = '';
        if (file.type.includes('image')) {
            fileType = 'image';
        } else if (file.type.includes('video')) {
            fileType = 'video';
        } else {
            alert('Only images or videos are supported.');
            return;
        }

        // 生成预览
        const reader = new FileReader();
        reader.onload = () => {
            setInternshipInfo((prev) => ({
                ...prev,
                mediaType: fileType,
                mediaFile: file,
                mediaPreview: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    };

    // 删除上传的媒体内容
    const removeMedia = () => {
        setInternshipInfo((prev) => ({
            ...prev,
            mediaType: '',
            mediaFile: null,
            mediaPreview: null,
            mediaDescription: '',
        }));
    };

    // 保存到后端
    const saveInternshipInfo = async () => {
        try {
            const response = await axios.post('/api/internship-info', internshipInfo);
            console.log('实习信息保存成功:', response.data);
        } catch (error) {
            console.error('保存实习信息错误:', error);
        }
    };

    return (
        <div className="internship-container">
            <div className="internship-section">
                <div className="section-header">
                    <h2>Internship {index}</h2>
                    <div className="button-group">
                        <button className="remove-newButton" onClick={removeInternship}>
                            -
                        </button>
                        {isLast && (
                            <button className="add-newButton" onClick={addInternship}>
                                +
                            </button>
                        )}
                    </div>
                </div>

                <div className="text-info">
                    <div className="input-row">
                        <label className="label">Company Name:</label>
                        <input
                            type="text"
                            value={internshipInfo.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            placeholder="e.g. Google"
                            className="info-input"
                        />
                    </div>

                    <div className="input-row">
                        <label className="label">Position:</label>
                        <input
                            type="text"
                            value={internshipInfo.position}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                            placeholder="e.g. Software Engineer Intern"
                            className="info-input"
                        />
                    </div>

                    <div className="input-row">
                        <label className="label">Duration:</label>
                        <input
                            type="text"
                            value={internshipInfo.duration}
                            onChange={(e) => handleInputChange('duration', e.target.value)}
                            placeholder="e.g. June 2023 - August 2023"
                            className="info-input"
                        />
                    </div>

                    <div className="input-row">
                        <label className="label">Summary:</label>
                        <input
                            type="text"
                            value={internshipInfo.summary}
                            onChange={(e) => handleInputChange('summary', e.target.value)}
                            placeholder="Brief Summary"
                            className="info-input"
                        />
                    </div>

                    {/* 可选详情（带编辑器） */}
                    <div className="input-row">
                        <label className="label">Details Title:</label>
                        <input
                            type="text"
                            value={internshipInfo.detailTitle}
                            onChange={(e) => handleInputChange('detailTitle', e.target.value)}
                            className="info-input"
                        />
                    </div>
                    <div>
                        <label id={`detailLabel-${index}`} style={{ fontWeight: 'bold' }}>
                            {internshipInfo.detailTitle}:
                        </label>
                        <div
                            id={`detailEditor-${index}`}
                            style={{ height: '150px', marginBottom: '20px' }}
                        ></div>
                    </div>

                    {/* 上传媒体 */}
                    <div className="upload-row">
                        <label className="label">Media:</label>
                        <input id={`fileInput-${index}`} type="file" onChange={handleFileChange} />
                        <div className="upload-actions">
                            <button
                                className="file-upload-button"
                                onClick={() => document.getElementById(`fileInput-${index}`).click()}
                            >
                                Choose File
                            </button>
                            <button onClick={removeMedia} className="remove-media-button">
                                Remove Media
                            </button>
                        </div>
                    </div>

                    {internshipInfo.mediaPreview && (
                        <div className="upload-preview">
                            <label className="upload-success-label">Upload Success</label>
                            <textarea
                                className="media-description"
                                placeholder="Media Description"
                                value={internshipInfo.mediaDescription}
                                onChange={(e) => handleInputChange('mediaDescription', e.target.value)}
                                style={{ height: '80px', resize: 'none' }}
                            />
                        </div>
                    )}

                    {/* 可选其他信息 */}
                    <div className="input-row">
                        <label className="label">Additional Info:</label>
                        <input
                            type="text"
                            value={internshipInfo.otherTitle}
                            onChange={(e) => handleInputChange('otherTitle', e.target.value)}
                            className="info-input"
                        />
                    </div>
                    <div>
                        <label id={`otherLabel-${index}`} style={{ fontWeight: 'bold' }}>
                            {internshipInfo.otherTitle}:
                        </label>
                        <div
                            id={`otherEditor-${index}`}
                            style={{ height: '150px', marginBottom: '20px' }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Internship;
