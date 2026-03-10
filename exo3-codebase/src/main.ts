import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger UI — disponible sur http://localhost:3000/api
  const config = new DocumentBuilder()
    .setTitle('Documents API')
    .setDescription(
      'API de gestion de documents juridiques pour un cabinet d\'avocats.\n\n' +
      '**Workflow des statuts :** `draft` → `review` → `approved` / `rejected` → `archived`',
    )
    .setVersion('1.0')
    .addTag('documents', 'CRUD et gestion des documents juridiques')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env['PORT'] ?? 3000;
  await app.listen(port);
}

bootstrap();

