<template>
  <div class="education-detail">
    <div class="detail-content">
      <h2>{{ schoolData.name }}</h2>
      <div class="detail-info">
        <div class="degree-info">
          <p class="major">
            <span class="highlight">{{ schoolData.major }}</span>&nbsp;
            <span class="period">{{ schoolData.period }}</span>
          </p>
          <p class="honors">
            <span>{{ schoolData.honors }}</span>&nbsp;
            <span class="GPA">GPA: {{ schoolData.GPA || 'GPA' }}{{ schoolData.ranking }}</span>&nbsp;
          </p>
        </div>
        
        <div class="modules">
          <h3>{{ $t('modules') }}</h3>
          <ul>
            <li v-for="(module, index) in schoolData.modules" :key="index">
              {{ module }}
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    schoolData: {
      type: Object,
      required: true,
    }
  }
};
</script>

<style scoped>
.education-detail {
  padding: 20px;
}

.detail-content {
  padding: 20px;
}

.period {
  color: #666;
  font-size: 1.1em;
  margin-bottom: 10px;
  text-align: right;
}

.degree-info {
  margin: 15px 0;
}

.major {
  font-size: 1.2em;
  color: #2c3e50;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}

.honors {
  color: #666;
}

.highlight {
  color: #2e5b87;
  font-weight: bold;
  margin-right: 15px;
}

.ranking {
  color: #666;
}

h3 {
  color: #2c3e50;
  margin: 20px 0 10px;
  font-size: 1.1em;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 8px 0;
  color: #666;
}

.scholarship-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px dashed #eee;
}

.year {
  color: #666;
}

.award {
  color: #42b983;
  font-weight: 500;
}

.modules ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

.modules li {
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.modules li:hover {
  background: #e9ecef;
  transform: translateX(5px);
}
</style>