import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/allExp.filter';
import * as cookieParser from 'cookie-parser'
import { WinstonModule } from 'nest-winston';
import { WinstonConfig } from './common/logger/logger.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    { logger: WinstonModule.createLogger(WinstonConfig) }
  );

  const httpAdapter = app.get(HttpAdapterHost)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))
  app.use(cookieParser());

  app.enableCors({ origin: 'http://localhost:3000', credentials: true });

  // Swagger Documentation
  const swagger = new DocumentBuilder()
    .setVersion('2.0')
    .setTitle("Wisal-API")
    .setDescription("Wisal API Documentation")
    .addServer("http://localhost:3000")
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
      name: 'refresh_token'
    })
    .build();
  const documentation = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup("swagger", app, documentation);



  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
