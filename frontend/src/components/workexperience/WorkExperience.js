import React, { useState, useRef, useEffect, useCallback } from 'react';
import './WorkExperience.css';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// 获取token和userId的工具函数
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (userId) headers['X-User-Id'] = userId;
  return headers;
}

const WorkExperience = ({
  itemId,
  index,
  isLast,
  addWorkExperience,
  removeWorkExperience,
  onChange,
  initialData,
}) => {
  const [workExperienceInfo, setWorkExperienceInfo] = useState({
    companyName: '',
    position: '',
    duration: '',
    summary: '',
    detailTitle: 'WorkExperience Details',
    detailContent: '',
    otherTitle: 'Additional Info',
    otherContent: '',
    mediaType: '',
    mediaFile: null,
    mediaPreview: null,
    mediaDescription: '',
  });

  // Quill refs
  const detailQuillRef = useRef(null);
  const otherQuillRef = useRef(null);

  // DOM ids
  const detailEditorId = `detailEditor-WE-${itemId}`;
  const otherEditorId = `otherEditor-WE-${itemId}`;

  // 第一次 / 当 initialData 改变时，将其合并到 state
  useEffect(() => {
    if (initialData) {
      setWorkExperienceInfo((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  // 初始化 Quill
  useEffect(() => {
    if (!detailQuillRef.current && document.getElementById(detailEditorId)) {
      detailQuillRef.current = new Quill(`#${detailEditorId}`, {
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
        const html = detailQuillRef.current.root.innerHTML;
        handleQuillChange('detailContent', html);
      });
    }

    if (!otherQuillRef.current && document.getElementById(otherEditorId)) {
      otherQuillRef.current = new Quill(`#${otherEditorId}`, {
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
        const html = otherQuillRef.current.root.innerHTML;
        handleQuillChange('otherContent', html);
      });
    }
  }, [detailEditorId, otherEditorId]);

  // 如果 initialData 中有 detailContent / otherContent，填充到 Quill
  useEffect(() => {
    if (initialData) {
      if (detailQuillRef.current && initialData.detailContent) {
        // 避免重复赋值
        if (detailQuillRef.current.root.innerHTML !== initialData.detailContent) {
          detailQuillRef.current.root.innerHTML = initialData.detailContent;
        }
      }
      if (otherQuillRef.current && initialData.otherContent) {
        // 避免重复赋值
        if (otherQuillRef.current.root.innerHTML !== initialData.otherContent) {
          otherQuillRef.current.root.innerHTML = initialData.otherContent;
        }
      }
    }
  }, [initialData, handleQuillChange]);

  // 处理 Quill 内容改变
  const handleQuillChange = useCallback((key, value) => {
    setWorkExperienceInfo((prev) => {
      const updated = { ...prev, [key]: value };
      onChange(itemId, updated);
      return updated;
    });
  }, [itemId, onChange]);

  // 处理普通字段改变
  const handleInputChange = (key, value) => {
    setWorkExperienceInfo((prev) => {
      const updated = { ...prev, [key]: value };
      onChange(itemId, updated);
      return updated;
    });
  };

  // 处理文件上传
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

    const reader = new FileReader();
    reader.onload = () => {
      setWorkExperienceInfo((prev) => {
        const updated = {
          ...prev,
          mediaType: fileType,
          mediaFile: file,
          mediaPreview: reader.result,
        };
        onChange(itemId, updated);
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  // 移除媒体
  const removeMedia = () => {
    setWorkExperienceInfo((prev) => {
      const updated = {
        ...prev,
        mediaType: '',
        mediaFile: null,
        mediaPreview: null,
        mediaDescription: '',
      };
      onChange(itemId, updated);
      return updated;
    });
  };

  return (
    <div className="workexperience-container">
      <div className="workexperience-section">
        <div className="section-header">
          <h2>WorkExperience {index + 1}</h2>
          <div className="button-group">
            <button className="remove-newButton" onClick={removeWorkExperience}>
              -
            </button>
            {isLast && (
              <button className="add-newButton" onClick={addWorkExperience}>
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
              value={workExperienceInfo.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="e.g. Amazon"
              className="info-input"
            />
          </div>

          <div className="input-row">
            <label className="label">Position:</label>
            <input
              type="text"
              value={workExperienceInfo.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="info-input"
            />
          </div>

          <div className="input-row">
            <label className="label">Duration:</label>
            <input
              type="text"
              value={workExperienceInfo.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="e.g. Jan 2022 - Dec 2022"
              className="info-input"
            />
          </div>

          <div className="input-row">
            <label className="label">Summary:</label>
            <input
              type="text"
              value={workExperienceInfo.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              placeholder="Brief Summary"
              className="info-input"
            />
          </div>

          {/* 详情标题 + Quill */}
          <div className="input-row">
            <label className="label">Details Title:</label>
            <input
              type="text"
              value={workExperienceInfo.detailTitle}
              onChange={(e) => handleInputChange('detailTitle', e.target.value)}
              className="info-input"
            />
          </div>
          <div>
            <label id={`detailLabel-WE-${itemId}`} style={{ fontWeight: 'bold' }}>
              {workExperienceInfo.detailTitle}
            </label>
            <div
              id={detailEditorId}
              style={{ height: '150px', marginBottom: '20px' }}
            />
          </div>

          {/* 上传媒体 */}
          <div className="upload-row">
            <label className="label">Media:</label>
            <input
              id={`fileInput-WE-${itemId}`}
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div className="upload-actions">
              <button
                className="file-upload-button"
                onClick={() => document.getElementById(`fileInput-WE-${itemId}`).click()}
              >
                Choose File
              </button>
              <button onClick={removeMedia} className="remove-media-button">
                Remove Media
              </button>
            </div>
          </div>

          {workExperienceInfo.mediaPreview && (
            <div className="upload-preview">
              <label className="upload-success-label">Upload Success</label>
              <textarea
                className="media-description"
                placeholder="Media Description"
                value={workExperienceInfo.mediaDescription}
                onChange={(e) => handleInputChange('mediaDescription', e.target.value)}
                style={{ height: '80px', resize: 'none' }}
              />
            </div>
          )}

          {/* 其他信息标题 + Quill */}
          <div className="input-row">
            <label className="label">Additional Info:</label>
            <input
              type="text"
              value={workExperienceInfo.otherTitle}
              onChange={(e) => handleInputChange('otherTitle', e.target.value)}
              className="info-input"
            />
          </div>
          <div>
            <label id={`otherLabel-WE-${itemId}`} style={{ fontWeight: 'bold' }}>
              {workExperienceInfo.otherTitle}
            </label>
            <div
              id={otherEditorId}
              style={{ height: '150px', marginBottom: '20px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkExperience;
