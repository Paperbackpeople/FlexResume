import React from 'react';
import './PersonalInfoView.css';

const PersonalInfoView = ({ data }) => {
    if (!data) return null;

    return (
        <div className="personal-info-section">
            <h2>Personal Information</h2>
            <div className="info-container">
                <div className="text-info">
                    {data.fields.map((field, index) => (
                        <p key={index}>
                            <strong>{field.label}:</strong> {field.value}
                        </p>
                    ))}
                </div>
                {data.profilePhoto && (
                    <img 
                        className="profile-photo" 
                        src={data.profilePhoto} 
                        alt="Profile" 
                    />
                )}
            </div>
        </div>
    );
};

export default PersonalInfoView; 