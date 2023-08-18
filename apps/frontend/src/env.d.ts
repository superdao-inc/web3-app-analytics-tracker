/// <reference types="vite/client" />

declare module '@analytics/session-utils' {
  export function getSession(duration: number): unknown;
}
