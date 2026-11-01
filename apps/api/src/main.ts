import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API Version Prefix
  app.setGlobalPrefix('api/v1');

  // Cross-Origin Resource Sharing
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite Web dev
      'http://localhost:3000', // Web preview
      'http://localhost:8081', // Expo Web
      'http://127.0.0.1:5173',
      'https://papertrail.app', // Production Web
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global Request Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('PaperTrail Unified API')
    .setDescription('Centralized REST API for PaperTrail Web & Mobile Applications')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide your Clerk Session Bearer Token',
      },
      'clerk-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`🚀 PaperTrail API server running on: http://localhost:${port}/api/v1`);
  console.log(`📚 OpenAPI / Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
