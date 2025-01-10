import React, { useState, useRef, useEffect } from 'react';
import './Project.css';
import axios from 'axios';
// 引入 Quill 相关
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const Project = ({ index, isLast, addProject, removeProject }) => {
    const [projectInfo, setProjectInfo] = useState({
        time: '',
        name: '',
        summary: '',
        // 可选的详情（detail）
        detailTitle: 'Project Details', // 默认标题，可让用户自行修改
        detailContent: '',
        // 可选视频或图片
        mediaType: '', // 'image' or 'video'
        mediaFile: null,
        mediaPreview: null,
        mediaDescription: '',
        // 可选其他信息
        otherTitle: 'Other Details',
        otherContent: '',
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
                setProjectInfo((prev) => ({
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
                setProjectInfo((prev) => ({
                    ...prev,
                    otherContent: otherEditorRef.current.root.innerHTML,
                }));
            });
        }
    }, [index]);

    // 处理基础信息
    const handleInputChange = (key, value) => {
        setProjectInfo((prev) => ({ ...prev, [key]: value }));

        // 如果是 detailTitle 或 otherTitle，更新对应的 label
        if (key === 'detailTitle') {
            document.querySelector(`#detailLabel-${index}`).textContent = value;
        }
        if (key === 'otherTitle') {
            document.querySelector(`#otherLabel-${index}`).textContent = value;
        }
    };

    // 处理文件选择（图片或视频）
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 判断文件类型
        let fileType = '';
        if (file.type.includes('image')) {
            fileType = 'image';
        } else if (file.type.includes('video')) {
            fileType = 'video';
        } else {
            alert('仅支持图片或视频文件');
            return;
        }

        // 生成预览
        const reader = new FileReader();
        reader.onload = () => {
            setProjectInfo((prev) => ({
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
        setProjectInfo((prev) => ({
            ...prev,
            mediaType: '',
            mediaFile: null,
            mediaPreview: null,
            mediaDescription: '',
        }));
    };

    // 保存到后端
    const saveProjectInfo = async () => {
        try {
            const formData = new FormData();
            formData.append('time', projectInfo.time);
            formData.append('name', projectInfo.name);
            formData.append('summary', projectInfo.summary);
            formData.append('detailTitle', projectInfo.detailTitle);
            formData.append('detailContent', projectInfo.detailContent);
            formData.append('mediaType', projectInfo.mediaType);
            formData.append('mediaDescription', projectInfo.mediaDescription);
            formData.append('otherTitle', projectInfo.otherTitle);
            formData.append('otherContent', projectInfo.otherContent);

            if (projectInfo.mediaFile) {
                formData.append('mediaFile', projectInfo.mediaFile);
            }

            const response = await axios.post('/api/project-info', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('项目保存成功:', response.data);
        } catch (error) {
            console.error('保存项目错误:', error);
        }
    };

    return (
        <div className="project-container">
            <div className="project-section">
                <div className="section-header">
                    <h2>Project {index}</h2>
                    <div className="button-group">
                        <button className="remove-newButton" onClick={removeProject}>
                            -
                        </button>
                        {isLast && (
                            <button className="add-newButton" onClick={addProject}>
                                +
                            </button>
                        )}
                    </div>
                </div>

                <div className="text-info">
                    <div className="input-row">
                        <label className="label">Time:</label>
                        <input
                            type="text"
                            value={projectInfo.time}
                            onChange={(e) => handleInputChange('time', e.target.value)}
                            placeholder="e.g. 2023"
                            className="info-input"
                        />
                    </div>

                    <div className="input-row">
                        <label className="label">Name:</label>
                        <input
                            type="text"
                            value={projectInfo.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Project Name"
                            className="info-input"
                        />
                    </div>

                    <div className="input-row">
                        <label className="label">Summary:</label>
                        <input
                            type="text"
                            value={projectInfo.summary}
                            onChange={(e) => handleInputChange('summary', e.target.value)}
                            placeholder="Brief Introduction"
                            className="info-input"
                        />
                    </div>

                    {/* 可选项目详情（带编辑器） */}
                    <div className="input-row">
                        <label className="label">Details Title:</label>
                        <input
                            type="text"
                            value={projectInfo.detailTitle}
                            onChange={(e) => handleInputChange('detailTitle', e.target.value)}
                            className="info-input"
                        />
                    </div>
                    <div>
                        <label id={`detailLabel-${index}`} style={{ fontWeight: 'bold' }}>
                            {projectInfo.detailTitle}:
                        </label>
                        <div
                            id={`detailEditor-${index}`}
                            style={{ height: '150px', marginBottom: '20px' }}
                        ></div>
                    </div>

                    {/* 可选视频/图片上传 */}
                    <div className="upload-row">
                        <label className="label">Media:</label>
                        {/* 和 label 一致的 id */}
                        <input
                            id={`fileInput-${index}`}
                            type="file"
                            onChange={handleFileChange}
                        />
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

                    {projectInfo.mediaPreview && (
                        <div className="upload-preview">
                            {/* {projectInfo.mediaType === 'image' ? (
                                <img
                                    src={projectInfo.mediaPreview}
                                    alt="preview"
                                    className="preview-media"
                                />
                            ) : (
                                <video
                                    src={projectInfo.mediaPreview}
                                    className="preview-media"
                                    controls
                                />
                            )} */}
                            <label className="upload-success-label">Upload Success</label>
                            <textarea
                                className="media-description"
                                placeholder="Media Description"
                                value={projectInfo.mediaDescription}
                                onChange={(e) =>
                                    handleInputChange('mediaDescription', e.target.value)
                                }
                                style={{ height: '80px', resize: 'none' }}
                            />
                        </div>
                    )}

                    {/* 可选其他（通过 editor） */}
                    <div className="input-row">
                        <label className="label">Other Title:</label>
                        <input
                            type="text"
                            value={projectInfo.otherTitle}
                            onChange={(e) => handleInputChange('otherTitle', e.target.value)}
                            className="info-input"
                        />
                    </div>
                    <div>
                        <label id={`otherLabel-${index}`} style={{ fontWeight: 'bold' }}>
                            {projectInfo.otherTitle}:
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

export default Project;
