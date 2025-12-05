import { WebSocketServer } from 'ws';
import { Server } from 'http';

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({
    server,
  });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.send(JSON.stringify({ type: 'connected', message: 'Welcome to WebSocket server!' }));

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('incoming message from client:', data);
        if (data.type === 'cart:update') {
          console.log('Received cart:update:', data.payload);
          console.log('Received cart:update (sessionId):', data.sessionId, data.payload);
          wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
              client.send(JSON.stringify({
                type: 'cart:sync',
                payload: data.payload,
                sessionId: data.sessionId,
              }));
            }
          });
        }
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    });

    ws.on('close', () => console.log('Client disconnected'));
  });

  return wss;
}
