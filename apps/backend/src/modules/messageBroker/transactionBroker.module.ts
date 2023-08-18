import assert from 'node:assert';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, CustomClientOptions } from '@nestjs/microservices';

import { KAFKA_CLIENT_SERVICE } from 'src/kafka/constants';
import { ProducerService } from './kafkaTransaction.producer';

@Module({
  providers: [
    ProducerService,
    {
      provide: KAFKA_CLIENT_SERVICE,
      useFactory: (configService: ConfigService) => {
        const kafka = configService.get<CustomClientOptions>('kafka');
        assert(kafka);

        return ClientProxyFactory.create(kafka);
      },
      inject: [ConfigService],
    },
  ],
  exports: [KAFKA_CLIENT_SERVICE],
})
export class MessageBrokerModule {}
