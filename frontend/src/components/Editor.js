import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const Editor = () => {
    const quillRef = useRef(null);

    useEffect(() => {
        if (!quillRef.current) {
            const quill = new Quill('#editor', {
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
            quillRef.current = quill;
        }
    }, []);

    const handleSave = () => {
        if (quillRef.current) {
            const content = quillRef.current.root.innerHTML;
            console.log('Saved Content:', content); // 在组件内部处理保存逻辑
        }
    };

    return (
        <div>
            <div id="editor" style={{ height: '200px', marginBottom: '20px' }}></div>
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default Editor;
