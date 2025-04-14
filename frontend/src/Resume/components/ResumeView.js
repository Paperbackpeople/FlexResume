import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PersonalInfoView from './PersonalInfo/PersonalInfoView';
import EducationView from './Education/EducationView';
import ProjectView from './ProjectExperience/ProjectView';
import InternshipView from './Internship/InternshipView';
import WorkExperienceView from './WorkExperience/WorkExperienceView';
import SkillView from './Skill/SkillView';

const ResumeView = () => {
    const { username, version } = useParams();
    const [data, setData] = useState({
        personalInfo: null,
        education: null,
        projects: null,
        internships: null,
        workExperience: null,
        skills: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResumeData = async () => {
            try {
                const [
                    personalInfoRes,
                    educationRes,
                    projectRes,
                    internshipRes,
                    workExperienceRes,
                    skillRes
                ] = await Promise.all([
                    axios.get(`/api/personal-info/${username}/${version}`),
                    axios.get(`/api/education-info/${username}/${version}`),
                    axios.get(`/api/project-info/${username}/${version}`),
                    axios.get(`/api/internship-info/${username}/${version}`),
                    axios.get(`/api/workexperience-info/${username}/${version}`),
                    axios.get(`/api/skill-info/${username}/${version}`)
                ]);

                setData({
                    personalInfo: personalInfoRes.data,
                    education: educationRes.data,
                    projects: projectRes.data,
                    internships: internshipRes.data,
                    workExperience: workExperienceRes.data,
                    skills: skillRes.data
                });
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchResumeData();
    }, [username, version]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="resume-container">
            <PersonalInfoView data={data.personalInfo} />
            <EducationView data={data.education} />
            <ProjectView data={data.projects} />
            <InternshipView data={data.internships} />
            <WorkExperienceView data={data.workExperience} />
            <SkillView data={data.skills} />
        </div>
    );
};

export default ResumeView; 