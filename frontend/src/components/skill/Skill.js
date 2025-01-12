import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './Skill.css';

const Skill = () => {
    const quillRef = useRef(null);

    useEffect(() => {
        if (!quillRef.current) {
            const quill = new Quill('#editor', {
                theme: 'snow',
                placeholder: "1. 编程语言: Java（熟练）、Python（熟练）、C（掌握）、MATLAB、SQL、HTML、Pandas\n2. 框架: Spring Boot、Django、Flask、React、Vue.js\n3. 工具: Git、Docker、Jenkins、Jira、Confluence\n4. 数据库: MySQL、MongoDB、Redis\n5. 其他: RESTful API、微服务、设计模式、数据结构与算法、Linux、Nginx、Tomcat、JVM、TCP/IP、HTTP、Websocket、OAuth2.0、JWT、CI/CD、TDD",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        ['link'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                    ],
                },
            });
            quillRef.current = quill;
        }
    }, []);

    const handleSave = () => {
        if (quillRef.current) {
            const content = quillRef.current.root.innerHTML;
            console.log('Saved Content:', content); 
        }
    };

    return (
        <div className="skill-container">
            <div id="editor" style={{ height: '200px', marginBottom: '20px' }}></div>
        </div>
    );
};

export default Skill;
