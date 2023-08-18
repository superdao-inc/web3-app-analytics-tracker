/* eslint-disable no-console */
import { getSession } from '@analytics/session-utils';
import Analytics, { AnalyticsInstance, AnalyticsPlugin } from 'analytics';

import {
  AnalyticsEventType,
  SERVER_URL,
  USER_SESSION_DURATION,
  USER_SESSION_KEY,
} from './constants';
import {
  AnalyticPayloadType,
  AnalyticsEventInput,
  AnalyticsPagePayload,
  AnalyticsSession,
  AnalyticsState,
  AnalyticsTrackPayload,
} from './types';

const SCHEME_VERSION = '1';

const sanitizeUtmParam = (param: unknown) =>
  typeof param === 'string' ? param : undefined;

const prepareAnalyticsEvent = ({
  trackerId,
  payload,
  instance,
  type,
}: {
  trackerId: string;
  payload: AnalyticsPagePayload | AnalyticsTrackPayload;
  instance: AnalyticsInstance;
  type: AnalyticsEventType;
}) => {
  const { user, context, page } = instance.getState() as AnalyticsState;

  const userSession = instance.storage.getItem(USER_SESSION_KEY) as
    | AnalyticsSession
    | undefined;
  const sessionId = userSession?.id || context.sessionId || 'unknown';

  const analyticsEventData: AnalyticsEventInput = {
    ...payload.properties,
    trackerId,
    type,
    id: payload.meta.rid,
    sessionId: sessionId,
    timestamp: payload.meta.ts,
    anonymousId: user.anonymousId,
    userLocale: context.locale,
    userTimezone: context.timezone,
    userAgent: context.userAgent,
    pageReferrer: context.referrer,
    pageUrl:
      payload.type === AnalyticPayloadType.PAGE
        ? payload.properties.url
        : page.last.properties.url ?? payload.properties.url,
    pagePath:
      payload.type === AnalyticPayloadType.PAGE
        ? payload.properties.path
        : page.last.properties.path ?? payload.properties.url,
    pageUtmId: sanitizeUtmParam(context.campaign.id),
    pageUtmSource: sanitizeUtmParam(context.campaign.source),
    pageUtmMedium: sanitizeUtmParam(context.campaign.medium),
    pageUtmCampaign: sanitizeUtmParam(context.campaign.name),
    pageUtmTerm: sanitizeUtmParam(context.campaign.term),
    pageUtmContent: sanitizeUtmParam(context.campaign.content),
  };

  return analyticsEventData;
};

const sendData = (data: AnalyticsEventInput) => {
  return fetch(`${SERVER_URL}/collect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Superdao-Tracker-Version': SCHEME_VERSION,
    },
    body: JSON.stringify(data),
  });
};

const analyticSuperdaoTrackerPlugin = (trackerId: string): AnalyticsPlugin => {
  return {
    name: 'analytics-superdao-tracker-plugin',
    bootstrap: ({ instance }: { instance: AnalyticsInstance }) => {
      const session = getSession(USER_SESSION_DURATION) as AnalyticsSession;

      try {
        instance.storage.setItem(USER_SESSION_KEY, session);
      } catch (error) {
        console.error(error);
      }
    },
    page: async ({
      payload,
      instance,
    }: {
      payload: AnalyticsPagePayload;
      instance: AnalyticsInstance;
    }) => {
      const analyticsEventData = prepareAnalyticsEvent({
        trackerId,
        payload,
        instance,
        type: AnalyticsEventType.PageView,
      });
      return sendData(analyticsEventData).catch((error) =>
        console.error(error),
      );
    },
    track: async ({
      payload,
      instance,
    }: {
      payload: AnalyticsTrackPayload;
      instance: AnalyticsInstance;
    }) => {
      const analyticsEventData = prepareAnalyticsEvent({
        trackerId,
        payload,
        instance,
        type: payload.event,
      });
      return sendData(analyticsEventData).catch((error) =>
        console.error(error),
      );
    },
  };
};

export function analytics(trackerId: string) {
  const instance = Analytics({
    debug: false,
    version: SCHEME_VERSION,
    plugins: [analyticSuperdaoTrackerPlugin(trackerId)],
  });

  instance.on('ready', () => {
    if (typeof window === 'undefined') return;

    window.sdtQueue?.forEach((e) => {
      const fn = instance[e.name as keyof AnalyticsInstance];
      // @ts-expect-error any args
      if (typeof fn === 'function') fn(...e.args);
    });
  });

  return instance;
}
