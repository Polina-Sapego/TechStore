import type { CartMessage } from './types';

export const WS_URL =
  (globalThis as unknown as { VITE_WS_URL?: string }).VITE_WS_URL ||
  'ws://localhost:3000';

export function safeSend(ws: WebSocket | undefined, data: CartMessage) {
  if (!ws) return;

  const msg = JSON.stringify(data);

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(msg);
  } else {
    ws.addEventListener(
      'open',
      () => {
        try {
          ws.send(msg);
        } catch { /* empty */ }
      },
      { once: true }
    );
  }
}
