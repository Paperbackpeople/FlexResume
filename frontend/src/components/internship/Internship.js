import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Internship.css';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
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

function Internship({
  itemId,
  index,
  isLast,
  addInternship,
  removeInternship,
  onChange,
  initialData,
}) {
  const [internshipInfo, setInternshipInfo] = useState({
    companyName: '',
    position: '',
    duration: '',
    summary: '',
    detailTitle: 'Internship Details',
    detailContent: '',
    otherTitle: 'Additional Info',
    otherContent: '',
    mediaType: '',
    mediaFile: null,
    mediaPreview: null,
    mediaDescription: '',
  });

  // 使用 useEffect 处理 initialData 的更新
  useEffect(() => {
    if (initialData) {
      setInternshipInfo(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  // Quill refs
  const detailQuillRef = useRef(null);
  const otherQuillRef = useRef(null);

  // DOM ids
  const detailEditorId = `detailEditor-${itemId}`;
  const otherEditorId = `otherEditor-${itemId}`;

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

  // 添加新的 useEffect 来处理 Quill 内容的更新
  useEffect(() => {
    if (initialData) {
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
  }, [initialData, handleQuillChange]);

  // Quill 更新处理
  const handleQuillChange = useCallback((key, htmlValue) => {
    setInternshipInfo(prev => {
      const updated = { ...prev, [key]: htmlValue };
      onChange && onChange(itemId, updated);
      return updated;
    });
  }, [itemId, onChange]);

  // 普通字段更新
  const updateInternshipField = (key, value) => {
    setInternshipInfo(prev => {
      const updated = { ...prev, [key]: value };
      onChange && onChange(itemId, updated);
      return updated;
    });
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
          
          const maxWidth = 1024;
          const maxHeight = 1024;
          
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
          
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.6);
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
      try {
        const compressedBlob = await compressImage(file);
        const reader = new FileReader();
        reader.onload = () => {
          updateInternshipField('mediaType', fileType);
          updateInternshipField('mediaFile', new File([compressedBlob], file.name, { type: 'image/jpeg' }));
          updateInternshipField('mediaPreview', reader.result);
        };
        reader.readAsDataURL(compressedBlob);
      } catch (error) {
        console.error('图片压缩失败:', error);
        alert('图片处理失败，请重试');
      }
    } else if (file.type.includes('video')) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('视频文件大小不能超过10MB');
        return;
      }
      fileType = 'video';
      const reader = new FileReader();
      reader.onload = () => {
        updateInternshipField('mediaType', fileType);
        updateInternshipField('mediaFile', file);
        updateInternshipField('mediaPreview', reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('仅支持图片或视频文件');
      return;
    }
  };

  // 移除媒体
  const removeMedia = () => {
    updateInternshipField('mediaType', '');
    updateInternshipField('mediaFile', null);
    updateInternshipField('mediaPreview', null);
    updateInternshipField('mediaDescription', '');
  };

  return (
    <div className="internship-container">
      <div className="internship-section">
        <div className="section-header">
          <h2>Internship {index + 1}</h2>
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
              onChange={(e) => updateInternshipField('companyName', e.target.value)}
              placeholder="e.g. Google"
              className="info-input"
            />
          </div>

          <div className="input-row">
            <label className="label">Position:</label>
            <input
              type="text"
              value={internshipInfo.position}
              onChange={(e) => updateInternshipField('position', e.target.value)}
              placeholder="e.g. Software Engineer Intern"
              className="info-input"
            />
          </div>

          <div className="input-row">
            <label className="label">Duration:</label>
            <input
              type="text"
              value={internshipInfo.duration}
              onChange={(e) => updateInternshipField('duration', e.target.value)}
              placeholder="e.g. June 2023 - August 2023"
              className="info-input"
            />
          </div>

          <div className="input-row">
            <label className="label">Summary:</label>
            <input
              type="text"
              value={internshipInfo.summary}
              onChange={(e) => updateInternshipField('summary', e.target.value)}
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
              onChange={(e) => updateInternshipField('detailTitle', e.target.value)}
              className="info-input"
            />
          </div>
          <div>
            <label id={`detailLabel-${itemId}`} style={{ fontWeight: 'bold' }}>
              {internshipInfo.detailTitle}
            </label>
            <div
              id={detailEditorId}
              style={{ height: '150px', marginBottom: '20px' }}
            />
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
                onChange={(e) => updateInternshipField('mediaDescription', e.target.value)}
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
              onChange={(e) => updateInternshipField('otherTitle', e.target.value)}
              className="info-input"
            />
          </div>
          <div>
            <label id={`otherLabel-${itemId}`} style={{ fontWeight: 'bold' }}>
              {internshipInfo.otherTitle}
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

export default Internship;
