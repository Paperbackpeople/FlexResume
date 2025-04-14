<template>
  <section class="internship-section">
    <h2 class="section-title">{{ $t('internshipExperience') }}</h2>
    <div class="internship-list">
      <div
        v-for="(internship, index) in internships"
        :key="index"
        class="internship-item"
        :class="{ 'clickable': internship.clickable }"
        v-on="internship.clickable ? { click: () => openInternship(index) } : {}"
      >
        <div class="internship-header">
          <h3>
            <template v-if="internship.link">
              <a
                :href="internship.link"
                target="_blank"
                rel="noopener noreferrer"
                class="internship-link"
              >
                {{ internship.name }}
              </a>
            </template>
            <template v-else>
              {{ internship.name }}
            </template>
          </h3>
          <span class="internship-time" v-if="internship.time">{{ internship.time }}</span>
        </div>
        <p class="brief">{{ internship.brief }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'InternshipExperience',
  setup(props, { emit }) {
    const { t, messages, locale } = useI18n();
    const internships = ref(messages.value[locale.value].internships);

    // 监听语言变化
    watch(locale, (newLocale) => {
      internships.value = messages.value[newLocale].internships;
    });

    const openInternship = (index) => {
      const selectedInternship = internships.value[index];
      emit('open-internship-detail', selectedInternship);
    };

    return {
      t,
      internships,
      openInternship,
    };
  },
});
</script>

<style scoped>
.internship-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #ccc;
  background-color: white; /* 统一背景色 */
  cursor: pointer; /* 鼠标指针默认设为可点击 */
}

.internship-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 悬浮效果 */
}

/* 链接样式 */
.internship-link {
  color: #2e5b87;
  text-decoration: none;
  font-weight: bold;
}

.internship-link:hover {
  text-decoration: underline;
}

/* 禁用状态的样式（仅改变鼠标指针，不影响悬浮效果） */
.internship-item:not(.clickable) {
  cursor: not-allowed;
}

/* 其他样式 */
.brief {
  margin: 5px 0;
  color: #666;
}

.internship-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.internship-time {
  color: #666;
  font-size: 18px;
  font-weight: bold;
  text-align: right;
}

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #2e5b87;
}

</style>
