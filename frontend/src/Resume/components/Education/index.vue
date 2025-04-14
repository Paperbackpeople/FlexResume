<template>
  <section class="education-section">
    <h2 class="section-title">{{ $t('education') }}</h2>
    <div class="education-list">
      <div 
        v-for="(edu, index) in educationList" 
        :key="index" 
        class="education-item"
        @click="openDetailPanel(index)"
      >
        <!-- 左侧容器，包含 时间 + 校徽 -->
        <div class="edu-left">
          <div class="edu-period">{{ edu.period }}</div>
          <div class="edu-logo">
            <img 
              :src="edu.logo" 
              alt="school logo"
              class="school-logo"
            />
          </div>
        </div>

        <!-- 右侧文字内容区 -->
        <div class="edu-content">
          <h3 class="school-name">{{ edu.school }}</h3>
          <p class="major">{{ $t('major') }}: {{ edu.major }}</p>
          <p class="degree">{{ $t('degree') }}: {{ edu.degree }}</p>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import { useI18n } from 'vue-i18n'
import { ref, watch} from 'vue'

export default {
  name: 'EducationSection',
  setup() {
    const { t, messages, locale } = useI18n()
    const educationList = ref(messages.value[locale.value].educationList)
    
    // 监听语言变化
    watch(locale, (newLocale) => {
      educationList.value = messages.value[newLocale].educationList
    })

    return {
      t,
      educationList
    }
  },
  methods: {
    openDetailPanel(index) {
      const selectedSchool = this.educationList[index];
      this.$emit('open-education-detail', selectedSchool);
    }
  }
}
</script>

<style scoped>
.education-section {
  margin-bottom: 30px;
}
.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #2e5b87;
}

/* 父容器：包含左侧(时间+校徽) 和 右侧(文字) */
.education-item {
  display: flex;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

/* hover 效果 */
.education-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 左侧容器：垂直排列时间和校徽 */
.edu-left {
  display: flex;
  flex-direction: column; /* 垂直排列子元素 */
  align-items: center;    /* 居中对齐 */
  min-width: 120px;       /* 根据需求调整宽度 */
  margin-right: 20px;     /* 分隔右侧内容 */
}

/* 时间区块 */
.edu-period {
  font-weight: bold;
  margin-bottom: 10px; /* 与图标的间距 */
  text-align: center;  /* 居中对齐 */
}

/* 校徽图片本身：限制大小、避免变形 */
.school-logo {
  width: 60px;         /* 固定宽度 */
  height: 60px;        /* 固定高度 */
  object-fit: contain; /* 保持图片比例 */
  border-radius: 4px;  /* 圆角 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}


/* 右侧文字内容 */
.edu-content {
  flex: 1; /* 撑满剩余空间 */
}

.school-name {
  font-size: 18px;
  margin: 0 0 10px 0;
}

.major, .degree {
  margin: 5px 0;
  color: #666;
}
</style>
