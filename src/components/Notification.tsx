import { useEffect, useState } from 'react';
import { FaCheck, FaXmark, FaInfo, FaExclamation } from 'react-icons/fa6';
import styles from '@/styles/Notification.module.css';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  type: NotificationType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export default function Notification({ 
  type, 
  message, 
  duration = 3000, 
  onClose 
}: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) {
        setTimeout(onClose, 300); // Allow for exit animation
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck className={styles.icon} />;
      case 'error':
        return <FaXmark className={styles.icon} />;
      case 'info':
        return <FaInfo className={styles.icon} />;
      case 'warning':
        return <FaExclamation className={styles.icon} />;
      default:
        return null;
    }
  };

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Allow for exit animation
    }
  };

  return (
    <div 
      className={`${styles.notification} ${styles[type]} ${visible ? styles.visible : styles.hidden}`}
      role="alert"
    >
      <div className={styles.content}>
        {getIcon()}
        <span className={styles.message}>{message}</span>
      </div>
      <button className={styles.closeButton} onClick={handleClose} aria-label="Close notification">
        <FaXmark />
      </button>
    </div>
  );
} 