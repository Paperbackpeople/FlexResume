import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const Editor = ({ onSave }) => {
    const quillRef = useRef(null);

    useEffect(() => {
        // Prevent duplicate initialization
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
            const htmlContent = quillRef.current.root.innerHTML; // Extract HTML content
            onSave(htmlContent); // Pass HTML content to parent
        }
    };

    return (
        <div>
            {/* Quill Editor */}
            <div id="editor" style={{ height: '200px', marginBottom: '20px' }}></div>
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default Editor;
