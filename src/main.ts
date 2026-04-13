import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/allExp.filter';
import * as cookieParser from 'cookie-parser';
import { WinstonModule } from 'nest-winston';
import { WinstonConfig } from './common/logger/logger.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(WinstonConfig),
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');

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
  app.use(helmet());

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  const swagger = new DocumentBuilder()
    .setVersion('2.2')
    .setTitle('Wisal-API')
    .setDescription('Wisal API Documentation')
    .addServer(corsOrigin)
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

  await app.listen(port);
}

bootstrap();

