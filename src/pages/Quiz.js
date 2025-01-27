import React, { useState, useEffect } from 'react';
import terminologyData from '../terminologyData';
import './Quiz.css'; // Create a CSS file for styling

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

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
                question: `What is: ${term.name}?`,
                correctAnswer: term.value,
                options: generateOptions(term.value, "value"),
                type: 'nameToValue',
            });

            // Question 3: Show value, ask for name
            questionsArray.push({
                question: `What is the name of this concept: ${term.value}?`,
                correctAnswer: term.name,
                options: generateOptions(term.name, "name"),
                type: 'valueToName',
            });
        });
        return shuffleArray(questionsArray); // Shuffle questions
    };

    const generateOptions = (correctAnswer, type) => {
        const options = new Set();
        options.add(correctAnswer); // Add the correct answer
        while (options.size < 4) {
            const randomTerm = terminologyData[Math.floor(Math.random() * terminologyData.length)];
            options.add(randomTerm[type]); // Add random names
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
        if (answer === questions[currentQuestionIndex]?.correctAnswer) { // Optional chaining
            setScore(score + 1);
        }
        setUserAnswer(answer);
        setTimeout(() => {
            setUserAnswer('');
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setQuizCompleted(true);
            }
        }, 1000); // Delay before moving to the next question
    };

    const restartQuiz = () => {
        setScore(0);
        setCurrentQuestionIndex(0);
        setQuizCompleted(false);
        setQuestions(generateQuestions());
    };

    // Check if questions are loaded before rendering
    if (questions.length === 0) {
        return <div>Loading questions...</div>; // Loading state
    }

    return (
        <div className="quiz-container">
            {quizCompleted ? (
                <div className="quiz-result">
                    <h2>Your Score: {score} / {questions.length}</h2>
                    <button onClick={restartQuiz}>Restart Quiz</button>
                </div>
            ) : (
                <div className="quiz-question">
                    <h2>{questions[currentQuestionIndex]?.question}</h2>
                    {questions[currentQuestionIndex]?.type === 'imageToName' && (
                        <img src={questions[currentQuestionIndex]?.image} alt="Concept" className="quiz-image" />
                    )}
                    <div className="options">
                        {questions[currentQuestionIndex]?.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                className={userAnswer === option ? (option === questions[currentQuestionIndex]?.correctAnswer ? 'correct' : 'incorrect') : ''}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
