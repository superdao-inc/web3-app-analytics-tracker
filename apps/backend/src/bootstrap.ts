import { CustomLogger } from '@dev/nestjs-common';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { json } from 'express';

import { config } from './config';
import { AppModule } from './modules/app.module';
import { useSwagger } from './swagger';

const AppVersion = '1.0';

export async function bootstrap(): Promise<INestApplication> {
  const logger = new CustomLogger('App', config.env.isDev);
  logger.level = config.env.LOG_LEVEL;

  process.on('unhandledRejection', (error: Error) => logger.error(error));

  const app = await NestFactory.create(AppModule, { logger, cors: true });

  app.enableCors({
    credentials: true,
    origin: false,
  });

  app.use(json({ limit: '250kb' }));

  app.useGlobalPipes(
    new ValidationPipe({ skipMissingProperties: false, transform: true }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: AppVersion,
  // });
  useSwagger(app, 'Tracker service', AppVersion);

  return app;
}
