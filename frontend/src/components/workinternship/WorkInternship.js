import React, { useState, useEffect, useRef, useCallback } from 'react';
import './WorkInternship.css';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

function WorkInternship({
  itemId,
  index,
  isLast,
  addWorkInternship,
  removeWorkInternship,
  onChange,
  initialData,
}) {
  /* ========== 1. 本地 state & 控制变量 ========== */
  const [type, setType] = useState(initialData?.type || 'work');
  const [info, setInfo] = useState({
    time: '',
    company: '',
    position: '',
    summary: '',
    detailTitle: '工作/实习详情',
    detailContent: '',
    mediaType: '',
    mediaFile: null,
    mediaPreview: null,
    mediaDescription: '',
    otherTitle: '其他内容',
    otherContent: '',
    ...initialData,
  });

  const steps = ['基本信息', '详情', '媒体上传', '其他内容'];
  const [activeStep, setActiveStep] = useState(0);

  const isUpdatingFromParent = useRef(false);
  const hasInitialized        = useRef(false);
  const prevItemIdRef         = useRef(itemId);
  const hasContentLoaded      = useRef(false);   // ★ 只把 initialData 粘贴一次
  const lastInitialDataRef    = useRef(JSON.stringify(initialData)); // 存储上一次的 initialData 字符串
  const isUserTyping          = useRef(false);   // 🔥 用户正在输入标志位

  /* ---------- 首次挂载 & 切卡 ---------- */
  useEffect(() => {
    // 🔥 如果用户正在输入，完全忽略父组件的数据更新
    if (isUserTyping.current) {
      return;
    }

    const currentDataStr = JSON.stringify(initialData);
    const hasDataChanged = currentDataStr !== lastInitialDataRef.current;
    
    // 只在以下情况更新：
    // 1. 组件首次挂载
    // 2. 切换到不同的卡片
    // 3. initialData 内容真正发生变化（不是引用变化）且用户没在输入
    if (!hasInitialized.current || 
        prevItemIdRef.current !== itemId || 
        (hasDataChanged && !isUpdatingFromParent.current && !isUserTyping.current)) {
      
      if (initialData) {
        isUpdatingFromParent.current = true;
        setInfo(prev => ({ ...prev, ...initialData }));
        setType(initialData.type || 'work');
        hasInitialized.current = true;
        prevItemIdRef.current = itemId;
        lastInitialDataRef.current = currentDataStr;

        // 切卡 → 重新允许粘贴一次
        hasContentLoaded.current = false;

        setTimeout(() => { isUpdatingFromParent.current = false; }, 0);
      }
    }
  }, [itemId, initialData]);

  /* ========== 2. Quill 编辑器 ========== */
  const detailQuillRef = useRef(null);
  const otherQuillRef  = useRef(null);
  const detailEditorId = `detailEditor-${itemId}`;
  const otherEditorId  = `otherEditor-${itemId}`;

  /* Quill → state */
  const handleQuillChange = useCallback((key, htmlValue) => {
    if (isUpdatingFromParent.current) return;
    
    // 🔥 标记用户正在输入
    isUserTyping.current = true;
    
    setInfo(prev => {
      const updated = { ...prev, [key]: htmlValue };
      setTimeout(() => onChange?.(itemId, { ...updated, type }), 0);
      return updated;
    });

    // 🔥 输入结束后300ms清除标志位
    setTimeout(() => {
      isUserTyping.current = false;
    }, 300);
  }, [itemId, onChange, type]);

  /* 创建 Quill 实例（仅一次） */
  useEffect(() => {
    const quillOptions = {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
      },
    };

    if (!detailQuillRef.current && document.getElementById(detailEditorId)) {
      detailQuillRef.current = new Quill(`#${detailEditorId}`, quillOptions);
      detailQuillRef.current.on('text-change', (d, o, src) => {
        if (src === 'user') {
          const html = detailQuillRef.current.root.innerHTML;
          handleQuillChange('detailContent', html);
        }
      });
    }

    if (!otherQuillRef.current && document.getElementById(otherEditorId)) {
      otherQuillRef.current = new Quill(`#${otherEditorId}`, quillOptions);
      otherQuillRef.current.on('text-change', (d, o, src) => {
        if (src === 'user') {
          const html = otherQuillRef.current.root.innerHTML;
          handleQuillChange('otherContent', html);
        }
      });
    }
  }, [detailEditorId, otherEditorId, handleQuillChange]);

  /* ---------- 首次把 initialData 写入 Quill ---------- */
  useEffect(() => {
    if (hasContentLoaded.current) return;                                   // 只一次
    if (!detailQuillRef.current || !otherQuillRef.current) return;          // 等实例

    if (typeof initialData?.detailContent === 'string') {
      detailQuillRef.current.clipboard.dangerouslyPasteHTML(
        initialData.detailContent,
        'silent',
      );
    }
    if (typeof initialData?.otherContent === 'string') {
      otherQuillRef.current.clipboard.dangerouslyPasteHTML(
        initialData.otherContent,
        'silent',
      );
    }
    hasContentLoaded.current = true;
  }, [initialData, itemId]);

  /* ========== 3. 通用字段修改 ========== */
  const updateField = (key, value) => {
    // 🔥 标记用户正在输入
    isUserTyping.current = true;
    
    setInfo(prev => {
      const updated = { ...prev, [key]: value };
      setTimeout(() => onChange?.(itemId, { ...updated, type }), 0);
      return updated;
    });

    // 🔥 输入结束后300ms清除标志位
    setTimeout(() => {
      isUserTyping.current = false;
    }, 300);
  };

  const handleInputChange = (key, value) => {
    updateField(key, value);
    if (key === 'detailTitle') {
      const el = document.getElementById(`detailLabel-${itemId}`);
      if (el) el.textContent = value;
    }
    if (key === 'otherTitle') {
      const el = document.getElementById(`otherLabel-${itemId}`);
      if (el) el.textContent = value;
    }
  };

  // 媒体上传与 Project.js 保持一致
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
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
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          }, 'image/jpeg', 0.6);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type.includes('image')) {
      try {
        const compressedBlob = await compressImage(file);
        const fileObj = new File([compressedBlob], file.name, { type: 'image/jpeg' });
        const reader = new FileReader();
        reader.onload = () => {
          setInfo(prev => {
            const updated = {
              ...prev,
              mediaType: 'image',
              mediaFile: fileObj,
              mediaPreview: reader.result,
              mediaDescription: ''
            };
            setTimeout(() => { onChange?.(itemId, { ...updated, type }); }, 0);
            return updated;
          });
        };
        reader.readAsDataURL(compressedBlob);
      } catch (error) {
        alert('图片处理失败，请重试');
      }
    } else if (file.type.includes('video')) {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('视频文件大小不能超过 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setInfo(prev => {
          const updated = {
            ...prev,
            mediaType: 'video',
            mediaFile: file,
            mediaPreview: reader.result,
            mediaDescription: ''
          };
          setTimeout(() => { onChange?.(itemId, { ...updated, type }); }, 0);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert('仅支持图片或视频文件');
      return;
    }
  };

  const removeMedia = () => {
    setInfo(prev => {
      const updated = {
        ...prev,
        mediaType: '',
        mediaFile: null,
        mediaPreview: null,
        mediaDescription: ''
      };
      setTimeout(() => { onChange?.(itemId, { ...updated, type }); }, 0);
      return updated;
    });
  };

  return (
    <div className="project-container">
      <div className="project-section">
        {/* 顶栏 */}
        <div className="section-header">
          <h2>{type === 'internship' ? '实习' : '工作'} {index + 1}</h2>
          <div className="button-group">
            <button className="remove-newButton" onClick={removeWorkInternship}>-</button>
            {isLast && (
              <button className="add-newButton" onClick={addWorkInternship}>+</button>
            )}
          </div>
        </div>
        {/* 类型选择 */}
        <div className="input-row">
          <label className="label label-required">类型</label>
          <select
            className="info-input"
            value={type}
            onChange={e => {
              setType(e.target.value);
              setInfo(prev => {
                const updated = { ...prev, type: e.target.value };
                setTimeout(() => { onChange?.(itemId, updated); }, 0);
                return updated;
              });
            }}
          >
            <option value="work">正式工作</option>
            <option value="internship">实习</option>
          </select>
        </div>
        {/* 步骤条 */}
        <ul className="stepper" style={{ marginBottom: 25 }}>
          {steps.map((label, idx) => (
            <li key={label} className={idx === activeStep ? 'active' : ''}>{label}</li>
          ))}
        </ul>
        {/* Step 0 基本信息 */}
        <div style={{ display: activeStep === 0 ? 'block' : 'none' }}>
          <div className="input-row">
            <label className="label label-required">公司/单位</label>
            <input type="text" className="info-input" placeholder="公司/单位名称" value={info.company} onChange={e => handleInputChange('company', e.target.value)} />
          </div>
          <div className="input-row">
            <label className="label label-required">职位</label>
            <input type="text" className="info-input" placeholder="职位/岗位" value={info.position} onChange={e => handleInputChange('position', e.target.value)} />
          </div>
          <div className="input-row">
            <label className="label label-required">时间</label>
            <input type="text" className="info-input" placeholder="2023.07 - 2023.12" value={info.time} onChange={e => handleInputChange('time', e.target.value)} />
          </div>
          <div className="input-row">
            <label className="label">简介<span className="chip-optional">可选</span></label>
            <input type="text" className="info-input" placeholder="一句话概括" value={info.summary} onChange={e => handleInputChange('summary', e.target.value)} />
          </div>
        </div>
        {/* Step 1 详情 */}
        <div style={{ display: activeStep === 1 ? 'block' : 'none' }}>
          <div className="input-row">
            <label className="label label-required">详情标题</label>
            <input type="text" className="info-input" placeholder="如：主要职责 / 技术亮点" value={info.detailTitle} onChange={e => handleInputChange('detailTitle', e.target.value)} />
          </div>
          <div>
            <label id={`detailLabel-${itemId}`} style={{ fontWeight: 'bold' }}>{info.detailTitle}</label>
            <div id={detailEditorId} style={{ height: '150px', marginBottom: '20px' }} />
          </div>
        </div>
        {/* Step 2 媒体上传 */}
        <div style={{ display: activeStep === 2 ? 'block' : 'none' }}>
          <div className="upload-row">
            <label className="label">媒体文件<span className="chip-optional">可选</span></label>
            <input id={`fileInput-${itemId}`} type="file" style={{ display: 'none' }} accept="image/*,video/*" onChange={handleFileChange} />
            <div className="upload-actions">
              <button className="file-upload-button" onClick={() => document.getElementById(`fileInput-${itemId}`).click()}>选择文件</button>
              <button className="remove-media-button" onClick={removeMedia} disabled={!info.mediaFile}>移除媒体</button>
            </div>
            <div className="upload-hint" style={{ fontSize: '12px', color: '#666' }}>支持图片(自动压缩) 或 视频(≤10 MB)</div>
          </div>
          {info.mediaPreview && (
            <div className="upload-preview">
              <label className="upload-success-label">上传成功</label>
              <textarea className="media-description" placeholder="为该媒体写一句说明（可选）" value={info.mediaDescription} onChange={e => handleInputChange('mediaDescription', e.target.value)} style={{ height: '80px', resize: 'none', marginTop: '6px' }} />
            </div>
          )}
        </div>
        {/* Step 3 其他 */}
        <div style={{ display: activeStep === 3 ? 'block' : 'none' }}>
          <div className="input-row">
            <label className="label">其他标题<span className="chip-optional">可选</span></label>
            <input type="text" className="info-input" placeholder="如：技术栈 / 收获" value={info.otherTitle} onChange={e => handleInputChange('otherTitle', e.target.value)} />
          </div>
          <div>
            <label id={`otherLabel-${itemId}`} style={{ fontWeight: 'bold' }}>{info.otherTitle}</label>
            <div id={otherEditorId} style={{ height: '150px', marginBottom: '20px' }} />
          </div>
        </div>
        {/* 步骤切换 */}
        <div className="step-actions">
          {activeStep > 0 && (
            <button onClick={() => setActiveStep(activeStep - 1)}>上一步</button>
          )}
          {activeStep < steps.length - 1 && (
            <button onClick={() => setActiveStep(activeStep + 1)}>下一步</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkInternship;