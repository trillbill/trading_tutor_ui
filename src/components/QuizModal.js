import React, { useState, useEffect, useRef } from 'react';
import ChartDisplay from './ChartDisplay';
import ProgressBar from './ProgressBar';
import Confetti from 'react-confetti';
import { FaTimes } from 'react-icons/fa';
import './QuizModal.css';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const QuizModal = ({ 
    isOpen, 
    onClose, 
    questions, 
    videoData, 
    quizMode,
    onQuizComplete,
    loading 
}) => {
    const { user } = useAuth();
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
    const [resultsSaved, setResultsSaved] = useState(false);
    const [savingResults, setSavingResults] = useState(false);
    const [saveError, setSaveError] = useState(null);

    // Add a ref to track if we've saved the current quiz completion
    const hasSavedCurrentAttemptRef = useRef(false);

    // Define saveQuizResults function BEFORE any useEffect that calls it
    const saveQuizResults = async () => {
        // Only save if the quiz is completed and we haven't saved this attempt yet
        if (!quizCompleted || hasSavedCurrentAttemptRef.current || !user) return;
        
        // Mark that we're saving this attempt
        hasSavedCurrentAttemptRef.current = true;
        
        setSavingResults(true);
        setSaveError(null);
        
        try {
            const category = videoData ? videoData.category : (
                // For topic quizzes, determine category from the first question
                questions && questions.length > 0 && questions[0].termData ? 
                questions[0].termData.category : 'Theory'
            );
            
            const resultData = {
                score,
                totalQuestions: questions.length,
                quizType: quizMode, // 'video' or 'topic'
                difficulty: 'intermediate', // Default for now
                category,
                videoName: videoData ? videoData.name : null
            };
                        
            const response = await api.post('/api/quiz/save-results', resultData);
            
            setResultsSaved(true);
            
            // Refresh dashboard data to show updated quiz results
            if (window.refreshDashboardData) {
                try {
                    await window.refreshDashboardData();
                } catch (refreshError) {
                    console.error('Error refreshing dashboard data:', refreshError);
                    // Don't fail the save operation if dashboard refresh fails
                }
            }
            
            // Dispatch a custom event to notify other components
            window.dispatchEvent(new CustomEvent('quizCompleted', {
                detail: {
                    score,
                    totalQuestions: questions.length,
                    quizType: quizMode,
                    category
                }
            }));
            
        } catch (error) {
            console.error('Error saving quiz results:', error);
            setSaveError('Error saving quiz results');
            // Reset the flag so user can try again
            hasSavedCurrentAttemptRef.current = false;
        } finally {
            setSavingResults(false);
        }
    };

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
            setResultsSaved(false);
            setSavingResults(false);
            setSaveError(null);
            hasSavedCurrentAttemptRef.current = false;
        }
    }, [isOpen, questions, quizMode, loading]);

    // Call saveQuizResults when quiz is completed
    useEffect(() => {
        if (quizCompleted && !resultsSaved && !savingResults && user) {
            saveQuizResults();
        }
    }, [quizCompleted, resultsSaved, savingResults, user]);

    // Reset the save flag when the modal opens with new content
    useEffect(() => {
        if (isOpen) {
            hasSavedCurrentAttemptRef.current = false;
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
            setResultsSaved(false);
            setSavingResults(false);
            setSaveError(null);
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
        // Reset the save flag when restarting
        hasSavedCurrentAttemptRef.current = false;
        
        // Reset all quiz state
        setCurrentQuestionIndex(0);
        setUserAnswer('');
        setScore(0);
        setQuizCompleted(false);
        setShowConfetti(false);
        setCorrectAnswers([]);
        setIncorrectAnswers([]);
        setShowVideo(quizMode === 'video');
        setResultsSaved(false);
        setSavingResults(false);
        setSaveError(null);
        setShowReview(false);
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
                    <div className="quiz-video-container">
                        <h2>{videoData.name}</h2>
                        <iframe 
                            className="video-player"
                            src={videoData.video}
                            title={videoData.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            height="300"
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
                        
                        {/* Add saving status indicators */}
                        {savingResults && (
                            <p className="saving-status">Saving your progress...</p>
                        )}
                        
                        {resultsSaved && !savingResults && (
                            <p className="saving-status success">Progress saved!</p>
                        )}
                        
                        {saveError && (
                            <p className="saving-status error">{saveError}</p>
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
