class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(url) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.emit('connected', null);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emit(data.type, data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.emit('disconnected', null);
    };

    return this;
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => callback(data));
    }
  }
}

export default new WebSocketService();
