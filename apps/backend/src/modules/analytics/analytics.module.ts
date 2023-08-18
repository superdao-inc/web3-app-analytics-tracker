import { Module } from '@nestjs/common';

import { ProducerService } from '../messageBroker/kafkaTransaction.producer';
import { MessageBrokerModule } from '../messageBroker/transactionBroker.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [MessageBrokerModule],
  providers: [AnalyticsService, ProducerService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
