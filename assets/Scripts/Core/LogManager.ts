// LogManager.ts
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class LogManager {
  private static currentLevel: LogLevel = LogLevel.DEBUG;

  // 设置当前日志级别
  public static setLogLevel(level: LogLevel) {
    this.currentLevel = level;
  }

  // 输出 DEBUG 级别的日志
  public static debug(message: string | number, ...optionalParams: any[]) {
    if (this.currentLevel <= LogLevel.DEBUG) {
      console.log('%c[DEBUG] %s', 'color:rgb(182, 178, 178);', message, ...optionalParams);
    }
  }
  // 输出 INFO 级别的日志
  public static info(message: string | number, ...optionalParams: any[]) {
    if (this.currentLevel <= LogLevel.INFO) {
      console.log('%c[INFO] %s', 'color:rgb(76, 37, 204);', message, ...optionalParams);
    }
  }
  // 输出 WARN 级别的日志
  public static warn(message: string | number, ...optionalParams: any[]) {
    if (this.currentLevel <= LogLevel.WARN) {
      console.log('%c[WARN] %s', 'color: #FFA500;', message, ...optionalParams);
    }
  }
  // 输出 ERROR 级别的日志
  public static error(message: string, ...optionalParams: any[]) {
    if (this.currentLevel <= LogLevel.ERROR) {
      console.log('%c[ERROR] %s', 'color: #FF0000;', message, ...optionalParams);
    }
  }
}

export { LogManager, LogLevel };
