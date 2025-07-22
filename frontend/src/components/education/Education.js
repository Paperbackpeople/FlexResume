import React, {useState, useRef, useEffect} from 'react';
import './Education.css';

const Education = ({ index, isLast, addEducation, removeEducation, onChange, initialData }) => {
    const [educationInfo, setEducationInfo] = useState(
        initialData || {
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
        logo: '',
    }
    );

    useEffect(() => {
        if (initialData) {
            setEducationInfo(initialData);
        }
    }, [initialData]);

    const fileInputRef = useRef(null);
    // ---------------------------
    // 每次状态变动，都回调给父组件
    // ---------------------------
    const updateParent = (newState) => {
        setEducationInfo(newState);
        // 构建形如 { education1: {...} } 的方式传递
        if (onChange) onChange(`education${index + 1}`, newState);
    };

    // 更新基础信息
    const handleInputChange = (key, value) => {
        const newState = { ...educationInfo, [key]: value };
        updateParent(newState);
    };

    // 课程
    const handleCourseChange = (cIndex, key, value) => {
        const updatedCourses = [...educationInfo.courses];
        updatedCourses[cIndex][key] = value;
        updateParent({ ...educationInfo, courses: updatedCourses });
    };

    const addCourse = () => {
        const updatedCourses = [...educationInfo.courses, { name: '' }];
        updateParent({ ...educationInfo, courses: updatedCourses });
    };

    const removeCourse = (cIndex) => {
        if (educationInfo.courses.length === 1) return;
        const updatedCourses = educationInfo.courses.filter((_, i) => i !== cIndex);
        updateParent({ ...educationInfo, courses: updatedCourses });
    };

    // 奖项
    const handleAwardChange = (aIndex, key, value) => {
        const updatedAwards = [...educationInfo.awards];
        updatedAwards[aIndex][key] = value;
        updateParent({ ...educationInfo, awards: updatedAwards });
    };

    const addAward = () => {
        const updatedAwards = [...educationInfo.awards, { time: '', name: '' }];
        updateParent({ ...educationInfo, awards: updatedAwards });
    };

    const removeAward = (aIndex) => {
        if (educationInfo.awards.length === 1) return;
        const updatedAwards = educationInfo.awards.filter((_, i) => i !== aIndex);
        updateParent({ ...educationInfo, awards: updatedAwards });
    };

    // 上传校徽
    const handleLogoUpload = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            updateParent({ ...educationInfo, logo: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="education-container">
            <div className="education-section">
                <div className="section-header">
                    <h2 className="left-align">Education {index + 1}</h2>
                    <div className="button-group">
                        <button className="remove-newButton" onClick={removeEducation}>
                            -
                        </button>
                        {isLast && (
                            <button className="add-newButton" onClick={addEducation}>
                                +
                            </button>
                        )}
                    </div>
                </div>

                <div className="info-container">
                    <div className="text-info">
                        <div className="text-photo-container">
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
                                        value={educationInfo.location}
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
                                        value={educationInfo.startDate}
                                        placeholder="Start Date"
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                        className="info-input"
                                    />
                                    -
                                    <input
                                        type="date"
                                        value={educationInfo.graduationYear}
                                        placeholder="Graduation Year"
                                        onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                                        className="info-input"
                                    />
                                </div>

                                <div className="input-row">
                                    <input
                                        type="text"
                                        value={educationInfo.honours}
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
                                    {educationInfo.logo ? (
                                        <img
                                            src={educationInfo.logo}
                                            alt="Uploaded"
                                            className="logo-preview"
                                            style={{ maxWidth: 100, maxHeight: 100, width: 'auto', height: 'auto', objectFit: 'contain' }}
                                        />
                                    ) : (
                                        <div className="logo-placeholder">上传校徽</div>
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
                        <h3 className="left-align">Courses</h3>
                        {educationInfo.courses.map((item, cIndex) => (
                            <div key={cIndex} className="course-award-row">
                                <input
                                    type="text"
                                    value={item.name}
                                    placeholder="Course Name"
                                    onChange={(e) => handleCourseChange(cIndex, 'name', e.target.value)}
                                    className="info-input"
                                />
                                {/* 只有最后一行有加号 */}
                                {cIndex === educationInfo.courses.length - 1 && (
                                <button onClick={addCourse} className="add-button">
                                    +
                                </button>
                                )}
                                <button onClick={() => removeCourse(cIndex)} className="remove-button">
                                    -
                                </button>
                            </div>
                        ))}

                        {/* 动态添加奖项 */}
                        <h3 className="left-align">Awards</h3>
                        {educationInfo.awards.map((aw, aIndex) => (
                            <div key={aIndex} className="course-award-row">
                                <input
                                    type="text"
                                    value={aw.time}
                                    placeholder="Time (e.g., 2022)"
                                    onChange={(e) => handleAwardChange(aIndex, 'time', e.target.value)}
                                    className="info-input"
                                />
                                <input
                                    type="text"
                                    value={aw.name}
                                    placeholder="Award Name"
                                    onChange={(e) => handleAwardChange(aIndex, 'name', e.target.value)}
                                    className="info-input"
                                />
                                {/* 只有最后一行有加号 */}
                                {aIndex === educationInfo.awards.length - 1 && (
                                <button onClick={addAward} className="add-button">
                                    +
                                </button>
                                )}
                                <button
                                    onClick={() => removeAward(aIndex)}
                                    className="remove-button"
                                >
                                    -
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Education;