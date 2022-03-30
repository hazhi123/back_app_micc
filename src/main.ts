import {
  json,
  urlencoded,
} from 'express';

import {
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';
import {
  SERVER_PORT,
  URL,
} from './config';
import { SocketAdapter } from './websocket/web-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new SocketAdapter(app));
  const logger = new Logger('Bootstrap')
  const options = new DocumentBuilder()
    .setTitle('MIS CENTROS COMERCIALES')
    .setDescription('Sistema para centros comerciales')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const config = app.get(ConfigService);
  const port = parseInt(config.get<string>(SERVER_PORT), 10) || 3000;

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.enableCors();

  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('v1/api');
  // await app.listen(port);
  await app.listen(port, URL);
  logger.log(`Server is running at ${await app.getUrl()}`);
}
bootstrap();
