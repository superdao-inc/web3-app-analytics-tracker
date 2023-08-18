import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { cleanEnv, num, str } from 'envalid';

const scope = process.env.NODE_ENV ?? 'development';

dotenv.config({ path: `.env.${scope}`, override: true });
dotenv.config({ path: `.env.${scope}.local`, override: true });

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging'],
    default: 'development',
  }),
  PORT: num(),
  LOG_LEVEL: str({
    choices: [
      /* 60 */ 'fatal',
      /* 50 */ 'error',
      /* 40 */ 'warn',
      /* 30 */ 'info',
      /* 20 */ 'debug',
      /* 10 */ 'trace',
    ],
    default: 'info',
  }),
  ENV_NAME: str(),

  KAFKA_HOST: str(),
  KAFKA_PORT: num(),
  KAFKA_GROUP_ID: str(),
  KAFKA_USER: str(),
  KAFKA_PASSWORD: str(),
});

const kafka = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: `${env.KAFKA_GROUP_ID}`,
      brokers: [`${env.KAFKA_HOST}:${env.KAFKA_PORT}`],
      ...(env.NODE_ENV === 'development'
        ? {}
        : {
            ssl: {
              rejectUnauthorized: false,
            },
            sasl: {
              mechanism: 'scram-sha-256',
              username: env.KAFKA_USER,
              password: env.KAFKA_PASSWORD,
            },
          }),
    },
    consumer: {
      groupId: `${env.KAFKA_GROUP_ID}`,
      allowAutoTopicCreation: true,
      sessionTimeout: 9000,
    },
  },
};

export const config = {
  env,
  kafka,
};
