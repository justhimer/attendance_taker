import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as csurf from 'csurf';

@Injectable()
export class CsrfMiddlewareForGettingToken implements NestMiddleware {
  // By default, csurf ignore methods: ['GET', 'HEAD', 'OPTIONS'].
  // We do want to ignore GET method for route /auth/csrf-token
  private csrfProtectionForGettingTokenOnly = csurf({
    cookie: { sameSite: 'strict' },
  });

  use(req: Request, res: Response, next: NextFunction) {
    Logger.log(
      'Using CSRF protection for getting token...',
      'CsrfMiddleware',
    );
    this.csrfProtectionForGettingTokenOnly(req, res, next);
  }
}