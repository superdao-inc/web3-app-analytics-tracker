import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { KAFKA_CLIENT_SERVICE } from 'src/kafka/constants';
import { Topics } from 'src/kafka/topics';
import { AnalyticsEventMessage } from 'src/modules/analytics/analytics.types';
import { log } from 'src/utils/logger';

@Injectable()
export class ProducerService {
  constructor(
    @Inject(KAFKA_CLIENT_SERVICE) private readonly client: ClientKafka,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  private publish(topic: Topics, msg: AnalyticsEventMessage): void {
    try {
      this.client.emit(topic, msg);
      log.log(`[ProducerService] Sent message to Kafka:`, { msg });
    } catch (error) {
      log.error(
        new Error('[ProducerService] Failed to send message to Kafka'),
        { error, msg },
      );
    }
  }

  publishAnalyticsEvent(analyticsEventMessage: AnalyticsEventMessage): void {
    this.publish(Topics.TrackerDirtyEvents, analyticsEventMessage);
  }
}
