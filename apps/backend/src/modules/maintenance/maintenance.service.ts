import assert from 'node:assert';

import { CustomLogger } from '@dev/nestjs-common';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';

import { IpInfo } from './models/ip-info.model';

@Injectable()
export class MaintenanceService {
  private readonly environment: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly logger: CustomLogger,
  ) {
    const env = configService.get<string>('NODE_ENV');
    assert(env);

    this.environment = env;
    this.logger = logger.createScope(MaintenanceService.name);
  }

  getEnvironment = (): string => `{ "environment" : "${this.environment}"}`;
  getHealthCheck = (): string => '{ "status": "OK" }';
  getIpInfo = (): Promise<IpInfo> => {
    try {
      return firstValueFrom(
        this.httpService
          .get<IpInfo>('https://worldtimeapi.org/api/ip')
          .pipe(map(({ data }) => data)),
      );
    } catch (error) {
      const capturedError = error instanceof Error ? error : Error();

      throw new HttpException(
        'Could not fetch the data',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: capturedError },
      );
    }
  };
}
