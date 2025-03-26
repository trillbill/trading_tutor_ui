import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaShieldAlt, FaBalanceScale } from 'react-icons/fa';
import api from '../api/api';
import './RiskAppetiteQuiz.css';

const RiskAppetiteQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const questions = [
    {
      question: "How would you react if your investment lost 20% of its value in a month?",
      options: [
        { text: "Sell immediately to prevent further losses", score: 1 },
        { text: "Sell a portion to reduce exposure", score: 3 },
        { text: "Hold and wait for recovery", score: 6 },
        { text: "Buy more at the lower price", score: 10 }
      ],
      icon: <FaChartLine />
    },
    {
      question: "What's your primary investment goal?",
      options: [
        { text: "Preserve capital with minimal risk", score: 1 },
        { text: "Generate steady income", score: 4 },
        { text: "Achieve balanced growth", score: 7 },
        { text: "Maximize long-term growth potential", score: 10 }
      ],
      icon: <FaBalanceScale />
    },
    {
      question: "How long are you willing to wait for an investment to recover from a downturn?",
      options: [
        { text: "Less than 3 months", score: 1 },
        { text: "3-12 months", score: 4 },
        { text: "1-3 years", score: 7 },
        { text: "More than 3 years", score: 10 }
      ],
      icon: <FaShieldAlt />
    },
    {
      question: "Which investment portfolio would you prefer?",
      options: [
        { text: "2% annual return with minimal risk", score: 1 },
        { text: "5% annual return with low risk", score: 4 },
        { text: "8% annual return with moderate risk", score: 7 },
        { text: "12%+ annual return with high risk", score: 10 }
      ],
      icon: <FaChartLine />
    },
    {
      question: "How often do you check your investments?",
      options: [
        { text: "Multiple times per day", score: 2 },
        { text: "Daily", score: 4 },
        { text: "Weekly", score: 7 },
        { text: "Monthly or less frequently", score: 10 }
      ],
      icon: <FaBalanceScale />
    }
  ];

  const handleAnswer = (score) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate final score
      submitResults(newAnswers);
    }
  };

  const calculateRiskScore = (answerScores) => {
    // Calculate weighted average of scores
    const sum = answerScores.reduce((total, score) => total + score, 0);
    const average = Math.round(sum / answerScores.length);
    return average;
  };

  const submitResults = async (finalAnswers) => {
    setIsSubmitting(true);
    const riskAppetite = calculateRiskScore(finalAnswers);
    
    try {
      await api.post('/api/account/risk-appetite', { riskAppetite });
      navigate('/account', { 
        state: { 
          showRiskResult: true, 
          riskAppetite 
        } 
      });
    } catch (error) {
      console.error('Error submitting risk appetite:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="risk-quiz-container">
      <div className="risk-quiz-card">
        <div className="quiz-progress">
          <div 
            className="progress-bar" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        
        <div className="quiz-content">
          <div className="question-icon">
            {questions[currentQuestion].icon}
          </div>
          
          <h2 className="question-text">
            {questions[currentQuestion].question}
          </h2>
          
          <div className="answer-options">
            {questions[currentQuestion].options.map((option, index) => (
              <button 
                key={index} 
                className="answer-option"
                onClick={() => handleAnswer(option.score)}
                disabled={isSubmitting}
              >
                {option.text}
              </button>
            ))}
          </div>
          
          <div className="question-counter">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAppetiteQuiz;
