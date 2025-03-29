import React, { useEffect, useState } from 'react';
import { 
  FaTrophy, 
  FaFireAlt, 
  FaRegSmileBeam, 
  FaRegLightbulb, 
  FaChartLine, 
  FaRedo, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaBrain 
} from 'react-icons/fa';
import { BsLightningChargeFill, BsStars } from 'react-icons/bs';
import { GiSandsOfTime } from 'react-icons/gi';
import styles from '../styles/ProgressBar.module.css';

interface ProgressBarProps {
  correctCount: number;
  incorrectCount: number;
  totalAnswered: number;
  correctStreak: number;
  onReset?: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  correctCount, 
  incorrectCount, 
  totalAnswered, 
  correctStreak,
  onReset
}) => {
  // For animation of count numbers
  const [animatedCorrect, setAnimatedCorrect] = useState(0);
  const [animatedIncorrect, setAnimatedIncorrect] = useState(0);
  const [prevStreak, setPrevStreak] = useState(0);
  const [showStreakMessage, setShowStreakMessage] = useState(false);
  
  const TOTAL_QUESTIONS = 10; // Total questions per session
  
  // Calculate progress percentage for progress bars
  const correctWidth = (correctCount / TOTAL_QUESTIONS) * 100;
  const incorrectWidth = (incorrectCount / TOTAL_QUESTIONS) * 100;
  const completionPercentage = (totalAnswered / TOTAL_QUESTIONS) * 100;
  
  // Calculate accuracy percentage
  const accuracy = totalAnswered > 0 
    ? Math.round((correctCount / totalAnswered) * 100) 
    : 0;
  
  useEffect(() => {
    const duration = 800; // animation duration in ms
    const framesPerSecond = 60;
    const totalFrames = duration * framesPerSecond / 1000;
    const correctIncrement = correctCount / totalFrames;
    const incorrectIncrement = incorrectCount / totalFrames;
    
    let currentFrame = 0;
    let animationId: number;
    
    const animate = () => {
      if (currentFrame < totalFrames) {
        setAnimatedCorrect(Math.round(correctIncrement * currentFrame));
        setAnimatedIncorrect(Math.round(incorrectIncrement * currentFrame));
        currentFrame++;
        animationId = requestAnimationFrame(animate);
      } else {
        setAnimatedCorrect(correctCount);
        setAnimatedIncorrect(incorrectCount);
      }
    };
    
    animate();
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [correctCount, incorrectCount]);
  
  // Handle streak messages and display
  useEffect(() => {
    if (correctStreak >= 2 && correctStreak > prevStreak) {
      setShowStreakMessage(true);
      setPrevStreak(correctStreak);
    }
  }, [correctStreak, prevStreak]);
  
  // Show streak until a wrong answer or reset
  useEffect(() => {
    if (incorrectCount > 0 || totalAnswered === 0) {
      setShowStreakMessage(false);
    }
  }, [incorrectCount, totalAnswered]);
  
  const getStreakText = (streak: number) => {
    switch(streak) {
      case 2:
        return <><BsStars /> Double!</>;
      case 3:
        return <><FaFireAlt /> Triple!</>;
      case 4:
        return <><BsLightningChargeFill /> Quad!</>;
      case 5:
        return <><FaTrophy /> Penta!</>;
      case 6:
      case 7:
      case 8:
      case 9:
        return <><FaBrain /> {streak}x!</>;
      case 10:
        return <><FaTrophy /> Perfect 10!</>;
      default:
        return <><FaFireAlt /> {streak}x!</>;
    }
  };

  return (
    <div className={styles.progressWrapper}>
      <div className={styles.progressContainer}>
        {showStreakMessage && correctStreak >= 2 && (
          <div className={styles.streakMessage}>
            {getStreakText(correctStreak)}
          </div>
        )}
        
        <div className={styles.progressHeader}>
          <h3 className={styles.progressTitle}>
            <FaChartLine className={styles.titleIcon} /> 
            <span>Session Stats</span>
          </h3>
          {onReset && totalAnswered > 0 && (
            <button 
              className={styles.resetButton} 
              onClick={onReset}
              aria-label="Reset progress"
            >
              <FaRedo className={styles.resetIcon} /> Reset
            </button>
          )}
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <span className={`${styles.statIcon} ${styles.correct}`}>
              <FaCheckCircle />
            </span>
            <span className={styles.statValue}>{correctCount}</span>
          </div>
          
          <div className={styles.statItem}>
            <span className={`${styles.statIcon} ${styles.incorrect}`}>
              <FaTimesCircle />
            </span>
            <span className={styles.statValue}>{incorrectCount}</span>
          </div>
          
          {correctStreak >= 2 && (
            <div className={styles.statItem}>
              <span className={`${styles.statIcon} ${styles.streak}`}>
                <FaFireAlt />
              </span>
              <span className={styles.statValue}>{correctStreak}</span>
            </div>
          )}

          <div className={styles.statItem}>
            <span className={`${styles.statIcon} ${styles.mood}`}>
              {accuracy >= 70 ? <FaRegSmileBeam /> : <FaRegLightbulb />}
            </span>
            <span className={styles.statMood}>
              {accuracy >= 90 ? 'Excellent!' : 
               accuracy >= 70 ? 'Good!' : 
               accuracy >= 50 ? 'Keep Going!' : 'Keep Learning!'}
            </span>
          </div>
        </div>
        
        <div className={styles.progressBarsContainer}>
          <div>
            <div className={styles.barLabel}>
              <FaCheckCircle className={styles.correctIcon} /> Correct
            </div>
            <div className={styles.progressTrack}>
              <div 
                className={styles.correctProgress} 
                style={{ width: `${correctWidth}%` }}
              >
                {correctCount > 0 && (
                  <span className={styles.progressCount}>{animatedCorrect}/{TOTAL_QUESTIONS}</span>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className={styles.barLabel}>
              <FaTimesCircle className={styles.incorrectIcon} /> Incorrect
            </div>
            <div className={styles.progressTrack}>
              <div 
                className={styles.incorrectProgress} 
                style={{ width: `${incorrectWidth}%` }}
              >
                {incorrectCount > 0 && (
                  <span className={styles.progressCount}>{animatedIncorrect}/{TOTAL_QUESTIONS}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar; 