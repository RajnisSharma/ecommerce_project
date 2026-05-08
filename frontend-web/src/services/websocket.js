import { WS_BASE_URL } from '../utils/constants'

class WebSocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
  }

  connect(endpoint) {
    const token = localStorage.getItem('access_token')
    const url = `${WS_BASE_URL}/${endpoint}/?token=${token}`

    this.socket = new WebSocket(url)

    this.socket.onopen = () => {
      console.log(`WebSocket connected: ${endpoint}`)
      this.emit('connected', null)
    }

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.emit(data.type, data)
    }

    this.socket.onclose = () => {
      console.log(`WebSocket disconnected: ${endpoint}`)
      this.emit('disconnected', null)
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
      this.emit('error', error)
    }

    return this
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data))
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => callback(data))
    }
  }
}

export const chatSocket = new WebSocketService()
export const notificationSocket = new WebSocketService()

export default WebSocketService
