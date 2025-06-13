import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaShieldAlt, FaBalanceScale } from 'react-icons/fa';
import api from '../api/api';
import './RiskAppetiteQuiz.css';

const RiskAppetiteQuiz = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const questions = [
    {
      question: "How would you react if your investment lost 20% of its value in a week?",
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
        { text: "Maximize growth potential", score: 10 }
      ],
      icon: <FaBalanceScale />
    },
    {
      question: "How would you describe your approach to risk when trading in the market?",
      options: [
        { text: "I avoid risky trades altogether and prefer to stick to the safest options available", score: 1 },
        { text: "I prefer low-risk trades and prioritize preserving my capital, even if it means lower potential returns", score: 4 },
        { text: "I'm willing to take moderate risks, seeking a balance between potential reward and protecting my capital", score: 7 },
        { text: "I prefer to take high risks for the potential of large rewards, even if it means large losses", score: 10 }
      ],
      icon: <FaShieldAlt />
    },
    {
      question: "How do you feel about losing money on a trade?",
      options: [
        { text: "I find losing money very uncomfortable and will take steps to avoid it, even if it means missing out on potential gains", score: 1 },
        { text: "I don't mind small losses, but large losses make me anxious, and I'll act quickly to limit them", score: 4 },
        { text: "I can tolerate losses as part of trading, but I try to keep them within a manageable range", score: 7 },
        { text: "I'm willing to take significant losses if I believe the trade has long-term potential", score: 10 }
      ],
      icon: <FaChartLine />
    },
    {
      question: "How often do you check your investments?",
      options: [
        { text: "Monthly or less frequently", score: 2 },
        { text: "Weekly", score: 4 },
        { text: "Daily", score: 7 },
        { text: "Multiple times per day", score: 10 }
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
      
      if (onComplete) {
        // If onComplete prop is provided, call it instead of navigating
        onComplete(riskAppetite);
      } else {
        // Default behavior - navigate to account page
      navigate('/account', { 
        state: { 
          showRiskResult: true, 
          riskAppetite 
        } 
      });
      }
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
