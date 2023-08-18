import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Ip,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';

import { featureToggles } from 'src/services/featureToggles';
import { AnalyticsService } from './analytics.service';

@Controller()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @HttpCode(200)
  @Post('/collect')
  handleAnalytics(
    @Req() req: Request,
    @Body() body: Record<string, unknown>,
    @Ip() userIp: string,
    @Headers('X-Superdao-Tracker-Version') version: string,
  ) {
    const numVersion = Number(version);

    // TODO: maybe response 200?
    if (!isFinite(numVersion)) {
      throw new BadRequestException();
    }

    const payload: Record<string, unknown> = { ...body, userIp };

    if (!payload.pageUrl && featureToggles.isEnabled('tracker_fill_url')) {
      const origin = req.get('origin');
      origin && (payload.pageUrl = origin);
    }

    void this.analyticsService.pushAnalyticsEvent(payload, numVersion);
  }
}
