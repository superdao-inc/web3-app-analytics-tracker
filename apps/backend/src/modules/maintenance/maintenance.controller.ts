import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MaintenanceService } from './maintenance.service';
import { IpInfo } from './models/ip-info.model';

@ApiTags('maintenance')
@Controller({ version: VERSION_NEUTRAL })
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get('health')
  getHealthCheck(): string {
    return this.maintenanceService.getHealthCheck();
  }

  @Get('environment')
  getEnvironment(): string {
    return this.maintenanceService.getEnvironment();
  }

  @Get('ip/info')
  getIpInfo(): Promise<IpInfo> {
    return this.maintenanceService.getIpInfo();
  }
}
