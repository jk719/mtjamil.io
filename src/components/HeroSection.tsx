import { useState, useEffect } from 'react';
import styles from '@/styles/HeroSection.module.css';
import ProgressBar from './ProgressBar';
import { 
  FaBrain,
  FaLightbulb,
  FaCheck,
  FaXmark,
  FaArrowRight,
  FaCalculator,
  FaInfinity,
  FaChartLine,
  FaEquals
} from 'react-icons/fa6';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Function to format mathematical expressions with LaTeX
const formatMath = (text: string): string => {
  // Replace basic math expressions with LaTeX
  return text
    .replace(/√\((.*?)\)/g, '\\sqrt{$1}')
    .replace(/(\w+)²/g, '$1^2')
    .replace(/(\w+)³/g, '$1^3')
    .replace(/(\w+)₁/g, '$1_1')
    .replace(/(\w+)₂/g, '$1_2')
    .replace(/(\w+)ₙ/g, '$1_n')
    .replace(/π/g, '\\pi');
};

// Sample SAT math questions
const sampleQuestions = [
  {
    question: "What is the slope-intercept form of a linear equation?",
    options: ["y = mx + b", "y = b + mx", "y = x + m", "y = bx + m"],
    correct: "y = mx + b",
    category: "Key Formulas",
    explanation: "The slope-intercept form is $y = mx + b$, where $m$ is the slope and $b$ is the y-intercept."
  },
  {
    question: "What is the quadratic formula?",
    options: [
      "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
      "x = \\frac{-b \\pm \\sqrt{b^2 + 4ac}}{2a}",
      "x = \\frac{b \\pm \\sqrt{b^2 - 4ac}}{2a}",
      "x = \\frac{-a \\pm \\sqrt{b^2 - 4ac}}{2b}"
    ],
    correct: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    category: "Key Formulas",
    explanation: "The quadratic formula is used to solve $ax^2 + bx + c = 0$ equations. The solution is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$."
  },
  {
    question: "What is the formula for the area of a circle?",
    options: ["A = \\pi r^2", "A = 2\\pi r", "A = \\pi d", "A = \\pi r"],
    correct: "A = \\pi r^2",
    category: "Geometry",
    explanation: "The area of a circle is $A = \\pi r^2$, where $r$ is the radius of the circle."
  },
  {
    question: "What is the distance formula between two points?",
    options: [
      "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}",
      "d = (x_2-x_1) + (y_2-y_1)",
      "d = \\sqrt{x_2-x_1} + \\sqrt{y_2-y_1}",
      "d = (x_2-x_1)^2 + (y_2-y_1)^2"
    ],
    correct: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}",
    category: "Key Formulas",
    explanation: "The distance formula $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$ is derived from the Pythagorean theorem $a^2 + b^2 = c^2$."
  },
  {
    question: "What is the formula for the volume of a cylinder?",
    options: ["V = \\pi r^2 h", "V = 2\\pi r h", "V = \\pi r h", "V = \\frac{4}{3}\\pi r^3"],
    correct: "V = \\pi r^2 h",
    category: "Geometry",
    explanation: "The volume of a cylinder is $V = \\pi r^2 h$, where $r$ is the radius of the base and $h$ is the height."
  },
  {
    question: "What is the midpoint formula?",
    options: [
      "(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2})",
      "(x_2-x_1, y_2-y_1)",
      "(\\frac{x_1-x_2}{2}, \\frac{y_1-y_2}{2})",
      "(x_1 x_2, y_1 y_2)"
    ],
    correct: "(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2})",
    category: "Key Formulas",
    explanation: "The midpoint formula $(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2})$ calculates the point exactly halfway between two points."
  },
  {
    question: "What is the formula for the area of a triangle?",
    options: ["A = \\frac{1}{2}bh", "A = bh", "A = \\frac{1}{2}b^2", "A = b + h"],
    correct: "A = \\frac{1}{2}bh",
    category: "Geometry",
    explanation: "The area of a triangle is $A = \\frac{1}{2}bh$, where $b$ is the base and $h$ is the height."
  },
  {
    question: "What is the formula for arithmetic sequence?",
    options: ["a_n = a_1 + (n-1)d", "a_n = a_1 \\times d^{n-1}", "a_n = a_1 + nd", "a_n = a_1 d"],
    correct: "a_n = a_1 + (n-1)d",
    category: "Sequences",
    explanation: "In arithmetic sequences, the formula $a_n = a_1 + (n-1)d$ finds the $n$-th term by adding the common difference $d$ exactly $(n-1)$ times to the first term $a_1$."
  },
  {
    question: "What is the formula for geometric sequence?",
    options: ["a_n = a_1 \\times r^{n-1}", "a_n = a_1 + (n-1)r", "a_n = a_1 r", "a_n = a_1 \\times n \\times r"],
    correct: "a_n = a_1 \\times r^{n-1}",
    category: "Sequences",
    explanation: "In geometric sequences, the formula $a_n = a_1 \\times r^{n-1}$ finds the $n$-th term by multiplying the first term $a_1$ by the common ratio $r$ raised to the power of $(n-1)$."
  },
  {
    question: "What is the formula for the slope between two points?",
    options: ["m = \\frac{y_2-y_1}{x_2-x_1}", "m = \\frac{x_2-x_1}{y_2-y_1}", "m = \\frac{y_2}{x_2}", "m = \\frac{x_1 y_2}{x_2 y_1}"],
    correct: "m = \\frac{y_2-y_1}{x_2-x_1}",
    category: "Key Formulas",
    explanation: "The slope formula $m = \\frac{y_2-y_1}{x_2-x_1}$ calculates the rate of change between two points $(x_1, y_1)$ and $(x_2, y_2)$."
  }
];

export default function HeroSection() {
  const [currentQuestion, setCurrentQuestion] = useState(sampleQuestions[0]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // New state for tracking progress
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  // Track streak of correct answers
  const [correctStreak, setCorrectStreak] = useState(0);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sampleQuestions.length);
    setCurrentQuestion(sampleQuestions[randomIndex]);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
    
    // Load progress from localStorage if available
    const savedCorrect = localStorage.getItem('correctCount');
    const savedIncorrect = localStorage.getItem('incorrectCount');
    const savedTotal = localStorage.getItem('totalAnswered');
    const savedStreak = localStorage.getItem('correctStreak');
    
    if (savedCorrect && savedIncorrect && savedTotal) {
      setCorrectCount(parseInt(savedCorrect));
      setIncorrectCount(parseInt(savedIncorrect));
      setTotalAnswered(parseInt(savedTotal));
    }
    
    if (savedStreak) {
      setCorrectStreak(parseInt(savedStreak));
    }
  }, []);
  
  // Save progress to localStorage when counts change
  useEffect(() => {
    if (totalAnswered > 0) {
      localStorage.setItem('correctCount', correctCount.toString());
      localStorage.setItem('incorrectCount', incorrectCount.toString());
      localStorage.setItem('totalAnswered', totalAnswered.toString());
      localStorage.setItem('correctStreak', correctStreak.toString());
    }
  }, [correctCount, incorrectCount, totalAnswered, correctStreak]);

  const handleAnswerSelect = (answer: string) => {
    const correct = answer === currentQuestion.correct;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowExplanation(true);
    
    // Update progress counts
    if (correct) {
      setCorrectCount(prev => prev + 1);
      setCorrectStreak(prev => prev + 1); // Increase streak on correct answer
    } else {
      setIncorrectCount(prev => prev + 1);
      setCorrectStreak(0); // Reset streak on incorrect answer
    }
    setTotalAnswered(prev => prev + 1);
  };

  const renderExplanation = () => {
    if (!selectedAnswer) return null;

    const isCorrect = selectedAnswer === currentQuestion.correct;
    const icon = isCorrect ? <FaCheck className={styles.explanationIcon} /> : <FaXmark className={styles.explanationIcon} />;
    const feedback = isCorrect ? "Correct!" : "Incorrect.";

    // Process explanation text for LaTeX
    let explanationText = currentQuestion.explanation;
    
    // Look for LaTeX expressions in the explanation
    const latexPattern = /\$(.*?)\$/g;
    const matches = explanationText.match(latexPattern);
    
    if (matches) {
      // Replace LaTeX expressions with rendered KaTeX
      matches.forEach(match => {
        const formula = match.substring(1, match.length - 1);
        try {
          const html = katex.renderToString(formula, {
            throwOnError: false,
            displayMode: false
          });
          explanationText = explanationText.replace(
            match, 
            `<span class="${styles.formula}">${html}</span>`
          );
        } catch (error) {
          console.error('KaTeX error:', error);
        }
      });
      
      return (
        <div className={`${styles.explanation} ${isCorrect ? styles.correct : styles.incorrect}`}>
          {icon}
          <div>
            <strong>{feedback}</strong>
            <p 
              className={styles.explanationText} 
              dangerouslySetInnerHTML={{ __html: explanationText }}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={`${styles.explanation} ${isCorrect ? styles.correct : styles.incorrect}`}>
        {icon}
        <div>
          <strong>{feedback}</strong>
          <p className={styles.explanationText}>{explanationText}</p>
        </div>
      </div>
    );
  };

  // Function to render LaTeX formula
  const renderFormula = (formula: string) => {
    try {
      const html = katex.renderToString(formula, {
        throwOnError: false,
        displayMode: false
      });
      return <span className={styles.formula} dangerouslySetInnerHTML={{ __html: html }} />;
    } catch (error) {
      console.error('KaTeX error:', error);
      return <span>{formula}</span>;
    }
  };

  // Function to reset progress stats
  const handleResetStats = () => {
    setCorrectCount(0);
    setIncorrectCount(0);
    setTotalAnswered(0);
    setCorrectStreak(0); // Reset streak on stats reset
    localStorage.removeItem('correctCount');
    localStorage.removeItem('incorrectCount');
    localStorage.removeItem('totalAnswered');
    localStorage.removeItem('correctStreak');
  };

  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        {/* Add progress bar at the top */}
        <ProgressBar 
          correctCount={correctCount} 
          incorrectCount={incorrectCount} 
          totalAnswered={totalAnswered}
          correctStreak={correctStreak} // Pass the streak to ProgressBar
          onReset={handleResetStats}
        />
        
        <div className={styles.questionHeader}>
          <FaEquals className={styles.categoryIcon} />
          <span className={styles.category}>{currentQuestion.category}</span>
        </div>
        
        <h3 className={styles.question}>{currentQuestion.question}</h3>
        
        <div className={styles.options}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`${styles.option} ${
                selectedAnswer === option
                  ? isCorrect
                    ? styles.correct
                    : styles.incorrect
                  : ''
              }`}
              onClick={() => handleAnswerSelect(option)}
              disabled={showExplanation}
            >
              {renderFormula(option)}
            </button>
          ))}
        </div>

        {renderExplanation()}

        {showExplanation && (
          <button 
            className={styles.nextButton}
            onClick={() => {
              const randomIndex = Math.floor(Math.random() * sampleQuestions.length);
              setCurrentQuestion(sampleQuestions[randomIndex]);
              setSelectedAnswer(null);
              setIsCorrect(null);
              setShowExplanation(false);
            }}
          >
            Next Question
            <FaArrowRight className={styles.buttonIcon} />
          </button>
        )}
      </div>
    </div>
  );
} 