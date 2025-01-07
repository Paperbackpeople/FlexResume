import React from 'react';
import 'quill/dist/quill.snow.css'; // 引入 Quill 样式
import PersonalInfo from './components/PersonalInfo';
import './App.css';

// 创建 Quill 的 Context

function App() {
    return (
        <div className="App">
            <h1>Resume Builder</h1>
            {/* 传递 Quill Context 给子组件 */}
            <PersonalInfo/>
            {/* 隐藏的全局 Quill 容器 */}
        </div>
    );
}

// export default App;
// import React, { useState } from 'react';
// import Editor from './components/Editor';

// const App = () => {
//     const [savedContent, setSavedContent] = useState('');

//     const handleSave = (content) => {
//         console.log('Saved Content:', content); // 模拟保存到数据库
//         setSavedContent(content); // 保存到 state，用于展示
//     };

//     return (
//         <div>
//             <h1>Quill to HTML Demo</h1>
//             <Editor onSave={handleSave} />
//             <h2>Rendered HTML:</h2>
//             <div
//                 dangerouslySetInnerHTML={{ __html: savedContent }}
//                 style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}
//             />
//         </div>
//     );
// };

export default App;