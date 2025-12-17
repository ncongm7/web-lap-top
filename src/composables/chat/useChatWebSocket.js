import { ref, onUnmounted } from 'vue'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

export function useChatWebSocket(options = {}) {
  const {
    onMessage,
    onTyping,
    onStatusChange
  } = options

  const stompClient = ref(null)
  const connectionStatus = ref('disconnected')
  const reconnectAttempts = ref(0)
  const isTyping = ref(false)
  const typingUser = ref(null)
  let typingTimeout = null

  // Connect to WebSocket
  const connect = (userId) => {
    if (stompClient.value?.connected) {
      connectionStatus.value = 'connected'
      return
    }

    if (connectionStatus.value === 'connecting') return

    // Deactivate existing
    if (stompClient.value) {
      try {
        stompClient.value.deactivate()
      } catch (e) {
        console.error('Error deactivating stomp client', e)
      }
      stompClient.value = null
    }

    connectionStatus.value = 'connecting'
    if (onStatusChange) onStatusChange('connecting')

    const socket = new SockJS('http://localhost:8080/ws')
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      connectionTimeout: 10000,
      onConnect: () => {
        console.log('✅ WebSocket connected')
        connectionStatus.value = 'connected'
        reconnectAttempts.value = 0
        if (onStatusChange) onStatusChange('connected')
      },
      onStompError: (frame) => {
        console.error('❌ WebSocket error:', frame)
        connectionStatus.value = 'reconnecting'
        if (onStatusChange) onStatusChange('reconnecting')
      },
      onDisconnect: () => {
        console.log('🔌 WebSocket disconnected')
        if (connectionStatus.value !== 'connecting') {
           connectionStatus.value = 'disconnected'
           if (onStatusChange) onStatusChange('disconnected')
        }
      },
      onWebSocketError: (event) => {
        console.error('❌ WebSocket connection error:', event)
        connectionStatus.value = 'reconnecting'
        if (onStatusChange) onStatusChange('reconnecting')
      }
    })

    client.activate()
    stompClient.value = client
  }

  // Subscribe to conversation
  const subscribe = (conversationId, userId) => {
    if (!stompClient.value || !stompClient.value.connected || !conversationId) return

    // Unsubscribe existing if needed (logic handled by caller or we can track here)
    // For now assuming caller manages re-subscription

    // Main conversation subscription
    stompClient.value.subscribe(`/topic/conversation/${conversationId}`, (message) => {
      try {
        const payload = JSON.parse(message.body)
        if (onMessage) onMessage(payload)
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    })

    // Typing subscription
    stompClient.value.subscribe(`/topic/conversation/${conversationId}/typing`, (message) => {
      try {
        const payload = JSON.parse(message.body)

        // Only handle typing from OTHER users
        if (payload.userId !== userId) {
          if (payload.isTyping) {
            isTyping.value = true
            typingUser.value = payload.userName

            // Auto hide after 5s
            if (typingTimeout) clearTimeout(typingTimeout)
            typingTimeout = setTimeout(() => {
              isTyping.value = false
              typingUser.value = null
            }, 5000)

            if (onTyping) onTyping(true, payload.userName)
          } else {
            isTyping.value = false
            typingUser.value = null
            if (typingTimeout) clearTimeout(typingTimeout)
            if (onTyping) onTyping(false, null)
          }
        }
      } catch (error) {
        console.error('Error parsing typing:', error)
      }
    })
  }

  // Send message
  const sendMessage = (destination, body) => {
    if (stompClient.value && stompClient.value.connected) {
      stompClient.value.publish({
        destination,
        body: JSON.stringify(body)
      })
      return true
    }
    return false
  }

  // Send typing status
  const sendTyping = (conversationId, userId, userName, isTyping) => {
    sendMessage('/app/chat.typing', {
      conversationId,
      userId,
      userName,
      isTyping
    })
  }

  const disconnect = () => {
    if (stompClient.value) {
      stompClient.value.deactivate()
      stompClient.value = null
    }
    connectionStatus.value = 'disconnected'
    if (onStatusChange) onStatusChange('disconnected')
  }

  onUnmounted(() => {
    disconnect()
    if (typingTimeout) clearTimeout(typingTimeout)
  })

  return {
    stompClient,
    connectionStatus,
    isTyping,
    typingUser,
    connect,
    disconnect,
    subscribe,
    sendMessage,
    sendTyping
  }
}
