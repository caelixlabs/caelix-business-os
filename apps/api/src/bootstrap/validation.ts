import { ValidationPipe } from '@nestjs/common';

/**
 * Single source of truth for the app's global ValidationPipe config.
 */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  });
}
