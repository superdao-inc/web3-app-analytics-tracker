import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';

@Module({
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  imports: [HttpModule],
})
export class MaintenanceModule {}
