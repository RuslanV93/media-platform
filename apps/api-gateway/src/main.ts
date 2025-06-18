import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from '../core/configs/app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSetup(app);
  const port = process.env.PORT;
  await app.listen(port ?? 3000);
  console.log(`🚀 API Gateway running on: http://localhost:${port}/api`);
}
bootstrap();
