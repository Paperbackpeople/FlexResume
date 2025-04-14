<template>
  <div class="internship-detail">
    <h2>Dolby ({{ $t('BeiJing') }})</h2>
    <div class="time-location">
      <span>2023.07-2024.01</span>
      <span>{{ $t('BeiJing') }}</span>
    </div>
    
    <div class="content">
      <h3>{{ $t('workDetail') }}</h3>
      <ul>
        <li>{{ $t('detailSix') }}</li>
        <li>{{ $t('detailSeven') }}</li>
        <li>{{ $t('detailEight') }}</li>
        <li>{{ $t('detailNine') }}</li>
        <li>{{ $t('detailTen') }}</li>
      </ul>
      <p class="conclusion-text">{{ $t('augmented') }}</p>
      <!-- 在此处添加图片 -->
      <img src="https://www.wangzhaoyu.com/videos/dolby.jpg" alt="数据监控示例视频截图" class="example-image">
      <!-- 图片添加结束 -->
      <h3>{{ $t('techStack') }}</h3>
      <ul>
        <li>Python</li>
        <li>CycleGAN、Stable Diffusion</li>
        <li>Flask、Vue、MySQL</li>
        <li>Linux</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InternshipTwo',
};
</script>

<style scoped>
.internship-detail {
  padding: 20px;
}

.time-location {
  color: #666;
  margin: 10px 0 20px;
}

.time-location span {
  margin-right: 20px;
}

.content {
  margin-top: 20px;
}

h3 {
  color: #2e5b87;
  margin: 20px 0 10px;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
}

li {
  margin: 8px 0;
  color: #333;
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

.example-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: block;
  margin: 10px auto;
}
</style>
