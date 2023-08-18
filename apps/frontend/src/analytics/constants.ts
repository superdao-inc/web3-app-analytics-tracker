export const SERVER_URL = 'https://tracker.superdao.co';
export const USER_SESSION_KEY = '__user_session';
export const USER_SESSION_DURATION = 30; // in minutes

export enum AnalyticsEventType {
  PageView = 'PAGE_VIEW',
  ClickClaim = 'CLICK_CLAIM',
  WalletConnect = 'WALLET_CONNECT',
  FormSubmit = 'FORM_SUBMIT',
}
