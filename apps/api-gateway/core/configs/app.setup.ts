import { INestApplication, ValidationPipe } from '@nestjs/common';
import { setGlobalPrefixAndRedirect } from './global-prefix.setup';
import cookieParser from 'cookie-parser';

export function appSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  app.use(cookieParser());
  setGlobalPrefixAndRedirect(app);
}
