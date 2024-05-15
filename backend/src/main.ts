import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
// import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // cors: true,
    // cors: {
    //   // only allow requests from this origin
    //   origin: 'http://localhost:8081',
    // }, // or set cors to true to allow all origins
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  // app.enableCors();

  /******************************************/
  /**************** Security ****************/
  /******************************************/
  // Helmet
  // app.use(helmet());

  /********************************************/
  /************* Logging Request **************/
  /********************************************/
  app.use((req, res, next) => {
    if (req) {
      Logger.debug(`${req.method} ${req.url}`);
    }
    next();
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,  // transform the incoming payload to the DTO object
    whitelist: true,  // strip away any extra properties that are not in the DTO
  }));

  await app.listen(3000);
}

bootstrap();
