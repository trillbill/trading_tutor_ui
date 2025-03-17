// trading_tutor_ui/src/components/ProgressBar.js
import React from 'react';
import './ProgressBar.css'; // Import CSS for styling

const ProgressBar = ({ currentQuestionIndex, totalQuestions }) => {
    const progressPercentage = ((currentQuestionIndex) / totalQuestions) * 100;

    return (
        <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
            <div className="progress-text">
                Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
        </div>
    );
};

export default ProgressBar;