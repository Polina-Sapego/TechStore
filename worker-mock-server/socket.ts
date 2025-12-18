import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';

interface Client {
  ws: WebSocket;
  cartId: string;
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });
  const clients: Client[] = [];

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url ?? '', `http://${req.headers.host}`);
    const cartId = url.searchParams.get('cartId');
    if (!cartId) {
      ws.close();
      return;
    }
    clients.push({ ws, cartId });

    ws.on('message', (message) => {
      const data = JSON.parse(message.toString());

      if (data.type === 'cart:update') {
        const payload = data.payload;

        clients.forEach(c => {
          if (c.cartId === cartId && c.ws.readyState === WebSocket.OPEN) {
            c.ws.send(JSON.stringify({
              type: 'cart:sync',
              payload,
              sessionId: data.sessionId,
            }));
          }
        });
      }
    });

    ws.on('close', () => {
      const index = clients.findIndex(c => c.ws === ws);
      if (index > -1) clients.splice(index, 1);
    });
  });

  return wss;
}
