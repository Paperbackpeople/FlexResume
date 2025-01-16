import React, { useState, useEffect, useRef } from 'react';
import './Project.css';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

function Project({
                   itemId,
                   index,
                   isLast,
                   addProject,
                   removeProject,
                   onChange,
                   initialData,
                 }) {
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

  // 只在组件初次挂载或初次拿到 initialData 时做一次回填
  const firstLoadRef = useRef(true);

  // Quill ref
  const detailQuillRef = useRef(null);
  const otherQuillRef = useRef(null);

  // DOM id，避免 index 乱序导致的重复渲染问题
  const detailEditorId = `detailEditor-${itemId}`;
  const otherEditorId = `otherEditor-${itemId}`;

  // 初始化 Quill
  useEffect(() => {
    // detail
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

    // other
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

  // 初次挂载时，回填数据 (only once)
  useEffect(() => {
    if (firstLoadRef.current && initialData) {
      setProjectInfo((prev) => ({
        ...prev,
        ...initialData,
      }));

      // 回填 Quill
      if (detailQuillRef.current && initialData.detailContent) {
        detailQuillRef.current.root.innerHTML = initialData.detailContent;
      }
      if (otherQuillRef.current && initialData.otherContent) {
        otherQuillRef.current.root.innerHTML = initialData.otherContent;
      }

      firstLoadRef.current = false; // 标记已加载
    }
  }, [initialData]);

  // Quill 专用：更新某个字段
  const handleQuillChange = (key, htmlValue) => {
    const updated = { ...projectInfo, [key]: htmlValue };
    setProjectInfo(updated);
    // 立刻通知父组件
    onChange && onChange(itemId, updated);
  };

  // 普通字段更新
  const updateProjectField = (key, value) => {
    const updated = { ...projectInfo, [key]: value };
    setProjectInfo(updated);
    onChange && onChange(itemId, updated);
  };

  // input onChange
  const handleInputChange = (key, value) => {
    updateProjectField(key, value);

    // 同步 label
    if (key === 'detailTitle') {
      const el = document.getElementById(`detailLabel-${itemId}`);
      if (el) el.textContent = value;
    }
    if (key === 'otherTitle') {
      const el = document.getElementById(`otherLabel-${itemId}`);
      if (el) el.textContent = value;
    }
  };

  // 文件
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
      updateProjectField('mediaType', fileType);
      updateProjectField('mediaFile', file);
      updateProjectField('mediaPreview', reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 移除媒体
  const removeMedia = () => {
    updateProjectField('mediaType', '');
    updateProjectField('mediaFile', null);
    updateProjectField('mediaPreview', null);
    updateProjectField('mediaDescription', '');
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
            {/* Time */}
            <div className="input-row">
              <label className="label">Time:</label>
              <input
                  type="text"
                  value={projectInfo.time || ''}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  placeholder="e.g. 2023"
                  className="info-input"
              />
            </div>
            {/* Name */}
            <div className="input-row">
              <label className="label">Name:</label>
              <input
                  type="text"
                  value={projectInfo.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Project Name"
                  className="info-input"
              />
            </div>
            {/* Summary */}
            <div className="input-row">
              <label className="label">Summary:</label>
              <input
                  type="text"
                  value={projectInfo.summary || ''}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Brief Introduction"
                  className="info-input"
              />
            </div>

            {/* detailTitle + detailContent */}
            <div className="input-row">
              <label className="label">Details Title:</label>
              <input
                  type="text"
                  value={projectInfo.detailTitle || ''}
                  onChange={(e) => handleInputChange('detailTitle', e.target.value)}
                  className="info-input"
              />
            </div>
            <div>
              <label id={`detailLabel-${itemId}`} style={{ fontWeight: 'bold' }}>
                {projectInfo.detailTitle}
              </label>
              <div
                  id={detailEditorId}
                  style={{ height: '150px', marginBottom: '20px' }}
              />
            </div>

            {/* Media */}
            <div className="upload-row">
              <label className="label">Media:</label>
              <input
                  id={`fileInput-${itemId}`}
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
              />
              <div className="upload-actions">
                <button
                    className="file-upload-button"
                    onClick={() =>
                        document.getElementById(`fileInput-${itemId}`).click()
                    }
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
                      value={projectInfo.mediaDescription || ''}
                      onChange={(e) =>
                          handleInputChange('mediaDescription', e.target.value)
                      }
                      style={{ height: '80px', resize: 'none' }}
                  />
                </div>
            )}

            {/* otherTitle + otherContent */}
            <div className="input-row">
              <label className="label">Other Title:</label>
              <input
                  type="text"
                  value={projectInfo.otherTitle || ''}
                  onChange={(e) => handleInputChange('otherTitle', e.target.value)}
                  className="info-input"
              />
            </div>
            <div>
              <label id={`otherLabel-${itemId}`} style={{ fontWeight: 'bold' }}>
                {projectInfo.otherTitle}
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
}

export default Project;