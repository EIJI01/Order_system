import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);
  private readonly logFile = 'logs/app.log';

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode, statusMessage } = res;
      const responseTime = Date.now();
      const durationMs = responseTime - startTime;

      const duration = this.getDurationTime(durationMs);
      const timestamp = new Date()
        .toISOString()
        .replace('T', ' ')
        .split('.')[0];
      const logLevel =
        statusCode >= 500 ? '[ERROR]' : statusCode >= 400 ? '[WARN]' : '[INFO]';

      const logMessage = [
        `[${timestamp}] ${logLevel} [${req.method}] ${req.originalUrl} - ${statusCode} ${statusMessage} - ${duration}`,
      ].join('\n');

      this.write(logMessage);

      this.logger.log(logMessage);
    });

    next();
  }

  private getDurationTime(durationMs: number): string {
    if (durationMs >= 3600000) return `${(durationMs / 3600000).toFixed(2)} hr`;
    if (durationMs >= 60000) return `${(durationMs / 60000).toFixed(2)} min`;
    if (durationMs >= 1000) return `${(durationMs / 1000).toFixed(2)} s`;
    return `${durationMs} ms`;
  }

  private write(message: string) {
    if (!existsSync('logs')) {
      mkdirSync('logs');
    }
    appendFileSync(this.logFile, message + '\n\n');
  }
}
