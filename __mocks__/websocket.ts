type WSListener = (event: { data: string }) => void;

export class MockWebSocket {
  static instances: MockWebSocket[] = [];

  public sentMessages: string[] = [];
  public onopen?: () => void;
  public onmessage?: WSListener;
  public onclose?: (event?: { code?: number }) => void;

  private listeners: Record<string, WSListener[]> = {};

  constructor(public url: string) {
    MockWebSocket.instances.push(this);
    setTimeout(() => this.onopen?.(), 0);
  }

  send(msg: string): void {
    this.sentMessages.push(msg);
  }

  close(trigger = false): void {
    if (trigger && typeof this.onclose === 'function') {
      this.onclose({ code: 1000 });
    }
  }

  receive(msg: any): void {
    const event = { data: JSON.stringify(msg) };
    this.onmessage?.(event);
    this.listeners['message']?.forEach(fn => fn(event));
  }

  addEventListener(type: string, fn: WSListener): void {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(fn);
  }

  removeEventListener(type: string, fn: WSListener): void {
    if (!this.listeners[type]) return;
    this.listeners[type] = this.listeners[type].filter(f => f !== fn);
  }
}
