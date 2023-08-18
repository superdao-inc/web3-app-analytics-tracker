import { LoggerModule, TracerModule } from '@dev/nestjs-common';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { RequestLoggerInterceptor } from 'src/common/interceptors/requestLogger.interceptor';
import { TracerMiddleware } from 'src/common/middlewares/tracer.middleware';
import { config } from 'src/config';
import { validate } from 'src/env';
import { AnalyticsModule } from './analytics/analytics.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { MessageBrokerModule } from './messageBroker/transactionBroker.module';

const APP_MODULES = [
  ConfigModule.forRoot({ isGlobal: true, load: [() => config], validate }),
  TracerModule,
  LoggerModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
      const mode = configService.get<string>('NODE_ENV');
      const level = configService.get<string>('LOG_LEVEL');

      return { pretty: mode !== 'production', level };
    },
    inject: [ConfigService],
  }),
];

const DOMAIN_MODULES = [
  MaintenanceModule,
  AnalyticsModule,
  MessageBrokerModule,
];

@Module({
  controllers: [],
  providers: [{ provide: APP_INTERCEPTOR, useClass: RequestLoggerInterceptor }],
  imports: [...APP_MODULES, ...DOMAIN_MODULES],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TracerMiddleware).forRoutes('*');
  }
}
