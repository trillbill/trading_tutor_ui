import React, { useState, useEffect } from 'react';
import terminologyData from '../terminologyData';
import TermModal from '../components/TermModal'; // Import the modal component
import './Quiz.css'; // Create a CSS file for styling
import { FaRedo } from 'react-icons/fa'; // Importing a reset icon from react-icons

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [modalOpen, setModalOpen] = useState(false); // State for modal
    const [currentTerm, setCurrentTerm] = useState(null); // State for the term to show in the modal
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState(0);

    useEffect(() => {
        // Generate questions from terminology data
        const generatedQuestions = generateQuestions();
        console.log("Generated Questions:", generatedQuestions); // Debugging line
        setQuestions(generatedQuestions);
    }, []);

    const generateQuestions = () => {
        const questionsArray = [];
        terminologyData.forEach((term) => {
            // Question 1: Show image, ask for name
            // questionsArray.push({
            //     question: `What is the name of this concept?`,
            //     image: term.image,
            //     correctAnswer: term.name,
            //     options: generateOptions(term.name),
            //     type: 'imageToName',
            // });

            // Question 2: Show name, ask for value
            questionsArray.push({
                question: `What does ${term.name.toLowerCase()} mean?`,
                correctAnswer: term.value,
                options: generateOptions(term.value, 'value'),
                type: 'nameToValue',
            });

            // Question 3: Show value, ask for name
            questionsArray.push({
                question: `What is ${term.value.toLowerCase().replace('.', '')}?`,
                correctAnswer: term.name,
                options: generateOptions(term.name, 'name'),
                type: 'valueToName',
            });
        });
        return shuffleArray(questionsArray).slice(0, 15); // Limit to 15 questions
    };

    const generateOptions = (correctAnswer, type) => {
        const options = new Set();
        options.add(correctAnswer); // Add the correct answer
        while (options.size < 4) {
            const randomTerm = terminologyData[Math.floor(Math.random() * terminologyData.length)];
            if (type === 'name') {
              options.add(randomTerm.name);
            }
            if (type === 'value') {
              options.add(randomTerm.value);
            }
        }
        return shuffleArray(Array.from(options)); // Shuffle options
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const handleAnswer = (answer) => {
        if (answer === questions[currentQuestionIndex].correctAnswer) {
            setScore(score + 1);
            setCorrectAnswers(correctAnswers + 1);
        } else {
            // Show the modal with the term details
            const answer = questions[currentQuestionIndex].correctAnswer
            const term = terminologyData.find(term => term.name === answer || term.value === answer);
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
        setQuestions(generateQuestions());
        setCorrectAnswers(0);
        setIncorrectAnswers(0);
    };

    // Check if questions are loaded before rendering
    if (questions.length === 0) {
        return <div>Loading questions...</div>; // Loading state
    }

    return (
        <div className="quiz-container">
            <TermModal isOpen={modalOpen} onClose={handleCloseModal} term={currentTerm} />
            {quizCompleted ? (
                <div className="quiz-result">
                    <h2>Your Score: {score} / 15</h2>
                    <div className="reset-button-container">
                      <button onClick={restartQuiz} className="reset-button">
                          <FaRedo />
                      </button>
                    </div>
                </div>
            ) : (
                <div className="quiz-question">
                    <h2>{questions[currentQuestionIndex].question}</h2>
                    {questions[currentQuestionIndex].type === 'imageToName' && (
                        <img src={questions[currentQuestionIndex].image} alt="Concept" className="quiz-image" />
                    )}
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
                        {currentQuestionIndex + 1} of 15
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
