import React, { useState, useEffect } from 'react';
import terminologyData from '../terminologyData';
import ChartDisplay from '../components/ChartDisplay';
import TermModal from '../components/TermModal'; // Import the modal component
import ProgressBar from '../components/ProgressBar'; // Import the ProgressBar component
import Confetti from 'react-confetti'; // Import the confetti library
import './Quiz.css'; // Create a CSS file for styling
import { FaRedo } from 'react-icons/fa'; // Importing a reset icon from react-icons
import axios from 'axios'; // Import axios for API calls
import heroImage from '../assets/quiz.png'; // Use the same image
import toolsIcon from '../assets/tools-icon.png'; // Adjust the path as necessary
import chartsIcon from '../assets/charts-icon.png'; // Adjust the path as necessary
import theoryIcon from '../assets/theory-icon.png'; // Adjust the path as necessary
import ReviewResultsModal from '../components/ReviewResultsModal'; // Import the review results modal

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [modalOpen, setModalOpen] = useState(false); // State for term modal
    const [currentTerm, setCurrentTerm] = useState(null); // State for the term to show in the modal
    const [loading, setLoading] = useState(false); // State for loading
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [incorrectAnswers, setIncorrectAnswers] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null); // State for selected quiz topic
    const [showConfetti, setShowConfetti] = useState(false); // State for confetti animation
    const [reviewModalOpen, setReviewModalOpen] = useState(false); // State for review results modal

    // API Endpoint
    const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT 

    const topics = {
        Charts: { icon: chartsIcon, terms: ['Charts'] },
        Theory: { icon: theoryIcon, terms: ['Theory'] }, // No concepts associated with Theory for now
        Tools: { icon: toolsIcon, terms: ['Tools'] },
    };

    useEffect(() => {
        if (selectedTopic) {
            fetchQuestions();
        }
    }, [selectedTopic]);

    const generateChartQuestions = (entries, questionTotal) => {
        const removeSupportResistance = entries.filter(e => e.name !== 'Support' && e.name !== 'Resistance');
        const selectedChartEntries = getRandomEntries(removeSupportResistance, questionTotal);
        const options = selectedChartEntries.map(e => e.name);

        const chartQuestions = selectedChartEntries.reduce((questions, entry) => {
            const newQuestion = {
                correctAnswer: entry.name,
                options,
                question: "Identify this chart pattern.",
                chartData: entry.data,
                lineColor: entry.lineColor,
                chartType: entry.chartType,
            };

            questions.push(newQuestion);
            return questions;
        }, []);
        return chartQuestions;
    };

    const fetchQuestions = async () => {
        setLoading(true); // Set loading to true when fetching questions
        // Randomly select 8 entries from terminologyData based on selected topic
        const filteredEntries = terminologyData.filter(term => term.category === selectedTopic);
        const questionTotal = selectedTopic === 'Charts' ? 4 : 8;
        const selectedEntries = getRandomEntries(filteredEntries, questionTotal);
        
        try {
            const response = await axios.post(`${API_ENDPOINT}api/quiz/generate-quiz`, selectedEntries);
            let generatedQuestions = response.data.questions;
            if (selectedTopic === 'Charts') {
                const chartQuestions = generateChartQuestions(filteredEntries, questionTotal);
                generatedQuestions = chartQuestions.reduce((questions, curr) => {
                    const index = chartQuestions.indexOf(curr);
                    questions.push(curr);
                    questions.push(generatedQuestions[index]);
                    return questions;
                }, []);
            }
            setQuestions(generatedQuestions); // Set questions from the response
            setCurrentQuestionIndex(0); // Reset current question index
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    const getRandomEntries = (data, count) => {
        const shuffled = data.sort(() => 0.5 - Math.random()); // Shuffle the array
        return shuffled.slice(0, count); // Return the first 'count' entries
    };

    const handleAnswer = (answer) => {
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
            const term = terminologyData.find(term => term.name === correctAnswer);
            setCurrentTerm(term);
            setModalOpen(true);
        }
        setUserAnswer(answer);
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setQuizCompleted(true);
                setShowConfetti(true); // Show confetti on quiz completion
            }
            setUserAnswer('');
        }, 1000); // Delay before moving to the next question
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSetSelectedTopic = (topic) => {
        setSelectedTopic(topic);
        setLoading(true);
    };

    const restartQuiz = () => {
        setScore(0);
        setCurrentQuestionIndex(0);
        setQuizCompleted(false);
        fetchQuestions(); // Re-fetch questions
        setCorrectAnswers([]);
        setIncorrectAnswers([]);
        setShowConfetti(false); // Reset confetti state
    };

    const resetTopic = () => {
        setScore(0);
        setCurrentQuestionIndex(0);
        setQuizCompleted(false);
        setCorrectAnswers([]);
        setIncorrectAnswers([]);
        setSelectedTopic(null);
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

    const renderResetQuizButtons = () => {
        return (
            <div className="reset-button-container">
                <button onClick={restartQuiz} className="reset-button">
                    <span className="reset-text">New Questions</span>
                </button>
                <button onClick={resetTopic} className="new-topic-button">
                    <span className="reset-text">Change Topic</span>
                </button>
            </div>
        );
    };

    return (
        <div className="quiz-container">
            <div className="quiz-hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="hero-overlay"></div>
                <div className="quiz-hero-content">
                    <h2>Test Your Knowledge</h2>
                    <p>
                        Select a topic you want to quiz yourself on and choose the correct answer for each question.
                    </p>
                </div>
            </div>
            {!selectedTopic && !loading ? (
                <div className="quiz-topic-grid">
                    {Object.keys(topics).map(topic => (
                        <div
                            key={topic}
                            className={'quiz-topic-card'}
                            onClick={() => handleSetSelectedTopic(topic)}
                        >
                            <img src={topics[topic].icon} alt={`${topic} icon`} className="quiz-topic-icon" />
                            <h3 className="quiz-topic-name">{topic}</h3>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <TermModal isOpen={modalOpen} onClose={handleCloseModal} term={currentTerm} />
                    {quizCompleted ? (
                        <div className="quiz-result-container">
                            {showConfetti && <Confetti recycle={false} numberOfPieces={500} colors={['#4b937b', '#050605', '#24443c', '#D9AC22']} />}
                            <div className="quiz-result">
                                <h2>Congratulations! You've completed the quiz!</h2>
                                <div className="quiz-summary-container">
                                    <h2>Score: {score} / {questions.length}</h2>
                                    <div className="star-rating">
                                        {Array.from({ length: getStarRating() }, (_, index) => (
                                            <span key={index} className="star">⭐</span>
                                        ))}
                                    </div>
                                    {incorrectAnswers.length > 0 && (
                                        <div>
                                            <p>Review your answers to see what you got wrong</p>
                                            <button onClick={() => setReviewModalOpen(true)} className="review-results-button">Review</button>
                                        </div>
                                    )}
                                </div>
                                {renderResetQuizButtons()}
                            </div>
                        </div>
                    ) : (
                        <div>
                            {loading ? (
                                <div className="loading-container">
                                    <h2 style={{ color: 'white', fontWeight: 'bold' }}>Generating quiz questions...</h2>
                                    <div className="spinner"></div> {/* Add your spinner here */}
                                </div>
                            ) : (
                                <div className="quiz-question">
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
                                    <ProgressBar currentQuestionIndex={currentQuestionIndex} totalQuestions={questions.length}/>
                                    {renderResetQuizButtons()}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            <ReviewResultsModal 
                isOpen={reviewModalOpen} 
                onClose={() => setReviewModalOpen(false)} 
                incorrectAnswers={incorrectAnswers} 
            />
        </div>
    );
};

export default Quiz;
