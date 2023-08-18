import assert from 'node:assert';

import { CustomLogger } from '@dev/nestjs-common';
import { ConfigService } from '@nestjs/config';

import { bootstrap } from './bootstrap';

async function main() {
  const app = await bootstrap();

  const config = app.get(ConfigService);
  const env = config.get<string>('NODE_ENV');
  const port = config.get<string>('PORT');
  assert(env && port);

  await app.listen(port);

  if (env === 'development') {
    const logger = app.get(CustomLogger);
    logger.log(`Tracker service app stared at http://localhost:${port}`);
  }
}

void main();
