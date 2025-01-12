import React, { useRef, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './Skill.css';
import axios from 'axios';

const Skill = ({ username, version }) => {
    const quillRef = useRef(null);       // Quill 编辑器引用
    const saveTimeout = useRef(null);    // 保存定时器引用
    const [content, setContent] = useState(''); // 从后端加载的内容状态

    /**
     * 1. 初始化 Quill 编辑器
     */
    useEffect(() => {
        // 若已经初始化过 quill，则不重复初始化
        if (quillRef.current) return;

        // 初始化 Quill
        const quill = new Quill('#editor', {
            theme: 'snow',
            placeholder: `1. 编程语言: Java（熟练）、Python（熟练）、C（掌握）、MATLAB、SQL、HTML、Pandas
2. 框架: Spring Boot、Django、Flask、React、Vue.js
3. 工具: Git、Docker、Jenkins、Jira、Confluence
4. 数据库: MySQL、MongoDB、Redis
5. 其他: RESTful API、微服务、设计模式、数据结构与算法、Linux、Nginx、Tomcat、JVM、TCP/IP、HTTP、Websocket、OAuth2.0、JWT、CI/CD、TDD`,
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

        // 监听编辑器内容变化 => 更新 content 状态
        quill.on('text-change', () => {
            const html = quill.root.innerHTML;
            setContent(html);
        });

        // 清理函数（组件卸载时执行）
        return () => {
            if (saveTimeout.current) {
                clearTimeout(saveTimeout.current);
            }
        };
    }, []);

    /**
     * 2. 加载后端数据，当 username 或 version 变化时触发
     */
    useEffect(() => {
        if (username) {
            fetchSkillContent(username, version);
        }
    }, [username, version]);

    /**
     * 3. 监听 content，每次变更后启动 10 秒自动保存
     */
    useEffect(() => {
        // 如果已有定时器，则先清除
        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
        }

        // 10 秒无变动后自动保存到数据库
        saveTimeout.current = setTimeout(() => {
            saveSkillContent();
        }, 10000);

        // 组件卸载或 content 改变前，清理当前定时器
        return () => clearTimeout(saveTimeout.current);
    }, [content]);

    /**
     * 4. 从后端加载技能内容
     */
    const fetchSkillContent = async (username, version) => {
        try {
            const response = await axios.get(`/api/skill/${username}/${version}`);
            const fetchedContent = response.data.content;

            if (fetchedContent) {
                // 更新编辑器与预览区
                quillRef.current.root.innerHTML = fetchedContent;
                setContent(fetchedContent);
            }
        } catch (error) {
            console.error('加载技能内容失败:', error);
        }
    };

    /**
     * 5. 自动保存技能内容到后端
     */
    const saveSkillContent = async () => {
        if (!quillRef.current) return;
        const htmlContent = quillRef.current.root.innerHTML; // 获取编辑器内容
        const data = { username, version, content: htmlContent };

        try {
            await axios.post('/api/skill', data);
            console.log('自动保存成功:', new Date().toLocaleString());
        } catch (error) {
            console.error('自动保存失败:', error);
        }
    };

    return (
        <div className="skill-container">
            {/* Quill 编辑器区域 */}
            <div id="editor" style={{ height: '200px', marginBottom: '20px' }}></div>
        </div>
    );
};

export default Skill;