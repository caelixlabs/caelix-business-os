import { INestApplication } from '@nestjs/common';

/**
 * Ensures PrismaService.onModuleDestroy() actually runs when the
 * process receives a termination signal (SIGTERM/SIGINT), so
 * connections are closed cleanly on deploy/restart instead of being
 * dropped mid-query.
 */
export function enableGracefulShutdown(app: INestApplication): void {
  app.enableShutdownHooks();
}
