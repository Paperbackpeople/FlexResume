import React, { useState, useRef, useEffect } from 'react';
import './Project.css';
import axios from 'axios';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const Project = ({ 
  index, 
  isLast, 
  addProject, 
  removeProject,
  onChange,       // 新增: 父组件回调
}) => {
  const [projectInfo, setProjectInfo] = useState({
    time: '',
    name: '',
    summary: '',
    detailTitle: 'Project Details',
    detailContent: '',
    mediaType: '',
    mediaFile: null,
    mediaPreview: null,
    mediaDescription: '',
    otherTitle: 'Other Details',
    otherContent: '',
  });

  // Quill 实例的 ref
  const detailQuillRef = useRef(null);
  const otherQuillRef = useRef(null);

  // -------------------------
  // 1. 初始化 Quill
  // -------------------------
  useEffect(() => {
    if (!detailQuillRef.current) {
      detailQuillRef.current = new Quill(`#detailEditor-${index}`, {
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
      detailQuillRef.current.on('text-change', () => {
        const content = detailQuillRef.current.root.innerHTML;
        updateProjectInfo('detailContent', content);
      });
    }

    if (!otherQuillRef.current) {
      otherQuillRef.current = new Quill(`#otherEditor-${index}`, {
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
      otherQuillRef.current.on('text-change', () => {
        const content = otherQuillRef.current.root.innerHTML;
        updateProjectInfo('otherContent', content);
      });
    }
  }, [index]);

  // -------------------------
  // 2. 每次 projectInfo 改变，都通知父组件
  // -------------------------
  useEffect(() => {
    // 让父组件拿到 { ...projectInfo }
    if (onChange) {
      onChange(`project${index}`, projectInfo);
    }
  }, [projectInfo, index, onChange]);

  // 更新 projectInfo，并 setState
  const updateProjectInfo = (key, value) => {
    setProjectInfo((prev) => ({ ...prev, [key]: value }));
  };

  // -------------------------
  // 3. 基础信息输入
  // -------------------------
  const handleInputChange = (key, value) => {
    updateProjectInfo(key, value);

    // 额外：如果是 detailTitle / otherTitle，更新 DOM label
    if (key === 'detailTitle') {
      const el = document.querySelector(`#detailLabel-${index}`);
      if (el) el.textContent = value;
    }
    if (key === 'otherTitle') {
      const el = document.querySelector(`#otherLabel-${index}`);
      if (el) el.textContent = value;
    }
  };

  // -------------------------
  // 4. 文件处理
  // -------------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let fileType = '';
    if (file.type.includes('image')) {
      fileType = 'image';
    } else if (file.type.includes('video')) {
      fileType = 'video';
    } else {
      alert('仅支持图片或视频文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateProjectInfo('mediaType', fileType);
      updateProjectInfo('mediaFile', file);
      updateProjectInfo('mediaPreview', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    updateProjectInfo('mediaType', '');
    updateProjectInfo('mediaFile', null);
    updateProjectInfo('mediaPreview', null);
    updateProjectInfo('mediaDescription', '');
  };

  return (
    <div className="project-container">
      <div className="project-section">
        <div className="section-header">
          <h2>Project {index + 1}</h2>
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

          {/* 详情标题 & 内容（Quill） */}
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
            <label
              id={`detailLabel-${index}`}
              style={{ fontWeight: 'bold' }}
            >
              {projectInfo.detailTitle}:
            </label>
            <div
              id={`detailEditor-${index}`}
              style={{ height: '150px', marginBottom: '20px' }}
            ></div>
          </div>

          {/* 媒体上传 */}
          <div className="upload-row">
            <label className="label">Media:</label>
            <input
              id={`fileInput-${index}`}
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
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
              <label className="upload-success-label">Upload Success</label>
              <textarea
                className="media-description"
                placeholder="Media Description"
                value={projectInfo.mediaDescription}
                onChange={(e) => handleInputChange('mediaDescription', e.target.value)}
                style={{ height: '80px', resize: 'none' }}
              />
            </div>
          )}

          {/* Other Title & 内容（Quill） */}
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
            <label
              id={`otherLabel-${index}`}
              style={{ fontWeight: 'bold' }}
            >
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
