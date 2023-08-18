import { AnalyticsInstance } from 'analytics';

import { AnalyticsEventType } from './constants';

export interface AnalyticsState {
  context: {
    sessionId: string;
    os?: {
      name: string;
    };
    userAgent?: string; // 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    timezone?: string; // 'Asia/Makassar'
    locale?: string; // 'en-GB'
    campaign: {
      id?: string; // Used to identify which ads campaign this referral references. Use utm_id to identify a specific ads campaign.
      source?: string; // Use utm_source to identify a search engine, newsletter name, or other source.
      medium?: string; // Use utm_medium to identify a medium such as email or cost-per-click.
      name?: string; // Used for keyword analysis. Use utm_campaign to identify a specific product promotion or strategic campaign.
      term?: string; // Used for paid search. Use utm_term to note the keywords for this ad.
      content?: string; // Used for A/B testing and content-targeted ads. Use utm_content to differentiate ads or links that point to the same URL.
    };
    referrer?: string;
    initialized: boolean;
    app: string;
    version: null | string;
    debug: boolean;
    offline: boolean;
    library: {
      name: string;
      version: string;
    };
  };
  user: {
    userId?: string;
    anonymousId: string;
    // traits: {}
  };

  page: {
    last: {
      properties: AnalyticsPageProperties;
      meta: AnalyticsPageMeta;
      options: Record<string, unknown>;
    };
    history: {
      properties: AnalyticsPageProperties;
      meta: AnalyticsPageMeta;
      options: Record<string, unknown>;
    }[];
  };
}

export interface AnalyticsSession {
  id: string;
  created: number;
  createdAt: Date;
  expires: number;
  expiresAt: Date;
  elapsed: number;
  remaining: number;
  isNew: boolean;
}

export enum AnalyticPayloadType {
  PAGE = 'page',
  TRACK = 'track',
}

export interface AnalyticsPagePayload {
  userId?: string;
  type: AnalyticPayloadType.PAGE;
  properties: AnalyticsPageProperties;
  anonymousId: string;
  meta: AnalyticsPageMeta;
  options: AnalyticsPageOptions;
}

export type AnalyticsPageOptions = Record<string, unknown>;

export interface AnalyticsPageProperties {
  referrer?: string;
  title: string;
  hash: string;
  url?: string;
  path?: string;
  search: string;
  width: number;
  height: number;
}

export interface AnalyticsPageMeta {
  rid: string;
  ts: number;
  hasCallback: boolean;
}

interface AnalyticsTrackProperties {
  [key: string]: unknown;
  url: string;
}

export interface AnalyticsTrackPayload {
  type: AnalyticPayloadType.TRACK;
  properties: AnalyticsTrackProperties;
  event: AnalyticsEventType.ClickClaim;
  userId?: string;
  anonymousId: string;
  meta: {
    rid: string;
    ts: number;
    hasCallback: boolean;
  };
  options: Record<string, unknown>;
}

export interface AnalyticsEventInput {
  trackerId: string;
  type: AnalyticsEventType;
  id: string;
  timestamp: number;
  sessionId: string;
  anonymousId: string;
  advertiserId?: string;
  campaignId?: string;
  offerId?: string;
  userAgent?: string;
  userTimezone?: string;
  userLocale?: string;
  pageUtmId?: string;
  pageUtmSource?: string;
  pageUtmMedium?: string;
  pageUtmCampaign?: string;
  pageUtmTerm?: string;
  pageUtmContent?: string;
  pageUrl?: string;
  pagePath?: string;
  pageReferrer?: string;
}

declare global {
  interface Window {
    sdtQueue?: { name: string; args: unknown[] }[];
    sdt?: Partial<AnalyticsInstance>;
  }
}
