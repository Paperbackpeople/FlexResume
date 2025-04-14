<template>
    <div>
      <h2>{{ name }}</h2>
      <div class="detail-info">
        <p>{{ description }}</p>
        <div class="video-container">
          <video 
            v-if="video" 
            controls 
            class="project-video">
            <source :src="video" type="video/mp4">
            您的浏览器不支持视频播放。
          </video>
        </div>
        <h3>项目详情</h3>
        <ul>
          <li v-for="(detail, index) in details" :key="index">
            <span class="detail-title">{{ getDetailTitle(detail)}}：</span>
            {{ getDetailContent(detail)}}
          </li>
        </ul>
        <h3>技术栈</h3>
        <ul>
          <li v-for="(tech, index) in technologies" :key="index">{{ tech }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProjectFour',
    data() {
      return {
        name: 'MIT交换生项目：计算机视觉方向',
        brief: '掌握计算机视觉和机器学习概念，使用ResNet50进行迁移学习，实现真实鞋子图像与草图的匹配。',
        description: '通过MIT交换生项目深入学习计算机视觉与机器学习的核心概念，重点理解并应用了CNN、ResNet和GAN等网络模型，完成了基于ResNet50的迁移学习实践。',
        technologies: ['Python', 'PyTorch', 'ResNet', 'GAN', 'OpenCV', '深度学习'],
        video: 'https://www.wangzhaoyu.com/videos/mit_project.mp4',  // 替换为实际视频链接
        details: [
          '课程学习：深入理解卷积神经网络（CNN）、残差网络（ResNet）和生成对抗网络（GAN）等计算机视觉核心模型。',
          '迁移学习：基于ResNet50进行迁移学习，固定最后一层之前的权重，修改全连接层以适应新的数据集。',
          '项目实现：完成了真实鞋子图像与手绘草图的匹配功能，展示了迁移学习在小数据集上的强大效果。',
        ]
      };
    },
    methods: {
      getDetailTitle(detail) {
        return detail.split('：')[0];
      },
      getDetailContent(detail) {
        return detail.split('：')[1];
      }
    }
  };
  </script>
  
  <style>
  .detail-info {
    margin-top: 20px;
  }
  
  ul {
    margin-top: 10px;
    list-style-type: disc;
    padding-left: 20px;
  }
  
  h3 {
    margin-top: 20px;
    color: #2c3e50;
  }
  
  .detail-title {
    font-weight: bold;
    color: #2c3e50;
  }
  
  .video-container {
    width: 80%;
    max-width: 1000px;
    max-height: 500px;
    margin: 20px auto;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .project-video {
    width: 100%;
    height: auto;
    max-height: 400px;
    object-fit: contain;
    display: block;
  }
  </style>
  