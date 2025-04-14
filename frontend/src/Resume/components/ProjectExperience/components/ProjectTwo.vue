<template>
  <div v-if="projectData.name">
    <h2>{{ projectData.name }}</h2>
    <div class="detail-info">
      <div class="description">
        <p>{{ projectData.description.intro }}</p>
        <h3>{{ $t('projectsDetail') }}</h3>
        <ul class="feature-list">
          <li v-for="(feature, index) in projectData.description.features" :key="index">
            {{ feature }}
          </li>
        </ul>
        <p class="conclusion-text">{{ projectData.description.conclusion }}</p>
      </div>
      <div class="video-container">
        <video 
          v-if="projectData.video" 
          controls 
          class="project-video">
          <source :src="projectData.video" type="video/mp4">
          {{ $t('videoWarning') }}
        </video>
      </div>
      <h3>{{ $t('techStack') }}</h3>
      <ul>
        <li v-for="(tech, index) in projectData.technologies" :key="index">{{ tech }}</li>
      </ul>
    </div>
  </div>
</template>


<script>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';

export default {
  name: 'ProjectTwo',
  setup() {
    const { locale } = useI18n();

    // 英文内容
    const englishContent = {
      name: 'Distributed Treasure Hunt Game',
      description: {
        intro: 'This project is a distributed treasure hunt game. The game does not rely on a central server. All nodes (players) form a dynamic network using the Java RMI registry. The primary and backup nodes are dynamically elected based on player priority. When the primary node fails, the backup or another player automatically takes over, ensuring high availability and fault tolerance.',
        features: [
          'No centralized server: Using Java RMI registry, all player nodes equally participate in the game. The primary server is dynamically selected based on player priority.',
          'Primary/backup server election: When a primary server failure is detected, the system automatically triggers a re-election to ensure uninterrupted gameplay.',
          'Fault tolerance and reliability: Mechanisms handle player exits and server crashes. The primary and backup servers can be re-elected after crashes, ensuring continuity.',
          'Gossip protocol communication: Gossip protocol ensures state synchronization and heartbeat detection (ping), keeping game states (maze info, player positions, scores, treasure distribution) updated.',
          'Multithreading and blocking queues: Multithreading is used for player message handling, with blocking queues ensuring consistency and safe updates in the game state.',
          'Performance and scalability: The system allows new players to join or exit dynamically, maintaining performance using decentralization and caching mechanisms.'
        ],
        conclusion: 'The project demo in the video showcases maze generation, player movement, treasure distribution, score updates, primary/backup server election, and player joining/leaving.'
      },
      technologies: [
        'Java',
        'RMI (Remote Method Invocation)',
        'Multithreading',
        'Gossip Protocol',
        'Distributed Leader Election',
        'Data Consistency and Fault Tolerance'
      ],
      video: 'https://www.wangzhaoyu.com/videos/maze_game.mp4'
    };

    // 中文内容
    const chineseContent = {
      name: '分布式寻宝游戏',
      description: {
        intro: '本项目是一个分布式的寻宝小游戏。游戏中不存在单一中心服务器，所有节点（玩家）通过Java RMI注册表实现动态组网。主节点和备份节点由玩家优先级动态选定，当主节点宕机时，备份节点或其他玩家会自动选举出新的主服务器，从而确保系统的高可用性和容错性。',
        features: [
          '无中心化服务器：利用Java RMI的注册表机制，所有玩家节点平等地参与游戏，主服务器并非固定，而是根据玩家优先级动态选取。',
          '主/备服务器选举：当检测到主服务器崩溃后，系统会自动触发重新选举，确保游戏不中断。',
          '容错与可靠性：针对玩家退出和服务器崩溃，有相应的故障处理机制。主服务器和备份服务器能够在崩溃后通过选举流程重新设定，保证游戏继续进行。',
          'Gossip协议通信：通过Gossip机制实现状态同步和心跳检测（ping），确保所有玩家的游戏状态（迷宫信息、玩家位置、得分、宝物分布）及时更新。',
          '多线程与阻塞队列：使用多线程处理玩家间消息传递，通过阻塞队列保证多线程下的游戏状态一致性和安全更新。',
          '性能与伸缩性：系统可随时有新玩家加入或玩家退出，利用无中心化结构和缓存机制维持性能。'
        ],
        conclusion: '该项目具体展示在视频中，展示内容包括：迷宫生成、玩家移动、宝物分布、得分更新、主/备服务器选举、玩家退出与加入。'
      },
      technologies: [
        'Java',
        'RMI (远程方法调用)',
        '多线程',
        'Gossip协议',
        '分布式选主机制',
        '数据一致性与容错机制'
      ],
      video: 'https://www.wangzhaoyu.com/videos/maze_game.mp4'
    };

  // 响应式项目数据，提供默认值
  const projectData = ref({
      name: '',
      description: {
        intro: '',
        features: [],
        conclusion: ''
      },
      technologies: [],
      video: ''
    });

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
  }
};
</script>
  <style scoped>
  .detail-info {
    margin-top: 20px;
  }
  .video-container {
  width: 100%; /* 父容器宽度占 80% */
  max-width: 1000px; /* 最大宽度 */
  max-height: 500px; /* 最大高度 */
  margin: 20px auto; /* 上下 20px 间距，水平居中 */
  border-radius: 8px; /* 圆角 */
  overflow: hidden; /* 隐藏超出部分 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  }
  .project-video {
    width: 100%; /* 填满父容器 */
    height: auto; /* 高度自动适配 */
    max-height: 400px; /* 最大高度限制 */
    object-fit: contain; /* 保持完整内容显示 */
    display: block; /* 独占一行 */
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
  
  .conclusion-text {
    font-weight: 500;
    font-size: 1.1rem;
    padding: 15px;
    background-color: #f8f9fa;
    border-left: 4px solid #42b983;
    border-radius: 4px;
    margin: 1.5em 0;
  }
  </style>