// trading_tutor_ui/src/components/ReviewResultsModal.js
import React from 'react';
import './ReviewResultsModal.css'; // Create a CSS file for styling

const ReviewResultsModal = ({ isOpen, onClose, incorrectAnswers }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content">
                {/* <h2>Review</h2> */}
                {incorrectAnswers.length > 0 ? (
                    <ul className="incorrect-answers-list">
                        {incorrectAnswers.map((item, index) => (
                            <li key={index}>
                                <div className="review-questions-container">
                                  <p>{item.question}</p>
                                  <p className="your-answer"><strong>Your Answer:</strong> {item.userAnswer}</p>
                                  <p className="correct-answer"><strong>Correct Answer:</strong> {item.correctAnswer}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Congratulations! You answered all questions correctly!</p>
                )}
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
};

export default ReviewResultsModal;