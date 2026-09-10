import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { resolveLogLevels } from './logger';

export async function createApplication() {
  const app = await NestFactory.create(AppModule, {
    logger: resolveLogLevels(),
  });

  app.enableCors({
    origin: (
      process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:3001'
    ).split(','),
    credentials: true,
  });

  return app;
}
