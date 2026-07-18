import { createApplication } from './bootstrap/create-application';

async function bootstrap() {
  const app = await createApplication();
  const port = Number(process.env.PORT) || 3002;
  await app.listen(port);
  console.log(`🚀 API running at http://localhost:${port}`);
}
bootstrap();