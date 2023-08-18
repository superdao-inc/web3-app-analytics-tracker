import { tracker } from './src/tracker';

if (!!window.sdt && 'id' in window.sdt && typeof window.sdt.id === 'string') {
  window.sdt = tracker(window.sdt.id);
}
