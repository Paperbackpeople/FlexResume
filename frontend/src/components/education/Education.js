import React, { useState, useRef } from 'react';
import './Education.css';
import axios from 'axios';

const Education = ({ index, isLast, addEducation, removeEducation }) => {
    const [educationInfo, setEducationInfo] = useState({
        school: '',
        degree: '',
        location: '',
        fieldOfStudy: '',
        startDate: '',
        graduationYear: '',
        honours: '',
        gpa: '',
        courses: [{ name: '' }],
        awards: [{ time: '', name: '' }],
    });

    const [logo, setLogo] = useState(null);
    const fileInputRef = useRef(null);

    // 更新基础信息
    const handleInputChange = (key, value) => {
        setEducationInfo((prev) => ({ ...prev, [key]: value }));
    };

    // 更新课程信息
    const handleCourseChange = (index, key, value) => {
        const updatedCourses = [...educationInfo.courses];
        updatedCourses[index][key] = value;
        setEducationInfo((prev) => ({
            ...prev,
            courses: updatedCourses,
        }));
    };

    // 更新奖项信息
    const handleAwardChange = (index, key, value) => {
        const updatedAwards = [...educationInfo.awards];
        updatedAwards[index][key] = value;
        setEducationInfo((prev) => ({
            ...prev,
            awards: updatedAwards,
        }));
    };

    // 添加课程
    const addCourse = () => {
        setEducationInfo((prev) => ({
            ...prev,
            courses: [...prev.courses, { name: '' }],
        }));
    };

    // 添加奖项
    const addAward = () => {
        setEducationInfo((prev) => ({
            ...prev,
            awards: [...prev.awards, { time: '', name: '' }],
        }));
    };

    // 删除课程
    const removeCourse = (index) => {
        if (educationInfo.courses.length === 1) return; // 至少保留一项
        const updatedCourses = educationInfo.courses.filter((_, i) => i !== index);
        setEducationInfo((prev) => ({
            ...prev,
            courses: updatedCourses,
        }));
    };

    // 删除奖项
    const removeAward = (index) => {
        if (educationInfo.awards.length === 1) return; // 至少保留一项
        const updatedAwards = educationInfo.awards.filter((_, i) => i !== index);
        setEducationInfo((prev) => ({
            ...prev,
            awards: updatedAwards,
        }));
    };

    // 上传校徽图片
    const handleLogoUpload = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            setLogo(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    // 保存数据到后端
    const saveEducationInfo = async () => {
        try {
            const response = await axios.post('/api/education-info', educationInfo);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='education-container'>
            <div className="education-section">
                <div className="section-header">
                    <h2 className="left-align">Education {index}</h2>
                    <div className="button-group">
                        <button className="remove-newButton" onClick={removeEducation}>-</button>
                        {isLast && <button className="add-newButton" onClick={addEducation}>+</button>}
                    </div>
                </div>
                <div className="info-container">
                    {/* 左侧信息 */}
                    <div className="text-info">
                        <div className="text-photo-container">
                            {/* 固定输入框 */}
                            <div className="text-container">
                                <div className="input-row">
                                    <input
                                        type="text"
                                        value={educationInfo.school}
                                        placeholder="School Name"
                                        onChange={(e) => handleInputChange('school', e.target.value)}
                                        className="info-input"
                                    />
                                    <input
                                        type="text"
                                        value={educationInfo.degree}
                                        placeholder="Location"
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        className="info-input"
                                    />


                                </div>
                                <div className="input-row">
                                    <input
                                        type="text"
                                        value={educationInfo.degree}
                                        placeholder="Degree"
                                        onChange={(e) => handleInputChange('degree', e.target.value)}
                                        className="info-input"
                                    />
                                    <input
                                        type="text"
                                        value={educationInfo.fieldOfStudy}
                                        placeholder="Field of Study"
                                        onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                                        className="info-input"
                                    />

                                </div>
                                <div className="input-row">
                                    <input
                                        type="date"
                                        value={educationInfo.graduationYear}
                                        //入学时间
                                        placeholder="Start Date"
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                        className="info-input"
                                    />
                                    -
                                    <input
                                        type="date"ß
                                        value={educationInfo.graduationYear}
                                        placeholder="Graduation Year"
                                        onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                                        className="info-input"
                                    />
                                </div>
                                <div className="input-row">
                                    <input
                                        type="text"
                                        value={educationInfo.location}
                                        placeholder="Honours"
                                        onChange={(e) => handleInputChange('honours', e.target.value)}
                                        className="info-input"
                                    />
                                    <input
                                        type="text"
                                        value={educationInfo.gpa}
                                        placeholder="GPA"
                                        onChange={(e) => handleInputChange('gpa', e.target.value)}
                                        className="info-input"
                                    />
                                </div>
                            </div>

                            {/* 右侧校徽 */}
                            <div className="logo-container">
                                <div
                                    className="school-logo"
                                    onClick={openFilePicker}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {logo ? (
                                        <img src={logo} alt="Uploaded" className="logo-preview" />
                                    ) : (
                                        <div className="logo-placeholder">Click to Upload</div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={(e) => handleLogoUpload(e.target.files[0])}
                                    className="logo-upload"
                                />
                            </div>
                        </div>
                        {/* 动态添加课程 */}
                        <h3 className='left-align'>Courses</h3>
                        {educationInfo.courses.map((item, index) => (
                            <div key={index} className="course-award-row">
                                <input
                                    type="text"
                                    value={item.name}
                                    placeholder="Course Name"
                                    onChange={(e) => handleCourseChange(index, 'name', e.target.value)}
                                    className="info-input"
                                />
                                <button onClick={addCourse} className="add-button">+</button>
                                <button onClick={() => removeCourse(index)} className="remove-button">-</button>
                            </div>
                        ))}

                        {/* 动态添加奖项 */}
                        <h3 className="left-align">Awards</h3>
                        {educationInfo.awards.map((item, index) => (
                            <div key={index} className="course-award-row">
                                <input
                                    type="text"
                                    value={item.time}
                                    placeholder="Time (e.g., 2022)"
                                    onChange={(e) => handleAwardChange(index, 'time', e.target.value)}
                                    className="info-input"
                                />
                                <input
                                    type="text"
                                    value={item.name}
                                    placeholder="Award Name"
                                    onChange={(e) => handleAwardChange(index, 'name', e.target.value)}
                                    className="info-input"
                                />
                                <button onClick={addAward} className="add-button">+</button>
                                <button onClick={() => removeAward(index)} className="remove-button">-</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Education;