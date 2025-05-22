import React, { useState, useRef, useEffect } from 'react';
import api from '../api/api';
import { FaPlay, FaPause, FaExpand, FaVolumeUp, FaVolumeMute, FaCheckCircle, FaCheck } from 'react-icons/fa';
import './VideoPlayer.css';

const VideoPlayer = ({ videoUrl, moduleId, courseId, onComplete }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hasMarkedComplete, setHasMarkedComplete] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  
  // Set up event listeners when component mounts
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      // Load metadata (duration, etc)
      videoElement.addEventListener('loadedmetadata', () => {
        setDuration(videoElement.duration);
      });
      
      // Update progress as video plays
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      
      // Listen for video end
      videoElement.addEventListener('ended', handleVideoEnded);
      
      // Clean up event listeners
      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('ended', handleVideoEnded);
      };
    }
  }, []);
  
  // Check if user has already completed this module
  useEffect(() => {
    if (moduleId) {
      checkCompletionStatus();
    }
  }, [moduleId]);
  
  const checkCompletionStatus = async () => {
    if (!moduleId) return;
    
    try {
      const response = await api.get('/api/progress/user');
      
      if (response.data.success) {
        const completedModules = response.data.progress.module || [];
        
        // Check if the moduleId exists in the completed modules
        // Try both string and number comparison since IDs might be stored differently
        if (completedModules.includes(Number(moduleId)) || 
            completedModules.includes(String(moduleId))) {
          setHasMarkedComplete(true);
        } else {
          setHasMarkedComplete(false);
        }
      }
    } catch (error) {
      console.error('Error checking completion status:', error);
    }
  };
  
  const handleTimeUpdate = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const currentProgress = (videoElement.currentTime / videoElement.duration) * 100;
      setProgress(currentProgress);
    }
  };
  
  const handleVideoEnded = () => {
    setIsVideoEnded(true);
    setIsPlaying(false);
    markAsCompleted();
  };
  
  // Add this function to handle progress bar clicks
  const handleProgressClick = (e) => {
    const progressBar = progressRef.current;
    const video = videoRef.current;
    
    if (progressBar && video) {
      // Get the bounds of the progress bar
      const rect = progressBar.getBoundingClientRect();
      // Calculate click position relative to the progress bar
      const clickPosition = (e.clientX - rect.left) / rect.width;
      // Set video time based on click position
      video.currentTime = clickPosition * video.duration;
    }
  };
  
  const markAsCompleted = async () => {
    // Don't send the request if already marked as completed
    if (hasMarkedComplete) return;
    
    // Ensure moduleId is valid
    if (!moduleId) return;
    
    try {
      // Mark the module as completed with the correct payload format
      const response = await api.post('/api/progress/mark-completed', {
        itemType: 'module',
        itemId: moduleId
      });
      
      if (response.data.success) {
        setHasMarkedComplete(true);
        
        // Notify parent component
        if (onComplete) {
          onComplete(moduleId);
        }
      }
    } catch (error) {
      console.error('Error marking module as completed:', error);
    }
  };
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };
  
  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };
  
  const handleFullscreen = () => {
    const video = videoRef.current;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <video 
          ref={videoRef}
          src={videoUrl}
          className="video-element"
          onClick={togglePlay}
          preload="metadata"
          poster={videoUrl.replace(/\.[^/.]+$/, ".jpg")}
          playsInline
        />
        
        {!isPlaying && (
          <div className="video-play-overlay" onClick={togglePlay}>
            <button className="large-play-button">
              <FaPlay />
            </button>
          </div>
        )}
        
        <div className="video-controls visible">
          <button className="control-button" onClick={togglePlay}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          
          <div className="progress-container">
            <div 
              ref={progressRef}
              className="progress-bar"
              onClick={handleProgressClick}
            >
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
              <div 
                className="progress-handle"
                style={{ left: `${progress}%` }}
              />
            </div>
            <div className="time-display">
              {formatTime(videoRef.current ? videoRef.current.currentTime : 0)} / {formatTime(duration)}
            </div>
          </div>
          
          <div className="volume-controls">
            <button className="control-button" onClick={toggleMute}>
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
          
          <button className="control-button" onClick={handleFullscreen}>
            <FaExpand />
          </button>
        </div>
      </div>
      
      {/* Manual completion button */}
      {!hasMarkedComplete && (
        <button 
          className="mark-complete-button" 
          onClick={markAsCompleted}
          title="Mark as completed"
        >
          <FaCheck /> Mark as Completed
        </button>
      )}
      
      {/* Completion badge */}
      {hasMarkedComplete && (
        <div className="completion-badge">
          <FaCheckCircle /> Completed
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
