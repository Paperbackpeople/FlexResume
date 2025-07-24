import {
  transformPersonalInfoData,
  transformEducationData,
  transformProjectData,
  transformSkillData
} from './dataTransformer';

const API_BASE_URL = '/api';

// 检查用户是否已登录
function isLoggedIn() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  return !!(token && userId);
}

// 获取token的工具函数
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// 获取个人信息
export const fetchPersonalInfo = async (username, version) => {
  if (!isLoggedIn()) {
    console.log('用户未登录，跳过个人信息获取');
    return null;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/personal-info/${username}/${version}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.log('No personal info found for user:', username, 'version:', version);
        return null;
      }
      throw new Error('Failed to fetch personal info');
    }
    const data = await response.json();
    return transformPersonalInfoData(data);
  } catch (error) {
    console.error('Error fetching personal info:', error);
    return null;
  }
};

// 获取教育信息
export const fetchEducationInfo = async (username, version) => {
  if (!isLoggedIn()) {
    console.log('用户未登录，跳过教育信息获取');
    return null;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/education-info?username=${username}&version=${version}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.log('No education data found for user:', username, 'version:', version);
        return null;
      }
      throw new Error('Failed to fetch education info');
    }
    const data = await response.json();
    return transformEducationData(data);
  } catch (error) {
    console.error('Error fetching education info:', error);
    return null;
  }
};

// 获取项目信息
export const fetchProjectInfo = async (username, version) => {
  if (!isLoggedIn()) {
    console.log('用户未登录，跳过项目信息获取');
    return null;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/project-info?username=${username}&version=${version}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.log('No project data found for user:', username, 'version:', version);
        return null;
      }
      throw new Error('Failed to fetch project info');
    }
    const text = await response.text();
    if (!text) {
      console.log('Empty response for project info');
      return null;
    }
    const data = JSON.parse(text);
    return transformProjectData(data);
  } catch (error) {
    console.error('Error fetching project info:', error);
    return null;
  }
};

// 获取技能信息
export const fetchSkillInfo = async (username, version) => {
  if (!isLoggedIn()) {
    console.log('用户未登录，跳过技能信息获取');
    return null;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/skill/${username}/${version}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.log('No skill data found for user:', username, 'version:', version);
        return null;
      }
      throw new Error('Failed to fetch skill info');
    }
    const text = await response.text();
    if (!text) {
      console.log('Empty response for skill info');
      return null;
    }
    const data = JSON.parse(text);
    return transformSkillData(data);
  } catch (error) {
    console.error('Error fetching skill info:', error);
    return null;
  }
};

// 获取工作与实习信息
export const fetchWorkInternshipInfo = async (username, version) => {
  if (!isLoggedIn()) {
    console.log('用户未登录，跳过工作与实习信息获取');
    return null;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/workinternship-info?username=${username}&version=${version}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.log('No workinternship data found for user:', username, 'version:', version);
        return null;
      }
      throw new Error('Failed to fetch workinternship info');
    }
    const text = await response.text();
    if (!text) {
      console.log('Empty response for workinternship info');
      return null;
    }
    const data = JSON.parse(text);
    if (data && data.workInternshipData) {
      return data.workInternshipData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching workinternship info:', error);
    return null;
  }
};

// 批量保存所有数据到Redis缓存
export const saveAllDataToCache = async (resumeData, username, version) => {
  if (!isLoggedIn()) {
    console.log('用户未登录，跳过数据保存');
    return false;
  }

  const savePromises = [];

  try {
    // 保存个人信息
    if (resumeData.personalInfo) {
      const personalInfoData = {
        username,
        version,
        profilePhoto: resumeData.personalInfo.profilePhoto || '',
        fields: resumeData.personalInfo.fields || [{ label: '名字', value: '名字' }]
      };
      savePromises.push(
        fetch(`${API_BASE_URL}/personal-info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify(personalInfoData),
        })
      );
    }

    // 保存教育信息
    if (resumeData.education) {
      const educationData = {
        username,
        version,
        education: resumeData.education.education || resumeData.education || {}
      };
      savePromises.push(
        fetch(`${API_BASE_URL}/education-info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify(educationData),
        })
      );
    }

    // 保存项目信息
    if (resumeData.projects) {
      const projectData = {
        username,
        version,
        projectData: resumeData.projects || []
      };
      savePromises.push(
        fetch(`${API_BASE_URL}/project-info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify(projectData),
        })
      );
    }

    // 保存工作与实习信息
    if (resumeData.workinternship) {
      const workInternshipData = {
        username,
        version,
        workInternshipData: resumeData.workinternship || []
      };
      savePromises.push(
        fetch(`${API_BASE_URL}/workinternship-info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify(workInternshipData),
        })
      );
    }

    // 保存技能信息
    if (resumeData.skills) {
      const skillData = {
        username,
        version,
        content: resumeData.skills.content || ''
      };
      savePromises.push(
        fetch(`${API_BASE_URL}/skill`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify(skillData),
        })
      );
    }

    // 并行执行所有保存操作
    const results = await Promise.allSettled(savePromises);
    
    // 检查结果
    const failedRequests = results.filter(result => result.status === 'rejected');
    if (failedRequests.length > 0) {
      console.error('部分数据保存失败:', failedRequests);
      return false;
    }

    return true;
  } catch (error) {
    console.error('批量保存数据失败:', error);
    return false;
  }
}; 