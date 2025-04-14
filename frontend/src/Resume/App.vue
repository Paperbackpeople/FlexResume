<template>
  <div class="container" :class="{ 'show-detail': showDetail }">
    <div class="resume-container">
      <div class="resume" :class="{ 'shifted': showDetail }">
        <h1>{{ $t('resume') }}</h1>
        <div class="language-toggle-container"> 
          <button class="language-toggle" @click="toggleLanguage">
            {{ currentLanguage === 'zh' ? '中文｜En' : 'En｜中文' }}
          </button>
        </div>
        <PersonalInfo />
        <EducationSection @open-education-detail="handleEducationDetailOpen" />
        <ProjectExperience @open-project-detail="handleProjectDetailOpen" />
        <InternshipExperience @open-internship-detail="handleInternshipDetailOpen" />
        <SkillsSection @open-skill-detail="handleSkillDetailOpen" />
      </div>
    </div>

    <!-- 单一详情面板 -->     
    <transition name="slide">
      <div v-if="showDetail" class="detail-panel">
        <button class="close-btn" @click="handleDetailClose">{{ $t('backToOverview') }}</button>
        <div class="detail-content">
          <!-- 教育详情 -->
          <component
            v-if="currentSchool"
            :is="currentSchool.component"
            :school-data="currentSchool"
            @close="handleDetailClose"
          />

          <!-- 项目详情 -->
          <component
            v-else-if="currentProject"
            :is="currentProject.component"
            @close="handleDetailClose"
          />

          <!-- 实习详情 -->
          <component
            v-else-if="currentInternship"
            :is="currentInternship.component"
            @close="handleDetailClose"
          />

          <!-- 技能详情 -->
          <component
            v-else-if="currentSkill"
            :is="currentSkill.component"
            :skill-data="currentSkill"
            @close="handleDetailClose"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

// 引入组件
import PersonalInfo from './components/PersonalInfo/index.vue';
import EducationSection from './components/Education/index.vue';
import Bupt from './components/Education/components/buptSection.vue';
import Nus from './components/Education/components/nusSection.vue';
import ProjectExperience from './components/ProjectExperience/index.vue';
import ProjectOne from './components/ProjectExperience/components/ProjectOne.vue';
import ProjectTwo from './components/ProjectExperience/components/ProjectTwo.vue';
import ProjectThree from './components/ProjectExperience/components/ProjectThree.vue';
import ProjectFour from './components/ProjectExperience/components/ProjectFour.vue';
import InternshipExperience from './components/Internship/index.vue';
import InternshipOne from './components/Internship/components/InternshipOne.vue';
import InternshipTwo from './components/Internship/components/InternshipTwo.vue';
import SkillsSection from './components/Skills/index.vue';

export default {
  name: 'App',
  components: {
    PersonalInfo,
    EducationSection,
    Bupt,
    Nus,
    ProjectExperience,
    ProjectOne,
    ProjectTwo,
    ProjectThree,
    ProjectFour,
    InternshipExperience,
    InternshipOne,
    InternshipTwo,
    SkillsSection,
  },
  setup() {
    // 1. 定义国际化和当前语言
    const { locale } = useI18n();
    const currentLanguage = ref('zh');

    // 2. 定义响应式数据
    const showDetail = ref(false);
    const currentProject = ref(null);
    const currentSchool = ref(null);
    const currentInternship = ref(null);
    const currentSkill = ref(null);

    // 3. 定义获取学校数据的函数
    const getBuptData = (lang) => {
      if (lang === 'zh') {
        return {
          component: 'Bupt',
          name: '北京邮电大学（Queen Mary University of London 合作办学）',
          period: '2019.09-2023.06',
          major: '电子商务及法律',
          GPA: '3.7/4.0',
          honors: '一等荣誉学位',
          ranking: '前20%',
          modules: [
            '数据结构与算法',
            'Java高级编程',
            '数据库',
            '数字电路设计',
            '软件工程',
            '安全与认证',
            '网络协议',
            '信息与隐私保护法'
          ],
          scholarships: [
            { year: '2019-2020', award: '二等奖学金' },
            { year: '2020-2021', award: '二等奖学金' },
            { year: '2021-2022', award: '一等奖学金' }
          ]
        };
      } else {
        return {
          component: 'Bupt',
          name: 'Beijing University of Posts and Telecommunications (Cooperate with Queen Mary University of London)',
          period: '2019.09-2023.06',
          major: 'E-commerce Engineering & Law',
          GPA: '3.7/4.0',
          honors: 'First Class Honours',
          ranking: 'Top 20%',
          modules: [
            'Data Structures and Algorithms',
            'Advanced Java Programming',
            'Database',
            'Digital Circuit Design',
            'Software Engineering',
            'Security and Authentication',
            'Network Protocols',
            'Information and Privacy Law'
          ],
          scholarships: [
            { year: '2019-2020', award: 'Second Class Scholarship' },
            { year: '2020-2021', award: 'Second Class Scholarship' },
            { year: '2021-2022', award: 'First Class Scholarship' }
          ]
        };
      }
    };

    const getNusData = (lang) => {
      if (lang === 'zh') {
        return {
          component: 'Nus',
          name: '新加坡国立大学',
          period: '2024.01-2025.11',
          major: '计算机科学',
          GPA: '4.5/5.0',
          modules: [
            '神经网络和深度学习',
            '分布式系统',
            '分布式数据库',
            '软件工程与应用架构',
            '软件开发',
            '人工智能'
          ]
        };
      } else {
        return {
          component: 'Nus',
          name: 'National University of Singapore',
          period: '2024.01-2025.11',
          major: 'Computer Science',
          GPA: '4.5/5.0',
          modules: [
            'Neural Networks and Deep Learning',
            'Distributed Systems',
            'Distributed Databases',
            'Software Engineering and Application Architecture',
            'Software Development',
            'Artificial Intelligence'
          ]
        };
      }
    };

    // 4. 切换语言
    const toggleLanguage = () => {
      if (locale.value === 'zh') {
        locale.value = 'en';
        currentLanguage.value = 'en';
        // 如果当前正在展示学校详情，则更新
        if (currentSchool.value?.component === 'Bupt') {
          currentSchool.value = getBuptData('en');
        } else if (currentSchool.value?.component === 'Nus') {
          currentSchool.value = getNusData('en');
        }
      } else {
        locale.value = 'zh';
        currentLanguage.value = 'zh';
        // 如果当前正在展示学校详情，则更新
        if (currentSchool.value?.component === 'Bupt') {
          currentSchool.value = getBuptData('zh');
        } else if (currentSchool.value?.component === 'Nus') {
          currentSchool.value = getNusData('zh');
        }
      }
    };

    // 5. 处理教育详情
    const handleEducationDetailOpen = (schoolData) => {
      const lang = currentLanguage.value;
      if (schoolData.component === 'Bupt') {
        schoolData = getBuptData(lang);
      } else if (schoolData.component === 'Nus') {
        schoolData = getNusData(lang);
      }

      if (showDetail.value) {
        handleDetailClose();
        nextTick(() => {
          currentProject.value = null;
          currentSchool.value = schoolData;
          showDetail.value = true;
        });
      } else {
        currentProject.value = null;
        currentSchool.value = schoolData;
        showDetail.value = true;
      }
    };

    // 6. 处理项目详情
    const handleProjectDetailOpen = (selectedProject) => {
      if (showDetail.value) {
        handleDetailClose();
        nextTick(() => {
          currentSchool.value = null;
          currentProject.value = selectedProject;
          showDetail.value = true;
        });
      } else {
        currentSchool.value = null;
        currentProject.value = selectedProject;
        showDetail.value = true;
      }
    };

    // 7. 处理实习详情
    const handleInternshipDetailOpen = (internship) => {
      if (showDetail.value) {
        handleDetailClose();
        nextTick(() => {
          currentProject.value = null;
          currentInternship.value = internship;
          showDetail.value = true;
        });
      } else {
        currentProject.value = null;
        currentInternship.value = internship;
        showDetail.value = true;
      }
    };

    // 8. 处理技能详情
    const handleSkillDetailOpen = (skill) => {
      if (showDetail.value) {
        handleDetailClose();
        nextTick(() => {
          currentProject.value = null;
          currentSchool.value = null;
          currentInternship.value = null;
          currentSkill.value = skill;
          showDetail.value = true;
        });
      } else {
        currentProject.value = null;
        currentSchool.value = null;
        currentInternship.value = null;
        currentSkill.value = skill;
        showDetail.value = true;
      }
    };

    // 9. 关闭详情面板
    const handleDetailClose = () => {
      showDetail.value = false;
      currentProject.value = null;
      currentSchool.value = null;
      currentInternship.value = null;
      currentSkill.value = null;
    };

    return {
      currentLanguage,
      toggleLanguage,

      showDetail,
      currentProject,
      currentSchool,
      currentInternship,
      currentSkill,

      handleEducationDetailOpen,
      handleProjectDetailOpen,
      handleInternshipDetailOpen,
      handleSkillDetailOpen,
      handleDetailClose,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  min-height: 100vh;
}

/* PC端(大屏)布局：left resume + right detail */
.resume-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  padding: 20px;
  overflow-y: auto;
  background: #fff;
}

.resume {
  transition: all 0.5s ease;
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.resume.shifted {
  transform: translateX(-60%);
  max-width: 40%;
}

/* 右侧详情面板 */
.detail-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 50%;
  height: 100vh;
  background: #fff;
  padding: 20px;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  box-sizing: border-box;
  border: 1px solid #ccc;
}

/* 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  border: none;
  background: linear-gradient(90deg, #42b983, #2e5b87);
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.close-btn:hover {
  background: linear-gradient(90deg, #2e5b87, #42b983);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}
.close-btn:active {
  transform: translateY(1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

/* 各区块 */
.section {
  margin-bottom: 30px;
}
h1 {
  color: #2c3e50;
  text-align: center; 
  font-size: 2rem;
}
h2,
h3 {
  color: #2c3e50;
}
.detail-content {
  padding: 40px 20px;
}

/* 视频容器 */
.video-container {
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.project-video {
  width: 100%;
  max-width: 100%;
  display: block;
}

/* 优化滚动条样式 */
.resume-container::-webkit-scrollbar,
.detail-panel::-webkit-scrollbar {
  width: 6px;
}
.resume-container::-webkit-scrollbar-thumb,
.detail-panel::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}
.resume-container::-webkit-scrollbar-track,
.detail-panel::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* 语言切换按钮 */
.language-toggle {
  background: linear-gradient(90deg, #8a96ab, #545670);
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.3s ease;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.language-toggle:hover {
  background: linear-gradient(90deg, #6b6d8e, #57637d);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}
.language-toggle-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

/* ============== 响应式：小屏幕(手机)适配 ============== */
@media (max-width: 768px) {
  /* 让简历保持原位置或根据需求隐藏，这里示例保留简历容器 */
  .resume-container {
    position: static;
    width: 100%;
    height: auto;
    padding: 10px;
    margin-bottom: 20px;
    box-shadow: none;
  }

  .resume {
    max-width: 100%;
    margin: 0 auto;
    transform: none;
    box-shadow: none;
    border-radius: 0;
  }
  .resume.shifted {
    /* 如果想在手机端不让 resume 左移，可以去掉 transform */
    transform: none;
    max-width: 100%;
  }

  /* -------- 让详情面板覆盖全屏 -------- */
  .detail-panel {
    /* 保持固定定位，覆盖整个屏幕 */
    position: fixed; 
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;

    margin: 0;            /* 去除任何外边距 */
    box-shadow: none;     /* 去掉阴影 */
    border: none;         /* 去掉边框 */
    background: #fff;     /* 确保背景白色，覆盖下方内容 */
    z-index: 999;         /* 保证面板在最上层 */
    overflow-y: auto;     /* 如果内容超出，允许在面板里滚动 */
    padding: 20px;        /* 你想要的内边距 */
  }

  /* 让关闭按钮在顶部可见 */
  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  /* 根据需要，你也可以把它居中或做成固定顶部导航的样式 */
  /* 动画效果：从右侧滑入 */
  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(100%); /* 初始或最终在屏幕右侧之外 */
    opacity: 0;
  }
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
  }

  /* 字体可适当变小一点 */
  h1 {
    font-size: 2rem;
  }
  h2 {
    font-size: 1rem;
  }
  h3 {
    font-size: 0.9rem;
  }
}

</style>
