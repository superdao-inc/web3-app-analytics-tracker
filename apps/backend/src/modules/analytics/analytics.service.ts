import { CustomLogger } from '@dev/nestjs-common';
import { Injectable } from '@nestjs/common';

import { ProducerService } from '../messageBroker/kafkaTransaction.producer';

@Injectable()
export class AnalyticsService {
  constructor(
    private producerService: ProducerService,
    private logger: CustomLogger,
  ) {
    this.logger = logger.createScope(AnalyticsService.name);
  }

  pushAnalyticsEvent(data: Record<string, unknown>, version: number) {
    try {
      this.producerService.publishAnalyticsEvent({
        version,
        data,
      });

      return true;
    } catch (error) {
      this.logger.error(
        new Error(
          '[AnalyticsServicePush] Error while pushing analytics event to kafka',
        ),
        { error, data },
      );

      return false;
    }
  }
}
