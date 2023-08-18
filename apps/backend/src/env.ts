import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { Env } from './modules/maintenance/models/env.model';

export function validate(config: Record<string, unknown>) {
  const o = plainToInstance(Env, config, { enableImplicitConversion: true });
  const errors = validateSync(o, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return o;
}
