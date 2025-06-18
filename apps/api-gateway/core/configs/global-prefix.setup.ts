import { INestApplication } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function setGlobalPrefixAndRedirect(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/') {
      return res.redirect('/api');
    }
    next();
  });
}
