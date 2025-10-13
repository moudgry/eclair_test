import { NestFactory } from '@nestjs/core';
//import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { initializeDatabase } from './db/sequelize';
import { environment } from './environments/environment';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './app/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function bootstrap() {
  // Create NestJS application
  //const app: NestExpressApplication = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Eclair Commerce API')
    .setDescription('The e-commerce API for all platforms')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const logger = new Logger('Bootstrap');
  SwaggerModule.setup('api-docs', app, document);

  //console.log('Test env: ' + process.env.DB_PASSWORD_DEV);

  // Initialize database
  await initializeDatabase();

  // Add this before other middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
  });

  // Global pipes and filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS configuration
  app.enableCors({
    //origin: process.env.CORS_ORIGIN || '*',
    origin: true, // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix(environment.apiPath);

  await app.listen(environment.port);
  //console.log(`Backend running on http://localhost:${environment.port}${environment.apiPath}`);
  logger.log(`Backend running on http://localhost:${environment.port}${environment.apiPath}`);
}

bootstrap();
