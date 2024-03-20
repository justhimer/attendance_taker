import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,  // transform the incoming payload to the DTO object
    whitelist: true,  // strip away any extra properties that are not in the DTO
  }));

  await app.listen(3000);
}

bootstrap();
