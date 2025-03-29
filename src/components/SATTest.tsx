import React from 'react';
import styles from '@/styles/SATTest.module.css';
import { 
  FaCalculator, 
  FaClock, 
  FaQuestionCircle, 
  FaBook, 
  FaListCheck, 
  FaArrowRight,
  FaSquareRootAlt,
  FaChartLine,
  FaShapes,
  FaExclamationTriangle
} from 'react-icons/fa6';

const SATTest = () => {
  return (
    <div className={styles.testContainer}>
      <div className={styles.header}>
        <h2>SAT Math Module 1</h2>
        <div className={styles.badge}>Practice Test</div>
      </div>

      <div className={styles.testInfo}>
        <div className={styles.infoCard}>
          <FaClock className={styles.icon} />
          <div>
            <h4>Time Limit</h4>
            <p>35 minutes</p>
          </div>
        </div>
        <div className={styles.infoCard}>
          <FaQuestionCircle className={styles.icon} />
          <div>
            <h4>Questions</h4>
            <p>22</p>
          </div>
        </div>
        <div className={styles.infoCard}>
          <FaCalculator className={styles.icon} />
          <div>
            <h4>Calculator</h4>
            <p>Allowed</p>
          </div>
        </div>
      </div>
      
      <div className={styles.testSections}>
        <div className={styles.section}>
          <h3><FaBook className={styles.sectionIcon} /> Topics Covered</h3>
          <ul>
            <li><FaSquareRootAlt className={styles.listIcon} /> Algebra</li>
            <li><FaChartLine className={styles.listIcon} /> Advanced Math</li>
            <li><FaListCheck className={styles.listIcon} /> Problem-Solving and Data Analysis</li>
            <li><FaShapes className={styles.listIcon} /> Geometry and Trigonometry</li>
          </ul>
        </div>
        
        <div className={styles.section}>
          <h3><FaExclamationTriangle className={styles.sectionIcon} /> Test Instructions</h3>
          <ul>
            <li>You may use a calculator</li>
            <li>Show your work for all questions</li>
            <li>Answer all questions within the time limit</li>
            <li>You cannot return to previous questions</li>
          </ul>
        </div>
      </div>

      <button className={styles.startButton}>
        Start Math Module 1
        <FaArrowRight className={styles.buttonIcon} />
      </button>
    </div>
  );
};

export default SATTest; 