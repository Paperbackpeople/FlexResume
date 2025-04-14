<template>
  <section class="project-experience-section">
    <h2 class="section-title">{{ $t('projectExperience') }}</h2>
    <div class="project-list">
      <div 
        v-for="(project, index) in projects" 
        :key="index" 
        class="project-item"
        :class="{ 'disabled': !project.clickable }"
        @click="project.clickable && openProject(index)">
        <div class="project-header">
          <h3>{{ project.name }}</h3>
          <span class="project-time" v-if="project.time">{{ project.time }}</span>
        </div>
        <p class="brief">{{ project.brief }}</p>
      </div>
    </div>
  </section>
</template>
<script>
import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'ProjectExperience',
  setup(props, { emit }) {
    const { t, messages, locale } = useI18n();
    const projects = ref(messages.value[locale.value].projects);

    // 监听语言变化
    watch(locale, (newLocale) => {
      projects.value = messages.value[newLocale].projects;
    });

    const openProject = (index) => {
      const selectedProject = projects.value[index];
      emit('open-project-detail', selectedProject);
    };

    return {
      t,
      projects,
      openProject,
    };
  },
});
</script>

<style scoped>
.project-experience-section {
  margin-bottom: 30px;
}

.project-experience-section h2 {
  color: #2e5b87;
}

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.project-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #ccc;
  cursor: pointer;
}

.project-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.brief {
  margin: 5px 0;
  color: #666;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.project-time {
  color: #666;
  font-size: 18px;
  font-weight: bold;
  text-align: right;
}
</style>