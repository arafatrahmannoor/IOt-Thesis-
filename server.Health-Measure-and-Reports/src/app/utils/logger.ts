type LogLevel = "info" | "warn" | "error" | "debug";

interface LogMessage {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: Date;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== "production";
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const emoji = this.getEmoji(level);
    const dataString = data ? ` | Data: ${JSON.stringify(data)}` : "";
    return `[${timestamp}] ${emoji} ${level.toUpperCase()}: ${message}${dataString}`;
  }

  private getEmoji(level: LogLevel): string {
    const emojis = {
      info: "ℹ️",
      warn: "⚠️",
      error: "❌",
      debug: "🐛",
    };
    return emojis[level] || "ℹ️";
  }

  info(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage("info", message, data));
    }
  }

  warn(message: string, data?: any): void {
    console.warn(this.formatMessage("warn", message, data));
  }

  error(message: string, data?: any): void {
    console.error(this.formatMessage("error", message, data));
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage("debug", message, data));
    }
  }

  success(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(
        `${new Date().toISOString()} ✅ SUCCESS: ${message}${data ? ` | Data: ${JSON.stringify(data)}` : ""}`,
      );
    }
  }
}

export const logger = new Logger();
export default logger;
