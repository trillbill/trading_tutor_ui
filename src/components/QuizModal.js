import React, { useState, useEffect } from 'react';
import ChartDisplay from './ChartDisplay';
import ProgressBar from './ProgressBar';
import Confetti from 'react-confetti';
import { FaTimes } from 'react-icons/fa';
import './QuizModal.css';

const QuizModal = ({ 
    isOpen, 
    onClose, 
    questions, 
    videoData, 
    quizMode,
    onQuizComplete,
    loading 
}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [incorrectAnswers, setIncorrectAnswers] = useState([]);
    const [currentTerm, setCurrentTerm] = useState(null);
    const [showVideo, setShowVideo] = useState(quizMode === 'video');
    const [internalLoading, setInternalLoading] = useState(loading);
    const [showReview, setShowReview] = useState(false);

    // Reset state when modal opens or questions change
    useEffect(() => {
        if (isOpen) {
            setCurrentQuestionIndex(0);
            setUserAnswer('');
            setScore(0);
            setQuizCompleted(false);
            setShowConfetti(false);
            setCorrectAnswers([]);
            setIncorrectAnswers([]);
            setShowVideo(quizMode === 'video');
            setInternalLoading(loading);
            setShowReview(false);
        }
    }, [isOpen, questions, quizMode, loading]);

    if (!isOpen) return null;

    const handleAnswer = (answer) => {
        // Make sure questions exist and we have a valid index
        if (!questions || !questions[currentQuestionIndex]) return;
        
        if (answer === questions[currentQuestionIndex].correctAnswer) {
            setScore(score + 1);
            const updatedCorrectAnswers = correctAnswers.concat(questions[currentQuestionIndex]);
            setCorrectAnswers(updatedCorrectAnswers);
        } else {
            const incorrectAnswer = {
                ...questions[currentQuestionIndex],
                userAnswer: answer,
            };
            const updatedIncorrectAnswers = incorrectAnswers.concat(incorrectAnswer);
            setIncorrectAnswers(updatedIncorrectAnswers);
            // Show the modal with the term details
            const correctAnswer = questions[currentQuestionIndex].correctAnswer;
            const term = questions[currentQuestionIndex].termData || { name: correctAnswer, description: "No additional information available." };
            setCurrentTerm(term);
        }
        setUserAnswer(answer);
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setQuizCompleted(true);
                setShowConfetti(true);
                // Pass results back to parent component
                if (onQuizComplete) {
                    onQuizComplete({
                        score,
                        total: questions.length,
                        correctAnswers,
                        incorrectAnswers
                    });
                }
            }
            setUserAnswer('');
        }, 1000);
    };

    const handleStartQuiz = () => {
        setShowVideo(false);
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setUserAnswer('');
        setScore(0);
        setQuizCompleted(false);
        setShowConfetti(false);
        setCorrectAnswers([]);
        setIncorrectAnswers([]);
        setShowReview(false);
        if (quizMode === 'video') {
            setShowVideo(true);
        }
    };

    const toggleReview = () => {
        setShowReview(!showReview);
    };

    // Function to determine the number of stars based on score
    const getStarRating = () => {
        const percentage = (score / questions.length) * 100;
        if (percentage === 100) return 5;
        if (percentage >= 80) return 4;
        if (percentage >= 60) return 3;
        if (percentage >= 40) return 2;
        return 1;
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="quiz-modal-overlay" onClick={handleOverlayClick}>
            <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal-button" onClick={onClose}>
                    <FaTimes />
                </button>
                                
                {showVideo && videoData ? (
                    <div className="video-container">
                        <h2>{videoData.name}</h2>
                        <iframe 
                            className="video-player"
                            src={videoData.video}
                            title={videoData.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            height="450"
                        ></iframe>
                        <button 
                            className="start-quiz-button"
                            onClick={handleStartQuiz}
                        >
                            Start Quiz
                        </button>
                    </div>
                ) : quizCompleted ? (
                    <div className="quiz-result">
                        {showConfetti && <Confetti recycle={false} numberOfPieces={500} colors={['#4b937b', '#050605', '#24443c', '#D9AC22']} />}
                        
                        <div className="quiz-result-content">
                            <h2>Congratulations! You've completed the quiz!</h2>
                            <div>
                                <h2>Score: {score} / {questions.length}</h2>
                                <div className="star-rating">
                                    {Array.from({ length: getStarRating() }, (_, index) => (
                                        <span key={index} className="star">⭐</span>
                                    ))}
                                </div>
                            </div>
                            <div className="quiz-buttons">
                                {incorrectAnswers.length > 0 && (
                                    <button onClick={toggleReview} className="quiz-button primary">
                                        {showReview ? "Hide Review" : "Review Incorrect Answers"}
                                    </button>
                                )}
                                <button onClick={restartQuiz} className="quiz-button">
                                    {quizMode === 'video' ? 'Watch Video Again' : 'Try Again'}
                                </button>
                                <button onClick={onClose} className="quiz-button secondary">
                                    Close
                                </button>
                            </div>
                        </div>
                        
                        {/* Incorrect answers review section - shown/hidden based on showReview state */}
                        {showReview && incorrectAnswers.length > 0 && (
                            <div className="incorrect-answers-section">
                                <h3>Incorrect Answers</h3>
                                <div className="incorrect-answers-list">
                                    {incorrectAnswers.map((item, index) => (
                                        <div key={index}>
                                            <div className="review-questions-container">
                                                <h4>Question {index + 1}</h4>
                                                <p>{item.question}</p>
                                                {item.chartData && (
                                                    <div className="review-chart-container">
                                                        <ChartDisplay 
                                                            chartType={item.chartType}
                                                            data={item.chartData}
                                                            lineColor={item.lineColor} 
                                                        />
                                                    </div>
                                                )}
                                                <p className="your-answer"><strong>Your Answer:</strong> {item.userAnswer}</p>
                                                <p className="correct-answer"><strong>Correct Answer:</strong> {item.correctAnswer}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : internalLoading || !questions || questions.length === 0 ? (
                    <div className="loading-container">
                        <h2>Generating quiz questions...</h2>
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="quiz-question">
                        {questions && questions[currentQuestionIndex] ? (
                            <>
                                <h2>{questions[currentQuestionIndex].question}</h2>
                                {
                                    questions[currentQuestionIndex].chartData &&
                                    <div className="chart-container">
                                        <ChartDisplay 
                                            chartType={questions[currentQuestionIndex].chartType}
                                            data={questions[currentQuestionIndex].chartData}
                                            lineColor={questions[currentQuestionIndex].lineColor} 
                                        />
                                    </div>
                                }
                                <div className="options-container">
                                    <div className="options">
                                        {questions[currentQuestionIndex].options.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleAnswer(option)}
                                                className={`answer-button ${userAnswer === option ? (option === questions[currentQuestionIndex].correctAnswer ? 'correct' : 'incorrect') : ''}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <ProgressBar 
                                    currentQuestionIndex={currentQuestionIndex} 
                                    totalQuestions={questions.length}
                                />
                            </>
                        ) : (
                            <div className="loading-container">
                                <h2>No questions available</h2>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizModal;
