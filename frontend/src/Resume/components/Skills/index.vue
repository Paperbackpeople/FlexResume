<template>
  <section class="skills-section">
    <h2 class="section-title">{{ t('skills') }}</h2>
    <div class="skills-container">
      <ul>
        <li v-for="(skill, index) in skillsList" :key="index" class="skill-item">
          <strong>{{ skill.category }}</strong>: {{ skill.brief }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ref, watch} from 'vue'

export default {
  name: 'SkillsSection',
  setup() {
    const { t, messages, locale } = useI18n()
    const skillsList = ref(messages.value[locale.value].skillsList)
    
    // 监听语言变化
    watch(locale, (newLocale) => {
      skillsList.value = messages.value[newLocale].skillsList
    })
  
    return {
      t,
      skillsList
    }
  }
}
</script>

<style scoped>
.skills-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #2e5b87;
}

.skills-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #ccc;
}

.skill-item {
  margin: 10px 0;
  color: #666;
  position: relative;
  padding-left: 20px;
}

.skill-item::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #2e5b87;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

strong {
  color: #2e5b87;
  margin-right: 5px;
}
</style>
