<template>
  <div v-if="projectData.name">
    <h2>{{ projectData.name }}</h2>
    <div class="detail-info">
      <p>{{ projectData.description }}</p>
      <div class="video-container">
        <video 
          v-if="projectData.video" 
          controls 
          class="project-video">
          <source :src="projectData.video" type="video/mp4">
          {{ $t('videoWarning') }}
        </video>
      </div>
      <h3>{{ $t('projectsDetail') }}</h3>
      <ul>
        <li v-for="(detail, index) in projectData.details" :key="index">
          <span class="detail-title">{{ getDetailTitle(detail) }}：</span>
          {{ getDetailContent(detail) }}
        </li>
      </ul>
      <h3>{{ $t('techStack') }}</h3>
      <ul>
        <li v-for="(tech, index) in projectData.technologies" :key="index">{{ tech }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { watch, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'ProjectOne',
  setup() {
    const { locale } = useI18n();

    // 定义内容
    const englishContent = {
      name: 'China Food Delivery System',
      description: 'The China Food Delivery System is a full-stack application combining modern frontend and high-performance backend to optimize food delivery operations and ensure secure, stable system performance.',
      technologies: ['Vue 3', 'Spring Boot', 'MySQL', 'Redis', 'MyBatis', 'RabbitMQ', 'Nginx', 'Docker', 'Docker-Compose', 'AWS'],
      video: 'https://www.wangzhaoyu.com/videos/deliver.mp4',
      details: [
        'Backend Development: Built RESTful APIs with Spring Boot, designed database schemas based on project requirements, and implemented data persistence with MyBatis. Utilized Redis for caching to ensure high-performance data access and to guarantee the uniqueness of order inserts. Used RabbitMQ for message queuing to ensure stability during peak order periods.',
        'Frontend Development: Created the user interface using Vue 3, implemented efficient routing with Vue Router, managed resources and tokens with Vuex, and ensured persistent user state using Local Storage.',
        'Security: Implemented JWT Token for user authentication, configured filters to ensure request security, and prevented unauthorized access.',
        'Performance Optimization: Utilized Nginx for caching, load balancing, and reverse proxying to optimize system response time and improve stability.',
        'Containerized Deployment: Containerized backend and frontend applications with Docker, managed multi-container deployment with Docker-Compose, and deployed to AWS Cloud to ensure high availability and scalability.'
      ]
    };

    const chineseContent = {
      name: '中国食品配送系统',
      description: '中国食品配送系统是一个全栈应用，结合现代前端和高性能后端，旨在优化食品配送操作，提供安全稳定的系统性能。',
      technologies: ['Vue 3', 'Spring Boot', 'MySQL', 'Redis', 'MyBatis', 'RabbitMQ', 'Nginx', 'Docker', 'Docker-Compose', 'AWS'],
      video: 'https://www.wangzhaoyu.com/videos/deliver.mp4',
      details: [
        '后端开发：使用 Spring Boot 构建 RESTful APIs，基于项目需求设计数据库模式，结合 MyBatis 实现数据持久化。使用 Redis 进行缓存，确保高性能数据访问，并通过 Redis 保证订单插入的唯一性。 使用 RabbitMQ 进行消息队列，确保高峰期订单插入的稳定性。',
        '前端开发：使用 Vue 3 构建用户界面，结合 Vue Router 实现前端页面的高效路由跳转，使用 Vuex 进行资源和令牌存储管理，并通过 Local Storage 保持用户状态的持久化。',
        '安全性：使用 JWT Token 实现用户登录认证，配置过滤器确保请求安全，防止未授权访问。',
        '性能优化：通过 Nginx 实现缓存、负载均衡和反向代理，优化系统响应时间，提升系统稳定性。',
        '容器化部署：使用 Docker 容器化后端与前端应用，结合 Docker-Compose 管理多容器部署，简化开发与部署流程。最终部署到 AWS 云服务，确保系统高可用性和可扩展性。'
      ]
    };

    // 响应式项目数据
    const projectData = ref({});

    // 初始化项目数据
    const setInitialProjectData = () => {
      projectData.value = locale.value === 'en' ? { ...englishContent } : { ...chineseContent };
    };

    // 监听语言变化
    watch(locale, (newLocale) => {
      projectData.value = newLocale === 'en' ? { ...englishContent } : { ...chineseContent };
    });

    // 设置初始值
    onMounted(() => {
      setInitialProjectData();
    });

    return {
      projectData
    };
  },
  methods: {
    getSeparator() {
      // 根据当前语言选择分隔符
      return this.$i18n.locale === 'zh' ? '：' : ':';
    },
    getDetailTitle(detail) {
      const separator = this.getSeparator();
      return detail.split(separator)[0];
    },
    getDetailContent(detail) {
      const separator = this.getSeparator();
      return detail.split(separator)[1];
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
  width: 100%;
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
