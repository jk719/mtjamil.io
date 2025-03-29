import { FaCheck, FaXmark, FaRotateLeft, FaFire } from 'react-icons/fa6';
import styles from '@/styles/ProgressBar.module.css';
import { useEffect, useState, useRef } from 'react';

interface ProgressBarProps {
  correctCount: number;
  incorrectCount: number;
  totalAnswered: number;
  correctStreak: number;
  onReset?: () => void;
}

export default function ProgressBar({ correctCount, incorrectCount, totalAnswered, correctStreak, onReset }: ProgressBarProps) {
  // Animate counts
  const [animatedCorrect, setAnimatedCorrect] = useState(0);
  const [animatedIncorrect, setAnimatedIncorrect] = useState(0);
  const [prevScaleFactor, setPrevScaleFactor] = useState(1);
  const [prevCorrect, setPrevCorrect] = useState(0);
  const [prevIncorrect, setPrevIncorrect] = useState(0);
  const [streakMessage, setStreakMessage] = useState('');
  const [showStreakMessage, setShowStreakMessage] = useState(false);
  const isInitialRender = useRef(true);
  
  // Handle streak messages
  useEffect(() => {
    // Only show streak messages for streaks of 2 or more
    if (correctStreak >= 2) {
      let message = '';
      
      // Determine the streak message based on streak count
      switch (correctStreak) {
        case 2:
          message = 'DOUBLE!';
          break;
        case 3:
          message = 'TRIPLE!';
          break;
        case 4:
          message = 'QUADRUPLE!';
          break;
        case 5:
          message = 'QUINTUPLE!';
          break;
        default:
          message = `${correctStreak}x STREAK!`;
          break;
      }
      
      setStreakMessage(message);
      setShowStreakMessage(true);
      
      // Hide the streak message after 2 seconds
      const timer = setTimeout(() => {
        setShowStreakMessage(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [correctStreak]);

  useEffect(() => {
    // Animate the counts upward smoothly with a slight delay
    if (correctCount > prevCorrect) {
      // If count increased, animate smoothly to the new value
      let startValue = prevCorrect;
      const step = Math.max(1, Math.floor((correctCount - prevCorrect) / 10));
      const timer = setInterval(() => {
        startValue = Math.min(startValue + step, correctCount);
        setAnimatedCorrect(startValue);
        if (startValue >= correctCount) {
          clearInterval(timer);
        }
      }, 50);
      return () => clearInterval(timer);
    } else if (correctCount < prevCorrect) {
      // If reset or decreased, update immediately
      setAnimatedCorrect(correctCount);
    }
    setPrevCorrect(correctCount);
  }, [correctCount, prevCorrect]);
  
  useEffect(() => {
    // Similar animation for incorrect count
    if (incorrectCount > prevIncorrect) {
      let startValue = prevIncorrect;
      const step = Math.max(1, Math.floor((incorrectCount - prevIncorrect) / 10));
      const timer = setInterval(() => {
        startValue = Math.min(startValue + step, incorrectCount);
        setAnimatedIncorrect(startValue);
        if (startValue >= incorrectCount) {
          clearInterval(timer);
        }
      }, 50);
      return () => clearInterval(timer);
    } else if (incorrectCount < prevIncorrect) {
      setAnimatedIncorrect(incorrectCount);
    }
    setPrevIncorrect(incorrectCount);
  }, [incorrectCount, prevIncorrect]);
  
  // Calculate scaling factor based on the highest count
  const maxOfBothCounts = Math.max(correctCount, incorrectCount);
  const getScaleFactor = () => {
    // Always show at least one full segment if there are any counts
    if (maxOfBothCounts <= 10) return 1; // 1 segment = 1 count (up to 10)
    if (maxOfBothCounts <= 30) return 3; // 1 segment = 3 counts (up to 30)
    if (maxOfBothCounts <= 100) return 10; // 1 segment = 10 counts (up to 100)
    if (maxOfBothCounts <= 300) return 30; // 1 segment = 30 counts (up to 300)
    if (maxOfBothCounts <= 1000) return 100; // 1 segment = 100 counts (up to 1000)
    
    // For very large numbers, scale to show at least 5 segments
    return Math.ceil(maxOfBothCounts / 5);
  };

  const scaleFactor = getScaleFactor();
  
  // Track scale factor changes
  useEffect(() => {
    if (!isInitialRender.current && scaleFactor !== prevScaleFactor) {
      // Reset animations when scale changes
      setAnimatedCorrect(0);
      setAnimatedIncorrect(0);
      
      // Add a class to trigger scale change animation
      const container = document.querySelector(`.${styles.progressContainer}`);
      container?.classList.add(styles.scaleChange);
      
      // Remove the class after animation completes
      setTimeout(() => {
        container?.classList.remove(styles.scaleChange);
        // Restart count animations after scale change completes
        setAnimatedCorrect(correctCount);
        setAnimatedIncorrect(incorrectCount);
      }, 600);
    }
    
    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
    
    setPrevScaleFactor(scaleFactor);
  }, [scaleFactor, prevScaleFactor, correctCount, incorrectCount]);
  
  // Generate segments for the bars
  const generateSegments = (count: number) => {
    // Calculate how many full segments to show (max 10)
    const fullSegments = Math.min(Math.floor(count / scaleFactor), 10);
    
    // If there's a partial segment, calculate how full it should be
    const partialSegmentFill = count % scaleFactor === 0 ? 0 : (count % scaleFactor) / scaleFactor;
    
    return { fullSegments, partialSegmentFill };
  };

  const correctSegments = generateSegments(correctCount);
  const incorrectSegments = generateSegments(incorrectCount);
  
  // Make the scale indicator more descriptive based on the scale factor
  const getScaleDescription = () => {
    if (scaleFactor === 1) return null;
    
    if (maxOfBothCounts <= 30) return `Scale: 1 segment = ${scaleFactor}`;
    if (maxOfBothCounts <= 100) return `Scale: 1 segment = ${scaleFactor}`;
    if (maxOfBothCounts <= 300) return `Scale: x${scaleFactor}`;
    return `Scale: x${scaleFactor}`;
  };

  const scaleDescription = getScaleDescription();
  
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <h4 className={styles.progressTitle}>Your Progress</h4>
        {onReset && totalAnswered > 0 && (
          <button className={styles.resetButton} onClick={onReset}>
            <FaRotateLeft className={styles.resetIcon} />
            Reset
          </button>
        )}
      </div>
      
      <div className={styles.progressStats}>
        <div className={styles.stat}>
          <FaCheck className={styles.correctIcon} />
          <span>{correctCount} Correct</span>
          {correctStreak >= 2 && (
            <div className={styles.streakIndicator}>
              <FaFire className={styles.fireIcon} />
              <span>{correctStreak} streak</span>
            </div>
          )}
          {scaleDescription && (
            <span className={styles.scaleIndicator}>
              {scaleDescription}
            </span>
          )}
        </div>
        <div className={styles.stat}>
          <FaXmark className={styles.incorrectIcon} />
          <span>{incorrectCount} Incorrect</span>
        </div>
      </div>
      
      <div className={styles.progressBars}>
        <div className={styles.progressBarWrapper}>
          <div className={styles.label}>Correct</div>
          <div className={styles.barContainer}>
            {/* Streak message overlay */}
            {showStreakMessage && streakMessage && (
              <div className={styles.streakMessage}>
                {streakMessage}
              </div>
            )}
            
            {/* Render 10 segment blocks */}
            <div className={styles.segmentedBar}>
              {[...Array(10)].map((_, index) => (
                <div 
                  key={`correct-${index}`} 
                  className={`${styles.segment} ${
                    index < correctSegments.fullSegments 
                      ? styles.correctSegmentFull 
                      : index === correctSegments.fullSegments && correctSegments.partialSegmentFill > 0
                        ? styles.correctSegmentPartial
                        : ''
                  }`}
                  style={{
                    ...(index === correctSegments.fullSegments && correctSegments.partialSegmentFill > 0
                      ? { '--fill-percent': `${correctSegments.partialSegmentFill * 100}%` } as React.CSSProperties
                      : {}),
                    ...(index < correctSegments.fullSegments 
                      ? { animationDelay: `${index * 0.1}s` } as React.CSSProperties
                      : {})
                  }}
                >
                  {/* Only show the total count in the last visible segment (adjust logic) */}
                  {((correctSegments.fullSegments > 0 && index === Math.max(0, correctSegments.fullSegments - 1)) ||
                   (correctSegments.fullSegments === 0 && correctSegments.partialSegmentFill > 0 && index === 0)) && (
                    <span className={styles.totalCount}>
                      {animatedCorrect}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles.progressBarWrapper}>
          <div className={styles.label}>Incorrect</div>
          <div className={styles.barContainer}>
            {/* Render 10 segment blocks */}
            <div className={styles.segmentedBar}>
              {[...Array(10)].map((_, index) => (
                <div 
                  key={`incorrect-${index}`} 
                  className={`${styles.segment} ${
                    index < incorrectSegments.fullSegments 
                      ? styles.incorrectSegmentFull 
                      : index === incorrectSegments.fullSegments && incorrectSegments.partialSegmentFill > 0
                        ? styles.incorrectSegmentPartial
                        : ''
                  }`}
                  style={{
                    ...(index === incorrectSegments.fullSegments && incorrectSegments.partialSegmentFill > 0
                      ? { '--fill-percent': `${incorrectSegments.partialSegmentFill * 100}%` } as React.CSSProperties
                      : {}),
                    ...(index < incorrectSegments.fullSegments 
                      ? { animationDelay: `${index * 0.1}s` } as React.CSSProperties
                      : {})
                  }}
                >
                  {/* Only show the total count in the last visible segment (adjust logic) */}
                  {((incorrectSegments.fullSegments > 0 && index === Math.max(0, incorrectSegments.fullSegments - 1)) ||
                   (incorrectSegments.fullSegments === 0 && incorrectSegments.partialSegmentFill > 0 && index === 0)) && (
                    <span className={styles.totalCount}>
                      {animatedIncorrect}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 