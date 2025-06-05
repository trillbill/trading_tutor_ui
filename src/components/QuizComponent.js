import React, { useState, useEffect } from 'react';
import { FaPlay, FaCheckCircle, FaTimes } from 'react-icons/fa';
import QuizModal from '../components/QuizModal';
import AuthPrompt from '../components/AuthPrompt';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import quizQuestions from '../quizQuestions';
import toolsIcon from '../assets/tools-icon.png';
import chartsIcon from '../assets/charts-icon.png';
import theoryIcon from '../assets/theory-icon.png';
import '../pages/Quiz.css';

const QuizComponent = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [incorrectAnswers, setIncorrectAnswers] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    
    // Modal state
    const [quizModalOpen, setQuizModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [quizMode, setQuizMode] = useState(null); // 'video' or 'topic'
    
    // Add state for terminology data
    const [terminologyData, setTerminologyData] = useState([]);
    const [isLoadingTerminology, setIsLoadingTerminology] = useState(true);

    const { isAuthenticated, isEmailVerified } = useAuth();
    const showAuthPrompt = !isAuthenticated || !isEmailVerified;

    // Fetch terminology data from backend
    useEffect(() => {
        const fetchTerminologyData = async () => {
            try {
                setIsLoadingTerminology(true);
                const response = await api.get('/api/resources/terminology');
                
                if (response.data.success) {
                    setTerminologyData(response.data.data);
                } else {
                    console.error('Failed to fetch terminology data');
                }
            } catch (error) {
                console.error('Error fetching terminology data:', error);
            } finally {
                setIsLoadingTerminology(false);
            }
        };

        fetchTerminologyData();
    }, []);

    // Filter terminology data for entries with thumbnail property (only after data is loaded)
    const videoEntries = terminologyData.filter(term => term.thumbnail && term.video);

    // Group videos by category (only after data is loaded)
    const videosByCategory = videoEntries.reduce((acc, entry) => {
        if (!acc[entry.category]) {
            acc[entry.category] = [];
        }
        acc[entry.category].push(entry);
        return acc;
    }, {});

    const [activeVideoCategory, setActiveVideoCategory] = useState('');

    // Update active video category when data loads
    useEffect(() => {
        if (!isLoadingTerminology && Object.keys(videosByCategory).length > 0 && !activeVideoCategory) {
            setActiveVideoCategory(Object.keys(videosByCategory)[0] || 'Theory');
        }
    }, [isLoadingTerminology, videosByCategory, activeVideoCategory]);

    // Effect to fetch questions when selectedTopic or selectedVideo changes
    useEffect(() => {
        if (selectedTopic && quizMode === 'topic' && !isLoadingTerminology) {
            fetchQuestions();
        } else if (selectedVideo && quizMode === 'video' && !isLoadingTerminology) {
            generateVideoQuiz();
        }
    }, [selectedTopic, selectedVideo, quizMode, isLoadingTerminology]);

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
                termData: entry,
            };

            questions.push(newQuestion);
            return questions;
        }, []);
        return chartQuestions;
    };

    const shuffleOptions = (options) => {
        let currentIndex = options.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {
        
            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
        
            // And swap it with the current element.
            [options[currentIndex], options[randomIndex]] = [
            options[randomIndex], options[currentIndex]];
        }

        return options;
    };

    const fetchQuestions = async () => {
        if (isLoadingTerminology) return; // Don't fetch if terminology data isn't loaded yet
        
        setLoading(true);
        const filteredEntries = terminologyData.filter(term => term.category === selectedTopic);
        const questionTotal = selectedTopic === 'Charts' ? 4 : 8;
        const selectedEntries = getRandomEntries(filteredEntries, questionTotal);
        
        try {
            const response = await api.post('api/quiz/generate-quiz', selectedEntries);
            let generatedQuestions = response.data.questions;
            
            // Add termData to each question for reference
            generatedQuestions = generatedQuestions.map(question => {
                const term = selectedEntries.find(entry => entry.name === question.correctAnswer);
                return { ...question, termData: term };
            });
            
            if (selectedTopic === 'Charts') {
                const chartQuestions = generateChartQuestions(filteredEntries, questionTotal);
                generatedQuestions = chartQuestions.reduce((questions, curr) => {
                    const index = chartQuestions.indexOf(curr);
                    questions.push(curr);
                    if (index < generatedQuestions.length) {
                        questions.push(generatedQuestions[index]);
                    }
                    return questions;
                }, []);
            }
            
            setQuestions(generatedQuestions);
            // Only open the modal when we have questions
            if (generatedQuestions && generatedQuestions.length > 0) {
                setQuizModalOpen(true);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Generate quiz based on selected video using prewritten questions
    const generateVideoQuiz = () => {
        setLoading(true);
        
        try {
            // Find the matching quiz questions for the selected video
            const videoQuizData = quizQuestions.find(quiz => quiz.name === selectedVideo.name);
            
            if (videoQuizData && videoQuizData.questions) {
                // Add termData to each question for reference
                const generatedQuestions = videoQuizData.questions.map(question => {
                    question.options = shuffleOptions(question.options);
                    return { ...question, termData: selectedVideo };
                });
                
                setQuestions(generatedQuestions);
                
                // Only open the modal when we have questions
                if (generatedQuestions && generatedQuestions.length > 0) {
                    setQuizModalOpen(true);
                }
            } else {
                console.error('No quiz questions found for:', selectedVideo.name);
            }
        } catch (error) {
            console.error('Error generating video quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRandomEntries = (data, count) => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const handleSelectVideo = (video) => {
        setSelectedVideo(video);
        setQuizMode('video');
        // We don't need to call generateVideoQuiz() here as it will be triggered by the useEffect
    };

    const handleSetSelectedTopic = (topic) => {
        setSelectedTopic(topic);
        setQuizMode('topic');
        // We don't need to call fetchQuestions() here as it will be triggered by the useEffect
    };

    const handleQuizComplete = (results) => {
        setCorrectAnswers(results.correctAnswers);
        setIncorrectAnswers(results.incorrectAnswers);
    };

    const handleCloseQuizModal = () => {
        setQuizModalOpen(false);
        setSelectedVideo(null);
        setSelectedTopic(null);
    };

    const topics = {
        Charts: { icon: chartsIcon, terms: ['Charts'] },
        Theory: { icon: theoryIcon, terms: ['Theory'] },
        Tools: { icon: toolsIcon, terms: ['Tools'] },
    };

    return (
        <div className="quiz-container">
            {/* Video Tutorial Section */}
            <div className="quiz-section">
                <h3 className="section-title">Video Quizzes</h3>
                <p className="quiz-section-description">
                    Watch a video lesson and test your understanding.
                </p>
                
                {/* Category tabs */}
                <div className="video-category-tabs">
                    {Object.keys(videosByCategory).map(category => (
                        <button 
                            key={category}
                            className={`category-tab ${activeVideoCategory === category ? 'active' : ''}`}
                            onClick={() => setActiveVideoCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                
                {/* Horizontal scrolling carousel for selected category */}
                <div className="video-carousel-container">
                    <div className="video-carousel">
                        {videosByCategory[activeVideoCategory]?.map((entry, index) => (
                            <div 
                                key={index} 
                                className="video-thumbnail"
                                onClick={() => handleSelectVideo(entry)}
                            >
                                <img src={entry.thumbnail} alt={entry.name} />
                                <div className="play-icon"><FaPlay /></div>
                                <div className="video-title">{entry.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Topic Quiz Section */}
            <div className="quiz-section topic-section">
                <h3 className="section-title">General Quizzes</h3>
                <p className="quiz-section-description">
                    Select a topic to test your general knowledge.
                </p>
                
                <div className="quiz-topic-grid">
                    {Object.keys(topics).map(topic => (
                        <div
                            key={topic}
                            className="quiz-topic-card"
                            onClick={() => handleSetSelectedTopic(topic)}
                        >
                            <img src={topics[topic].icon} alt={`${topic} icon`} className="quiz-topic-icon" />
                            <h3 className="quiz-topic-name">{topic}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quiz Modal */}
            <QuizModal 
                isOpen={quizModalOpen}
                onClose={handleCloseQuizModal}
                questions={questions}
                videoData={selectedVideo}
                quizMode={quizMode}
                onQuizComplete={handleQuizComplete}
                loading={loading}
            />
            
            {/* Full-page loading overlay */}
            {loading && !quizModalOpen && (
                <div className="loading-overlay">
                    <h2>Generating quiz questions...</h2>
                    <div className="spinner"></div>
                </div>
            )}

            {/* Show auth prompt if needed */}
            {showAuthPrompt && <AuthPrompt />}
        </div>
    );
};

export default QuizComponent;
