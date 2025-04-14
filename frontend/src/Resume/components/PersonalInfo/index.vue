<template>
  <div class="section">
    <h2>{{ $t('personalInfo') }}</h2>
    <div class="info-container">
      <div class="text-info">
        <p>{{ $t('name') }}</p>
        <p>{{ $t('emailPrefix') }}e1326002@u.nus.edu</p>
        <p>{{ $t('phone') }}</p>
        <p>{{ $t('zhengzhi') }}</p>
        <p>{{ $t('age') }}</p>
      </div>
      <img class="profile-photo" src="profile.jpg" alt="个人照片" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalInfo',
};
</script>

<style scoped>
.section {
  margin-bottom: 30px;
}

.section h2 {
  color: #2e5b87;
}

.info-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.text-info {
  flex: 1;
}

.profile-photo {
  width: 130px;
  height: 180px;
  object-fit: cover;
  margin-left: 50px;
  border: 1px solid #ccc;
}
</style>