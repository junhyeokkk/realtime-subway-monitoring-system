import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(compression());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('MetroWatch API')
    .setDescription('실시간 도시철도 운영·혼잡 관제 시스템 API')
    .setVersion('1.0.0')
    .addTag('Health')
    .addTag('Station')
    .addTag('Arrival')
    .addTag('Congestion')
    .addTag('Dashboard')
    .addTag('Alert')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT ?? 3000;
  console.log("listen port :", port)
  await app.listen(port);
}

bootstrap();