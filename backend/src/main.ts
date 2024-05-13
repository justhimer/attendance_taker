import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const functionName = 'bootstrap';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // cors: {
    //   // only allow requests from this origin
    //   origin: 'http://localhost:8081',
    // }, // or set cors to true to allow all origins
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  // app.enableCors();  // to be disabled in production

  /******************************************/
  /**************** Security ****************/
  /******************************************/
  // Helmet
  app.use(helmet());

  // Global CSRF Protection
  app.use(cookieParser());

  const csrfProtection = csurf({
    cookie: {
      // default -> key: '_csrf',
      // default -> httpOnly: true,
      // default -> secure: true,
      // default -> sameSite: 'lax',
      sameSite: 'strict',
    },
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
  });

  /********************************************/
  /************* Logging Request **************/
  /********************************************/
  app.use((req, res, next) => {
    if (req) {
      Logger.debug(`${req.method} ${req.url}`);
    }
    // excluding routes from csrfProtection
    const excludedRoutes = [
      '/auth/csrf-token',
    ];
    if (excludedRoutes.some((route) => req.path.startsWith(route))) {
      Logger.log(
        `Excluded route (${req.path}) from global CSRF protection...`,
        functionName,
      );
      return next();
    }

    // use csrfProtection for all other routes
    Logger.log('Using global CSRF protection...', functionName);
    csrfProtection(req, res, next);
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,  // transform the incoming payload to the DTO object
    whitelist: true,  // strip away any extra properties that are not in the DTO
  }));

  await app.listen(3000);
}

bootstrap();
