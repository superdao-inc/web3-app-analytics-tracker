import { CustomLogger } from '@dev/nestjs-common';

import { config } from 'src/config';

// Just an lib implementation for non-injectable usage
// https://gitlab.superdao.co/dev/common/nestjs-common/-/blob/master/lib/modules/logger/logger.module.ts
const isPretty = config.env.NODE_ENV !== 'production';

const logger = new CustomLogger('App', isPretty);
logger.level = config.env.LOG_LEVEL;

export const log = logger;
