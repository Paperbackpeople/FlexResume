import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const Editor = ({ onSave }) => {
    const quillRef = useRef(null);

    useEffect(() => {
        // 初始化 Quill 编辑器
        const quill = new Quill('#quill-editor', {
            theme: 'snow',
            placeholder: 'Enter your content...',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'], // 字体样式
                    [{ list: 'ordered' }, { list: 'bullet' }], // 有序和无序列表
                    ['link'], // 超链接
                ],
            },
        });

        quillRef.current = quill;
    }, []);

    const handleSave = () => {
        if (quillRef.current) {
            const htmlContent = quillRef.current.root.innerHTML; // 提取 HTML 内容
            onSave(htmlContent); // 将 HTML 内容传递给父组件
        }
    };

    return (
        <div>
            <div id="quill-editor" style={{ height: '200px', marginBottom: '20px' }}></div>
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default Editor;