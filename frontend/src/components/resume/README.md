# React 简历预览组件

这个目录包含了从Vue重构为React的简历预览组件，用于在右侧实时预览从数据库加载的简历数据。

## 组件结构

```
resume/
├── ResumePreview.js      # 主预览组件
├── PersonalInfo.js       # 个人信息组件
├── Education.js          # 教育经历组件
├── ProjectExperience.js  # 项目经验组件
├── WorkInternshipExperience.js # 工作与实习经历组件
├── Skills.js             # 技能组件
├── ErrorBoundary.js      # 错误边界组件
├── Resume.css            # 样式文件
└── README.md             # 说明文档
```

## 功能特性

1. **实时数据加载**: 从MongoDB数据库实时获取简历数据
2. **响应式设计**: 支持桌面端和移动端显示
3. **错误处理**: 包含错误边界和加载状态处理
4. **数据转换**: 自动转换数据库数据格式为组件所需格式

## 使用方法

### 在App.js中使用

```jsx
import ResumePreview from './components/resume/ResumePreview';
import ErrorBoundary from './components/resume/ErrorBoundary';

// 在右侧预览区域
<div className="preview">
  <h1>Preview</h1>
  <ErrorBoundary>
    <ResumePreview username={username} version={version} />
  </ErrorBoundary>
</div>
```

### 独立使用

```jsx
import ResumePreview from './components/resume/ResumePreview';

function MyComponent() {
  return (
    <ResumePreview 
      username="your-username" 
      version={1} 
    />
  );
}
```

## API接口

组件会自动调用以下API接口获取数据：

- `GET /api/personal-info/{username}/{version}` - 个人信息
- `GET /api/education-info?username={username}&version={version}` - 教育信息
- `GET /api/project-info?username={username}&version={version}` - 项目信息
- `GET /api/workinternship-info?username={username}&version={version}` - 工作与实习信息
- `GET /api/skill/{username}/{version}` - 技能信息

## 数据格式

### 个人信息
```json
{
  "username": "string",
  "version": "number",
  "fields": [
    {
      "label": "姓名：",
      "value": "张三"
    }
  ],
  "profilePhoto": "base64-string"
}
```

### 教育信息
```json
{
  "username": "string",
  "version": "number",
  "education": {
    "education0": {
      "school": "学校名称",
      "degree": "学位",
      "fieldOfStudy": "专业",
      "startDate": "开始时间",
      "graduationYear": "毕业时间",
      "gpa": "GPA",
      "courses": [...],
      "awards": [...]
    }
  }
}
```

### 项目信息
```json
{
  "username": "string",
  "version": "number",
  "projectData": {
    "project0": {
      "name": "项目名称",
      "brief": "项目简介",
      "time": "项目时间",
      "technologies": ["技术栈"],
      "video": "视频URL",
      "images": ["图片URL"],
      "workDetails": ["工作详情"]
    }
  }
}
```

### 工作与实习信息
```json
{
  "username": "string",
  "version": "number",
  "workInternshipData": {
    "work0": {
      "type": "work/internship",
      "company": "公司名称",
      "position": "职位",
      "time": "时间",
      "summary": "一句话简介",
      "detailTitle": "详情标题",
      "detailContent": "<p>富文本内容</p>",
      "mediaType": "image/video",
      "mediaPreview": "base64或url",
      "mediaDescription": "媒体说明",
      "otherTitle": "其他标题",
      "otherContent": "<p>富文本内容</p>"
    }
  }
}
```

## 样式定制

可以通过修改 `Resume.css` 文件来自定义样式，主要样式类包括：

- `.resume-preview` - 主容器
- `.section` - 各个区块
- `.info-container` - 信息容器
- `.education-item` - 教育项目
- `.project-item` - 项目项目
- `.workinternship-item` - 工作与实习项目
- `.skill-category` - 技能分类

## 注意事项

1. 确保后端API服务正在运行
2. 检查网络连接和API路径配置
3. 数据为空时会显示加载状态
4. 错误时会显示错误边界组件
5. 技能内容支持HTML格式显示 