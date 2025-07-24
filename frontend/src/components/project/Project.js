import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Project.css';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

/**
 * Project card component
 * - 静默加载 initialData 到 Quill 一次
 * - 后续输入不会触发光标跳动
 */
function Project({
  itemId,
  index,
  isLast,
  addProject,
  removeProject,
  onChange,
  initialData,
}) {
  /* ========== 1. 本地 state ========== */
  const [projectInfo, setProjectInfo] = useState({
    time: '',
    name: '',
    summary: '',
    detailTitle: '项目详情',
    detailContent: '',
    mediaType: '',
    mediaFile: null,
    mediaPreview: null,
    mediaDescription: '',
    otherTitle: '其他内容',
    otherContent: '',
    ...initialData,
  });

  const steps = ['基本信息', '项目详情', '媒体上传', '其他内容'];
  const [activeStep, setActiveStep] = useState(0);

  /* ---------- 同步 / 控制变量 ---------- */
  const isUpdatingFromParent = useRef(false);    // 父级同步标识
  const hasInitialized        = useRef(false);   // 组件是否做过首次 init
  const prevItemIdRef         = useRef(itemId);  // 记录上一个 itemId
  const hasContentLoaded      = useRef(false);   // Quill 是否已加载过 initialData
  const lastInitialDataRef    = useRef(JSON.stringify(initialData)); // 存储上一次的 initialData 字符串
  const isUserTyping          = useRef(false);   // 🔥 用户正在输入标志位

  /* ---------- 当父组件切卡 or 首次挂载 ---------- */
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
        setProjectInfo(prev => ({ ...prev, ...initialData }));
        hasInitialized.current = true;
        prevItemIdRef.current = itemId;
        lastInitialDataRef.current = currentDataStr;
        // 切卡后重置 Quill 内容加载标记
        hasContentLoaded.current = false;
        setTimeout(() => { isUpdatingFromParent.current = false; }, 0);
      }
    }
  }, [itemId, initialData]);

  /* ========== 2. Quill 配置 ========== */
  const detailQuillRef = useRef(null);
  const otherQuillRef  = useRef(null);
  const detailEditorId = `detailEditor-${itemId}`;
  const otherEditorId  = `otherEditor-${itemId}`;

  /* Quill 内容变更 -> 更新 state & 告知父级 */
  const handleQuillChange = useCallback((key, htmlValue) => {
    if (isUpdatingFromParent.current) return;
    
    // 🔥 标记用户正在输入
    isUserTyping.current = true;
    
    setProjectInfo(prev => {
      const updated = { ...prev, [key]: htmlValue };
      setTimeout(() => onChange && onChange(itemId, updated), 0);
      return updated;
    });

    // 🔥 输入结束后300ms清除标志位
    setTimeout(() => {
      isUserTyping.current = false;
    }, 300);
  }, [itemId, onChange]);

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

    // detail editor
    if (!detailQuillRef.current && document.getElementById(detailEditorId)) {
      detailQuillRef.current = new Quill(`#${detailEditorId}`, quillOptions);
      detailQuillRef.current.on('text-change', (d, o, src) => {
        if (src === 'user') {
          const html = detailQuillRef.current.root.innerHTML;
          handleQuillChange('detailContent', html);
        }
      });
    }

    // other editor
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

  /* ---------- 首次将 initialData 写入 Quill ---------- */
  useEffect(() => {
    if (hasContentLoaded.current) return;                   // 只执行一次
    if (!detailQuillRef.current || !otherQuillRef.current) return; // 等实例就绪

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
  const updateProjectField = (key, value) => {
    // 🔥 标记用户正在输入
    isUserTyping.current = true;
    
    setProjectInfo(prev => {
      const updated = { ...prev, [key]: value };
      setTimeout(() => onChange && onChange(itemId, updated), 0);
      return updated;
    });

    // 🔥 输入结束后300ms清除标志位
    setTimeout(() => {
      isUserTyping.current = false;
    }, 300);
  };

  const handleInputChange = (key, value) => {
    updateProjectField(key, value);
    if (key === 'detailTitle') {
      const el = document.getElementById(`detailLabel-${itemId}`);
      if (el) el.textContent = value;
    }
    if (key === 'otherTitle') {
      const el = document.getElementById(`otherLabel-${itemId}`);
      if (el) el.textContent = value;
    }
  };

  /* ========== 4. 媒体上传 ========== */
  const compressImage = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        const maxW = 1024, maxH = 1024;
        if (w > h && w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
        else if (h >= w && h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob(b => b ? resolve(b) : reject(new Error()), 'image/jpeg', 0.6);
      };
      img.onerror = () => reject(new Error());
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error());
    reader.readAsDataURL(file);
  });

  const handleFileChange = async e => {
    const file = e.target.files[0]; if (!file) return;
    if (file.type.includes('image')) {
      try {
        const blob = await compressImage(file);
        const fileObj = new File([blob], file.name, { type: 'image/jpeg' });
        const r = new FileReader();
        r.onload = () => setProjectInfo(prev => { const upd = { ...prev, mediaType: 'image', mediaFile: fileObj, mediaPreview: r.result, mediaDescription: '' }; setTimeout(() => onChange && onChange(itemId, upd), 0); return upd; });
        r.readAsDataURL(blob);
      } catch { alert('图片处理失败'); }
    } else if (file.type.includes('video')) {
      if (file.size > 10 * 1024 * 1024) { alert('视频不能超 10MB'); return; }
      const r = new FileReader();
      r.onload = () => setProjectInfo(prev => { const upd = { ...prev, mediaType: 'video', mediaFile: file, mediaPreview: r.result, mediaDescription: '' }; setTimeout(() => onChange && onChange(itemId, upd), 0); return upd; });
      r.readAsDataURL(file);
    } else alert('仅支持图片或视频');
  };

  const removeMedia = () => setProjectInfo(prev => { const upd = { ...prev, mediaType: '', mediaFile: null, mediaPreview: null, mediaDescription: '' }; setTimeout(() => onChange && onChange(itemId, upd), 0); return upd; });


  /* ========== 5. 组件 UI ========== */
  return (
    <div className="project-container">
      <div className="project-section">
        {/* 顶栏 */}
        <div className="section-header">
          <h2>Project {index + 1}</h2>
          <div className="button-group">
            <button className="remove-newButton" onClick={removeProject}>-</button>
            {isLast && (
              <button className="add-newButton" onClick={addProject}>+</button>
            )}
          </div>
        </div>

        {/* 步骤条 */}
        <ul className="stepper" style={{ marginBottom: 25 }}>
          {steps.map((label, idx) => (
            <li key={label} className={idx === activeStep ? 'active' : ''}>{label}</li>
          ))}
        </ul>

        {/* ========== 所有步骤内容 - 使用 display 控制显示 ========== */}
        
        {/* Step 0 基本信息 */}
        <div style={{ display: activeStep === 0 ? 'block' : 'none' }}>
          <div className="input-row">
            <label className="label label-required">项目名称</label>
            <input
              type="text"
              className="info-input"
              placeholder="示例：智能食品配送系统"
              value={projectInfo.name}
              onChange={e => handleInputChange('name', e.target.value)}
            />
          </div>

          <div className="input-row">
            <label className="label label-required">时间</label>
            <input
              type="text"
              className="info-input"
              placeholder="2024.05 - 2024.09"
              value={projectInfo.time}
              onChange={e => handleInputChange('time', e.target.value)}
            />
          </div>

          <div className="input-row">
            <label className="label">项目简介<span className="chip-optional">可选</span></label>
            <input
              type="text"
              className="info-input"
              placeholder="一句话概括项目核心价值"
              value={projectInfo.summary}
              onChange={e => handleInputChange('summary', e.target.value)}
            />
          </div>
        </div>

        {/* Step 1 详情 */}
        <div style={{ display: activeStep === 1 ? 'block' : 'none' }}>
          <div className="input-row">
            <label className="label label-required">详情标题</label>
            <input
              type="text"
              className="info-input"
              placeholder="如：主要职责 / 技术亮点"
              value={projectInfo.detailTitle}
              onChange={e => handleInputChange('detailTitle', e.target.value)}
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
        </div>

        {/* Step 2 媒体上传 */}
        <div style={{ display: activeStep === 2 ? 'block' : 'none' }}>
          <div className="upload-row">
            <label className="label">媒体文件<span className="chip-optional">可选</span></label>

            <input
              id={`fileInput-${itemId}`}
              type="file"
              style={{ display: 'none' }}
              accept="image/*,video/*"
              onChange={handleFileChange}
            />

            <div className="upload-actions">
              <button
                className="file-upload-button"
                onClick={() => document.getElementById(`fileInput-${itemId}`).click()}
              >
                选择文件
              </button>
              <button
                className="remove-media-button"
                onClick={removeMedia}
                disabled={!projectInfo.mediaFile}
              >
                移除媒体
              </button>
            </div>

            <div className="upload-hint" style={{ fontSize: '12px', color: '#666' }}>
              支持图片(自动压缩) 或 视频(≤10 MB)
            </div>
          </div>

          {projectInfo.mediaPreview && (
            <div className="upload-preview">
              <label className="upload-success-label">上传成功</label>
              <textarea
                className="media-description"
                placeholder="为该媒体写一句说明（可选）"
                value={projectInfo.mediaDescription}
                onChange={e => handleInputChange('mediaDescription', e.target.value)}
                style={{ height: '80px', resize: 'none', marginTop: '6px' }}
              />
            </div>
          )}
        </div>

        {/* Step 3 其他 */}
        <div style={{ display: activeStep === 3 ? 'block' : 'none' }}>
          <div className="input-row">
            <label className="label">其他标题<span className="chip-optional">可选</span></label>
            <input
              type="text"
              className="info-input"
              placeholder="如：技术栈 / 收获"
              value={projectInfo.otherTitle}
              onChange={e => handleInputChange('otherTitle', e.target.value)}
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

export default Project;