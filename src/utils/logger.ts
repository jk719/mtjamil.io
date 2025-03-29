export const getTimestamp = (): string => {
  return new Date().toISOString();
};

export const logWithTimestamp = (message: string, ...args: any[]): void => {
  const timestamp = getTimestamp();
  console.log(`[${timestamp}] ${message}`, ...args);
};

export const errorWithTimestamp = (message: string, ...args: any[]): void => {
  const timestamp = getTimestamp();
  console.error(`[${timestamp}] ERROR: ${message}`, ...args);
};

export const warnWithTimestamp = (message: string, ...args: any[]): void => {
  const timestamp = getTimestamp();
  console.warn(`[${timestamp}] WARNING: ${message}`, ...args);
}; 