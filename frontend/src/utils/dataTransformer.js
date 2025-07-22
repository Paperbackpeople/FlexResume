// 数据转换工具函数

// 转换项目数据
export const transformProjectData = (projectData) => {
  if (!projectData || !projectData.projectData) {
    return null;
  }
  return projectData.projectData; // 只返回真正的项目数据对象
};

// 转换教育数据
export const transformEducationData = (educationData) => {
  if (!educationData || !educationData.education) {
    return null;
  }

  return educationData;
};

// 转换个人信息数据
export const transformPersonalInfoData = (personalInfoData) => {
  if (!personalInfoData) {
    return null;
  }

  return personalInfoData;
};

// 转换技能数据
export const transformSkillData = (skillData) => {
  if (!skillData || !skillData.content) {
    return null;
  }

  return skillData; // 直接返回原始数据，让组件处理
}; 