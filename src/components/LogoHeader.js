import React from 'react';
import './LogoHeader.css'; // Ensure you have a CSS file for styling

const LogoHeader = () => {
    return (
        <header className="header">
            <div className="logo-container">
                <img src="/assets/IconOnly_NoBuffer.png" alt="Icon Logo" className="logo-icon" />
                <img src="/assets/TextOnly_NoBuffer.png" alt="Text Logo" className="logo-text" />
            </div>
        </header>
    );
};

export default LogoHeader;
