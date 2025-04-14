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

  // 使用 useEffect 处理 initialData 的更新
  useEffect(() => {
    if (initialData) {
      setProjectInfo(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

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

  // 添加新的 useEffect 来处理 Quill 内容的更新
  useEffect(() => {
    if (initialData) {
      // 更新普通字段
      setProjectInfo(prev => ({
        ...prev,
        ...initialData
      }));

      // 更新 Quill 内容
      if (detailQuillRef.current && initialData.detailContent) {
        const quill = detailQuillRef.current;
        if (quill.root.innerHTML !== initialData.detailContent) {
          quill.root.innerHTML = initialData.detailContent;
        }
      }

      if (otherQuillRef.current && initialData.otherContent) {
        const quill = otherQuillRef.current;
        if (quill.root.innerHTML !== initialData.otherContent) {
          quill.root.innerHTML = initialData.otherContent;
        }
      }
    }
  }, [initialData]);

  // Quill 更新处理
  const handleQuillChange = (key, htmlValue) => {
    setProjectInfo(prev => {
      const updated = { ...prev, [key]: htmlValue };
      onChange && onChange(itemId, updated);
      return updated;
    });
  };

  // 普通字段更新
  const updateProjectField = (key, value) => {
    setProjectInfo(prev => {
      const updated = { ...prev, [key]: value };
      onChange && onChange(itemId, updated);
      return updated;
    });
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

  // 添加图片压缩函数
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // 设置最大宽度和高度
          const maxWidth = 1024;
          const maxHeight = 1024;
          
          // 等比例缩放
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // 转换为 base64，使用较低的质量
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.6); // 压缩质量为 0.6
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // 修改文件处理函数
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    let fileType = '';
    if (file.type.includes('image')) {
      fileType = 'image';
      // 压缩图片
      try {
        const compressedBlob = await compressImage(file);
        const reader = new FileReader();
        reader.onload = () => {
          updateProjectField('mediaType', fileType);
          updateProjectField('mediaFile', new File([compressedBlob], file.name, { type: 'image/jpeg' }));
          updateProjectField('mediaPreview', reader.result);
        };
        reader.readAsDataURL(compressedBlob);
      } catch (error) {
        console.error('图片压缩失败:', error);
        alert('图片处理失败，请重试');
      }
    } else if (file.type.includes('video')) {
      // 视频文件大小限制
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('视频文件大小不能超过10MB');
        return;
      }
      fileType = 'video';
      const reader = new FileReader();
      reader.onload = () => {
        updateProjectField('mediaType', fileType);
        updateProjectField('mediaFile', file);
        updateProjectField('mediaPreview', reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('仅支持图片或视频文件');
      return;
    }
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
                  accept="image/*,video/*"
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
              <div className="upload-hint" style={{ fontSize: '12px', color: '#666' }}>
                支持的格式：图片(自动压缩)、视频(≤10MB)
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