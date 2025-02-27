import React, { useState, useEffect } from 'react';
import terminologyData from '../terminologyData';
import TermModal from '../components/TermModal'; // Import the modal component
import './Quiz.css'; // Create a CSS file for styling
import { FaRedo } from 'react-icons/fa'; // Importing a reset icon from react-icons
import axios from 'axios'; // Import axios for API calls

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [modalOpen, setModalOpen] = useState(false); // State for modal
    const [currentTerm, setCurrentTerm] = useState(null); // State for the term to show in the modal
    const [loading, setLoading] = useState(true); // State for loading
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);

    // API Endpoint
    const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT 

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        setLoading(true); // Set loading to true when fetching questions
        // Randomly select 8 entries from terminologyData
        const selectedEntries = getRandomEntries(terminologyData, 8);
        // Create a new array with only name and value fields
        const filteredEntries = selectedEntries.map(entry => ({
            name: entry.name,
            value: entry.value
        }));

        try {
            const response = await axios.post(`${API_ENDPOINT}api/quiz/generate-quiz`, filteredEntries);
            setQuestions(response.data.questions); // Set questions from the response
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
            setCorrectAnswers(correctAnswers + 1);
        } else {
            // Show the modal with the term details
            const answer = questions[currentQuestionIndex].correctAnswer;
            const term = terminologyData.find(term => term.name === answer);
            setCurrentTerm(term);
            setModalOpen(true);
        }
        setUserAnswer(answer);
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setQuizCompleted(true);
            }
            setUserAnswer('');
        }, 1000); // Delay before moving to the next question
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const restartQuiz = () => {
        setScore(0);
        setCurrentQuestionIndex(0);
        setQuizCompleted(false);
        fetchQuestions(); // Re-fetch questions
        setCorrectAnswers(0);
        setIncorrectAnswers(0);
    };

    // Check if questions are loaded before rendering
    if (loading) {
        return (
            <div className="loading-container">
                <h2 style={{ color: 'white', fontWeight: 'bold' }}>Generating quiz questions...</h2>
                <div className="spinner"></div> {/* Add your spinner here */}
            </div>
        ); // Loading state
    }

    // Ensure there are questions before rendering
    if (questions.length === 0) {
        return <div>No questions available.</div>; // Handle case where no questions are fetched
    }

    return (
        <div className="quiz-container">
            <TermModal isOpen={modalOpen} onClose={handleCloseModal} term={currentTerm} />
            {quizCompleted ? (
                <div className="quiz-result">
                    <h2>Your Score: {score} / {questions.length}</h2>
                    <div className="reset-button-container">
                      <button onClick={restartQuiz} className="reset-button">
                          <FaRedo />
                      </button>
                    </div>
                </div>
            ) : (
                <div className="quiz-question">
                    <h2>{questions[currentQuestionIndex].question}</h2>
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
                    {/* Question Tracker */}
                    <div className="question-tracker">
                        {currentQuestionIndex + 1} of {questions.length}
                        <div className="score-box">Score: {score}</div>
                    </div>
                    <div className="reset-button-container">
                      <button onClick={restartQuiz} className="reset-button">
                          <span className="reset-text">Reset Quiz</span>
                          <FaRedo />
                      </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
