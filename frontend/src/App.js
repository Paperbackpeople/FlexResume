// import React, { useRef, useEffect } from 'react';
// import Quill from 'quill';
// import 'quill/dist/quill.snow.css'; // 引入 Quill 样式
// import PersonalInfo from './components/PersonalInfo';
// import './App.css';
//
// // 创建 Quill 的 Context
// export const QuillContext = React.createContext(null);
//
// function App() {
//     const quillRef = useRef(null); // 全局 Quill 实例的容器
//
//     useEffect(() => {
//         // 初始化 Quill
//         if (!quillRef.current) {
//             const quill = new Quill('#global-quill', {
//                 theme: 'snow', // 使用 Snow 主题
//                 placeholder: 'Start typing here...',
//                 modules: {
//                     toolbar: [
//                         ['bold', 'italic', 'underline'], // 富文本工具栏
//                         [{ color: [] }, { background: [] }], // 字体颜色和背景颜色
//                         [{ list: 'ordered' }, { list: 'bullet' }], // 列表
//                         ['link'], // 超链接
//                     ],
//                 },
//             });
//             quillRef.current = quill;
//         }
//     }, []);
//
//     return (
//         <QuillContext.Provider value={quillRef}>
//             <div className="App">
//                 <h1>Resume Builder</h1>
//                 <div id="global-quill" style={{display: 'none'}}></div>
//                 {/* 传递 Quill Context 给子组件 */}
//                 <PersonalInfo/>
//                 {/* 隐藏的全局 Quill 容器 */}
//             </div>
//         </QuillContext.Provider>
//     );
// }
//
// export default App;
import React, { useState } from 'react';
import Editor from './components/Editor';

const App = () => {
    const [savedContent, setSavedContent] = useState('');

    const handleSave = (content) => {
        console.log('Saved Content:', content); // 模拟保存到数据库
        setSavedContent(content); // 保存到 state，用于展示
    };

    return (
        <div>
            <h1>Quill to HTML Demo</h1>
            <Editor onSave={handleSave} />
            <h2>Rendered HTML:</h2>
            <div
                dangerouslySetInnerHTML={{ __html: savedContent }}
                style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}
            />
        </div>
    );
};

export default App;