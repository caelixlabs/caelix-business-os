import { ValidationPipe } from '@nestjs/common';
import { createApplication } from './bootstrap/create-application';
import { GlobalExceptionFilter } from './common/framework/filters';
import { ResponseInterceptor } from './common/framework/interceptors/response.interceptor';

async function bootstrap() {
  const app = await createApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(
    new GlobalExceptionFilter(),
  );
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
  )
  const port = Number(process.env.PORT) || 3002;
  await app.listen(port);
  console.log(process.env.DATABASE_URL);
  console.log(`API running at http://localhost:${port}`);
}
bootstrap();
