import { Logger } from '@nestjs/common';
import { createApplication } from './bootstrap/create-application';
import { createValidationPipe } from './bootstrap/validation';
import { enableGracefulShutdown } from './bootstrap/database';
import { GlobalExceptionFilter } from './common/framework/filters';
import { ResponseInterceptor } from './common/framework/interceptors/response.interceptor';

async function bootstrap() {
  const app = await createApplication();

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  enableGracefulShutdown(app);

  const port = Number(process.env.PORT) || 3002;
  await app.listen(port);

  Logger.log(`API running at http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
