import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/allExp.filter';
import * as cookieParser from 'cookie-parser';
import { WinstonModule } from 'nest-winston';
import { WinstonConfig } from './common/logger/logger.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(WinstonConfig),
  });

  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.use(cookieParser());

  app.enableCors({
    origin: ['https://wisal-um47q.ondigitalocean.app', 'http://localhost:3000'],
    credentials: true,
  });

  // Swagger
  const swagger = new DocumentBuilder()
    .setVersion('2.2')
    .setTitle('Wisal-API')
    .setDescription('Wisal API Documentation')
    .addServer('https://wisal-um47q.ondigitalocean.app')
    .addServer('http://localhost:8080')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearer',
    )
    .addSecurity('cookieAuth', {
      type: 'apiKey',
      in: 'cookie',
      name: 'refresh_token',
    })
    .build();

  const documentation = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('swagger', app, documentation);

  const port = 8080;
  await app.listen(port || 3000);
}

bootstrap();
