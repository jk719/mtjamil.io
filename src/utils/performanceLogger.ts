interface PerformanceLog {
  startTime: number;
  message: string;
}

const performanceLogs: Map<string, PerformanceLog> = new Map();
const WARNING_THRESHOLD = 30000; // 30 seconds in milliseconds

const getTimestamp = (): string => {
  return new Date().toLocaleTimeString();
};

const getColor = (duration: number): string => {
  if (duration >= WARNING_THRESHOLD) {
    return '#FF0000'; // Red for over 30 seconds
  } else if (duration >= WARNING_THRESHOLD / 2) {
    return '#FFA500'; // Orange for over 15 seconds
  }
  return '#00FF00'; // Green for under 15 seconds
};

const logToTerminal = (message: string, duration: number): void => {
  const timestamp = getTimestamp();
  const color = duration >= WARNING_THRESHOLD ? '\x1b[31m' : // Red
                duration >= WARNING_THRESHOLD / 2 ? '\x1b[33m' : // Yellow
                '\x1b[32m'; // Green
  const reset = '\x1b[0m';
  
  console.log(`${color}[${timestamp}] ${message} - Duration: ${duration}ms${reset}`);
};

export const startPerformanceLog = (id: string, message: string): void => {
  performanceLogs.set(id, {
    startTime: Date.now(),
    message
  });
};

export const endPerformanceLog = (id: string): void => {
  const log = performanceLogs.get(id);
  if (!log) return;

  const duration = Date.now() - log.startTime;
  const timestamp = getTimestamp();
  const color = getColor(duration);

  // Log to browser console
  console.log(
    `%c[${timestamp}] ${log.message} - Duration: ${duration}ms`,
    `color: ${color}; font-weight: bold;`
  );

  // Log to terminal
  logToTerminal(log.message, duration);

  performanceLogs.delete(id);
};

export const logPerformance = (message: string, duration: number): void => {
  const timestamp = getTimestamp();
  const color = getColor(duration);

  // Log to browser console
  console.log(
    `%c[${timestamp}] ${message} - Duration: ${duration}ms`,
    `color: ${color}; font-weight: bold;`
  );

  // Log to terminal
  logToTerminal(message, duration);
}; 