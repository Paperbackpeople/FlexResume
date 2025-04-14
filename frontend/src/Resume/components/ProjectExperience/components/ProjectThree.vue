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
        <h3>技术栈</h3>
        <ul>
          <li v-for="(tech, index) in technologies" :key="index">{{ tech }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProjectThree',
    data() {
      return {
        name: '项目三',
        brief: '简短描述',
        description: '详细描述...',
        technologies: ['Vue.js', 'Webpack', 'ES6'],
        video: '/path/to/your/video.mp4'
      }
    }
  }
  </script>