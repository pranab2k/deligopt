// src/notifications/cronHelper.ts
import parser from 'cron-parser';

export function getNextExecutionTime(cronExpression: string): Date {
  const interval = parser.parseExpression(cronExpression);
  return interval.next().toDate();
}
