<template>
  <div class="chat-widget">
    <!-- Chat Button (Floating) -->
    <button
      v-if="!isOpen"
      class="chat-button"
      @click="openChat"
      :class="{ 'has-unread': unreadCount > 0 }"
    >
      <i class="bi bi-chat-dots-fill"></i>
      <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
    </button>

    <!-- Chat Window -->
    <div v-if="isOpen" class="chat-window">
      <!-- Header -->
      <div class="chat-header">
        <div class="header-info">
          <div class="avatar-circle">
            <i class="bi bi-headset"></i>
          </div>
          <div class="header-text">
            <h6 class="mb-0">Hỗ trợ khách hàng</h6>
            <small class="text-muted">Dell Laptop Store</small>
          </div>
        </div>
        <button class="btn btn-sm btn-link" @click="closeChat">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Messages -->
      <div class="messages-container" ref="messagesContainer">
        <div v-if="isLoadingMessages" class="text-center py-4">
          <div class="spinner-border spinner-border-sm" role="status"></div>
        </div>

        <div v-else class="messages-list">
          <div
            v-for="(message, index) in messages"
            :key="message.id"
            class="message-wrapper"
            :class="{ 'message-customer': message.isFromCustomer, 'message-staff': !message.isFromCustomer }"
          >
            <!-- Date separator -->
            <div v-if="shouldShowDateSeparator(message, index)" class="date-separator">
              {{ formatDate(message.ngayPhanHoi) }}
            </div>

            <!-- Message bubble -->
            <div class="message-bubble">
              <!-- Reply preview -->
              <div v-if="message.replyTo" class="reply-preview" @click="scrollToMessage(message.replyToId)">
                <div class="reply-line"></div>
                <div class="reply-content">
                  <strong>{{ message.replyTo.isFromCustomer ? 'Bạn' : 'Nhân viên' }}</strong>
                  <p class="mb-0">{{ message.replyTo.noiDung }}</p>
                </div>
              </div>

              <!-- Message content -->
              <div class="message-content">
                <!-- Image -->
                <div v-if="message.messageType === 'image' && message.fileUrl" class="message-image">
                  <img :src="message.fileUrl" alt="Image" @click="openImageModal(message.fileUrl)" />
                </div>
                <!-- File -->
                <div v-else-if="message.messageType === 'file' && message.fileUrl" class="message-file">
                  <a :href="message.fileUrl" target="_blank" class="file-link">
                    <i class="bi bi-file-earmark"></i>
                    <span>Tải file</span>
                  </a>
                </div>

                <!-- Text -->
                <p class="message-text" v-html="formatMessage(message.noiDung)"></p>

                <!-- Metadata -->
                <div class="message-meta">
                  <span class="message-time">{{ formatMessageTime(message.ngayPhanHoi) }}</span>
                  <span v-if="message.isFromCustomer && message.isRead" class="read-indicator">
                    <i class="bi bi-check2-all text-primary"></i>
                  </span>
                  <span v-else-if="message.isFromCustomer" class="read-indicator">
                    <i class="bi bi-check2 text-muted"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="typing-indicator">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input area -->
      <div class="chat-input-area">
        <!-- Reply preview bar -->
        <div v-if="replyingTo" class="reply-preview-bar">
          <div class="reply-info">
            <i class="bi bi-reply"></i>
            <span>Đang trả lời: {{ replyingTo.noiDung.substring(0, 50) }}...</span>
          </div>
          <button class="btn btn-sm btn-link" @click="cancelReply">
            <i class="bi bi-x"></i>
          </button>
        </div>

        <div class="input-group">
          <button class="btn btn-outline-secondary btn-sm" @click="triggerFileUpload" title="Gửi file">
            <i class="bi bi-paperclip"></i>
          </button>
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/*,.pdf,.doc,.docx"
            style="display: none"
          />
              <textarea
                class="form-control"
                v-model="newMessage"
                @keydown.enter.exact.prevent="handleEnterKey"
                @keydown.enter.shift.exact="newMessage += '\n'"
                @input="handleTyping"
                placeholder="Nhập tin nhắn..."
                rows="1"
                ref="messageInput"
              ></textarea>
          <button
            class="btn btn-primary btn-sm"
            @click="sendMessage"
            :disabled="!canSendMessage || isSending"
          >
            <span v-if="isSending" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-send"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="selectedImage" class="image-modal" @click="selectedImage = null">
      <div class="image-modal-content" @click.stop>
        <img :src="selectedImage" alt="Preview" />
        <button class="btn btn-sm btn-danger image-modal-close" @click="selectedImage = null">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { chatService } from '@/service/customer/chatService'
import { useAuthStore } from '@/stores/customer/authStore'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

const authStore = useAuthStore()

// State
const isOpen = ref(false)
const messages = ref([])
const newMessage = ref('')
const isLoadingMessages = ref(false)
const isSending = ref(false)
const replyingTo = ref(null)
const isTyping = ref(false)
const typingTimeout = ref(null)
const selectedImage = ref(null)
const unreadCount = ref(0)
const conversationId = ref(null)
const messagesContainer = ref(null)
const messageInput = ref(null)
const fileInput = ref(null)

// WebSocket
let stompClient = null

// Computed
const canSendMessage = computed(() => {
  return newMessage.value.trim().length > 0 && !isSending.value && authStore.isAuthenticated
})

const currentCustomerId = computed(() => {
  // Sử dụng customerId từ computed property hoặc từ user
  const userId = authStore.customerId ||
                 authStore.user?.userId ||
                 authStore.user?.id ||
                 authStore.user?.user_id ||
                 localStorage.getItem('customer_id') ||
                 null

  // Log để debug
  if (!userId) {
    console.warn('Không tìm thấy customer ID trong authStore:', {
      customerId: authStore.customerId,
      user: authStore.user,
      localStorage: localStorage.getItem('customer_id')
    })
  }

  return userId
})

// Methods
const openChat = async () => {
  if (!authStore.isAuthenticated) {
    // TODO: Mở modal đăng nhập
    alert('Vui lòng đăng nhập để sử dụng chat')
    return
  }

  isOpen.value = true

  // Kết nối WebSocket trước (quan trọng để tin nhắn hiển thị ngay)
  if (!stompClient || !stompClient.connected) {
    connectWebSocket()
    // Đợi WebSocket kết nối (tối đa 5 giây)
    let waitCount = 0
    while ((!stompClient || !stompClient.connected) && waitCount < 50) {
      await new Promise(resolve => setTimeout(resolve, 100))
      waitCount++
    }
  }

  // Tìm hoặc tạo conversation
  if (!conversationId.value) {
    try {
      const response = await chatService.findOrCreateConversation(currentCustomerId.value)
      // response.data có thể là null nếu chưa có conversation
      conversationId.value = response.data

      // Nếu chưa có conversation, sẽ được tạo khi gửi tin nhắn đầu tiên
      if (conversationId.value) {
        await loadMessages(conversationId.value)
        // Subscribe sau khi có conversationId
        if (stompClient && stompClient.connected) {
          subscribeToConversation(conversationId.value)
        }
      } else {
        // Chưa có conversation, hiển thị empty state
        messages.value = []
      }
    } catch (error) {
      console.error('Lỗi khi tìm conversation:', error)
      // Vẫn mở chat, conversation sẽ được tạo khi gửi tin nhắn đầu tiên
      messages.value = []
    }
  } else {
    // Đã có conversationId, load messages
    await loadMessages(conversationId.value)
    // Subscribe nếu chưa subscribe
    if (stompClient && stompClient.connected) {
      subscribeToConversation(conversationId.value)
    }
  }
}

const closeChat = () => {
  isOpen.value = false
  if (stompClient) {
    stompClient.deactivate()
    stompClient = null
  }
}

const loadMessages = async (convId) => {
  if (!convId) return

  isLoadingMessages.value = true
  try {
    const response = await chatService.getMessages(convId)
    messages.value = response.data || []
    await nextTick()
    scrollToBottom()

    // Mark as read
    if (unreadCount.value > 0) {
      await markAsRead(convId, true)
      unreadCount.value = 0
    }
  } catch (error) {
    console.error('Lỗi khi load messages:', error)
  } finally {
    isLoadingMessages.value = false
  }
}

// Handler cho phím Enter - tránh gọi nhiều lần
const handleEnterKey = (event) => {
  if (!isSending.value && canSendMessage.value) {
    event.preventDefault()
    sendMessage()
  }
}

const sendMessage = async () => {
  // Kiểm tra flag để tránh gọi nhiều lần
  if (!canSendMessage.value || isSending.value) {
    console.log('⚠️ sendMessage đã được gọi hoặc đang xử lý, bỏ qua')
    return
  }

  const messageText = newMessage.value.trim()
  if (!messageText) return

  // Set flag ngay để tránh gọi lại
  isSending.value = true

  try {
    // Validate customer ID
    if (!currentCustomerId.value) {
      alert('Không tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại.')
      isSending.value = false
      return
    }

    const messageData = {
      khachHangId: currentCustomerId.value,
      nhanVienId: null,
      noiDung: messageText,
      conversationId: conversationId.value || null, // null nếu là tin nhắn đầu tiên
      messageType: 'text',
      isFromCustomer: true, // Đảm bảo là boolean, không phải undefined
      replyToId: replyingTo.value?.id || null
    }

    console.log('Gửi tin nhắn với data:', messageData)
    console.log('Customer ID type:', typeof currentCustomerId.value, 'Value:', currentCustomerId.value)

    // CHỈ gửi qua WebSocket nếu đã kết nối, nếu không thì dùng REST API
    // KHÔNG gửi cả 2 để tránh duplicate
    if (stompClient && stompClient.connected) {
      // Thêm optimistic message để hiển thị ngay (sẽ bị thay thế bởi message thật từ WebSocket)
      const tempId = 'temp-' + Date.now()
      const optimisticMessage = {
        id: tempId,
        noiDung: messageText,
        isFromCustomer: true,
        ngayPhanHoi: new Date().toISOString(),
        conversationId: conversationId.value,
        messageType: 'text',
        replyToId: replyingTo.value?.id || null,
        replyTo: replyingTo.value || null
      }
      messages.value.push(optimisticMessage)
      await nextTick()
      scrollToBottom()

      // Gửi qua WebSocket (sẽ được xử lý bởi ChatWebSocketController)
      // WebSocket sẽ lưu vào DB và broadcast, không cần gọi REST API nữa
      stompClient.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(messageData)
      })

      // Clear input ngay
      newMessage.value = ''
      replyingTo.value = null

      // Message thật sẽ được thêm từ WebSocket subscription và thay thế optimistic message
    } else {
      // Fallback: Gửi qua REST API nếu WebSocket chưa kết nối
      let response
      try {
        response = await chatService.sendMessage(messageData)
      } catch (error) {
        console.error('Chi tiết lỗi khi gửi tin nhắn:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
          errors: error.response?.data?.errors,
          code: error.response?.data?.code
        })

        // Hiển thị lỗi cụ thể cho user
        const errorMessage = error.response?.data?.message ||
                            error.response?.data?.errors?.[Object.keys(error.response?.data?.errors || {})[0]] ||
                            'Không thể gửi tin nhắn. Vui lòng thử lại.'
        alert(errorMessage)
        throw error
      }

      // Cập nhật conversationId từ response nếu chưa có
      if (!conversationId.value && response.data?.conversationId) {
        conversationId.value = response.data.conversationId
        // Kết nối và subscribe WebSocket sau khi có conversationId
        if (!stompClient || !stompClient.connected) {
          connectWebSocket()
          // Đợi kết nối (tối đa 5 giây)
          let waitCount = 0
          while ((!stompClient || !stompClient.connected) && waitCount < 50) {
            await new Promise(resolve => setTimeout(resolve, 100))
            waitCount++
          }
        }
        if (stompClient && stompClient.connected) {
          subscribeToConversation(conversationId.value)
        }
      } else if (conversationId.value && (!stompClient || !stompClient.connected)) {
        // Nếu đã có conversationId nhưng WebSocket chưa kết nối, kết nối ngay
        connectWebSocket()
        let waitCount = 0
        while ((!stompClient || !stompClient.connected) && waitCount < 50) {
          await new Promise(resolve => setTimeout(resolve, 100))
          waitCount++
        }
        if (stompClient && stompClient.connected) {
          subscribeToConversation(conversationId.value)
        }
      }

      // Thêm tin nhắn vào danh sách
      if (response.data) {
        // Kiểm tra duplicate trước khi thêm
        const existingIndex = messages.value.findIndex(m =>
          m.id === response.data.id ||
          (m.noiDung === response.data.noiDung &&
           m.isFromCustomer === response.data.isFromCustomer &&
           m.ngayPhanHoi && response.data.ngayPhanHoi &&
           Math.abs(new Date(m.ngayPhanHoi) - new Date(response.data.ngayPhanHoi)) < 1000)
        )

        if (existingIndex === -1) {
          messages.value.push(response.data)
          await nextTick()
          scrollToBottom()
        } else {
          // Nếu đã có, cập nhật message
          messages.value[existingIndex] = response.data
          await nextTick()
          scrollToBottom()
        }
      } else {
        // Reload messages nếu không có data
        if (conversationId.value) {
          await loadMessages(conversationId.value)
        }
      }

      // Clear input sau khi gửi thành công
      newMessage.value = ''
      replyingTo.value = null
    }
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn:', error)
    alert('Không thể gửi tin nhắn. Vui lòng thử lại.')
  } finally {
    isSending.value = false
  }
}

const markAsRead = async (convId, isFromCustomer) => {
  try {
    await chatService.markAsRead(convId, isFromCustomer)
  } catch (error) {
    console.error('Lỗi khi đánh dấu đã đọc:', error)
  }
}

const loadUnreadCount = async () => {
  if (!authStore.isAuthenticated || !currentCustomerId.value) return

  try {
    const response = await chatService.getUnreadCount(currentCustomerId.value)
    unreadCount.value = response.data || 0
  } catch (error) {
    console.error('Lỗi khi load unread count:', error)
  }
}

const handleTyping = () => {
  if (!conversationId.value) return

  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/chat.typing',
      body: JSON.stringify({
        conversationId: conversationId.value,
        userId: currentCustomerId.value,
        userName: authStore.user?.hoTen || 'Khách hàng',
        isTyping: true
      })
    })
  }

  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }

  typingTimeout.value = setTimeout(() => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/app/chat.typing',
        body: JSON.stringify({
          conversationId: conversationId.value,
          userId: currentCustomerId.value,
          userName: authStore.user?.hoTen || 'Khách hàng',
          isTyping: false
        })
      })
    }
  }, 1000)
}

const connectWebSocket = () => {
  if (stompClient && stompClient.connected) return

  // Nếu đã có client nhưng chưa kết nối, deactivate trước
  if (stompClient) {
    stompClient.deactivate()
    stompClient = null
  }

  const socket = new SockJS('http://localhost:8080/ws')
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      console.log('✅ WebSocket connected')
      if (conversationId.value) {
        subscribeToConversation(conversationId.value)
      }
    },
    onStompError: (frame) => {
      console.error('❌ WebSocket error:', frame)
    },
    onDisconnect: () => {
      console.log('🔌 WebSocket disconnected')
    }
  })

  stompClient.activate()
}

const subscribeToConversation = (convId) => {
  if (!stompClient || !stompClient.connected || !convId) return

  // Unsubscribe trước nếu đã subscribe để tránh duplicate subscription
  const existingSubs = Object.keys(stompClient.subscriptions || {})
  existingSubs.forEach(subId => {
    if (subId.includes(`conversation/${convId}`) && !subId.includes('/typing') && !subId.includes('/read')) {
      stompClient.unsubscribe(subId)
      console.log('🔌 Unsubscribed old subscription:', subId)
    }
  })

  // Subscribe mới với duplicate check chặt chẽ
  const subscription = stompClient.subscribe(`/topic/conversation/${convId}`, (message) => {
    try {
      const newMsg = JSON.parse(message.body)

      // Xóa optimistic message (temp message) nếu có - ưu tiên xóa temp message trước
      const tempIndex = messages.value.findIndex(m =>
        (m.id && m.id.toString().startsWith('temp-')) ||
        (m.noiDung === newMsg.noiDung &&
         m.isFromCustomer === newMsg.isFromCustomer &&
         !m.id &&
         m.ngayPhanHoi && newMsg.ngayPhanHoi &&
         Math.abs(new Date(m.ngayPhanHoi) - new Date(newMsg.ngayPhanHoi)) < 3000)
      )
      if (tempIndex > -1) {
        console.log('🗑️ Xóa optimistic message:', tempIndex, messages.value[tempIndex])
        messages.value.splice(tempIndex, 1)
      }

      // KIỂM TRA DUPLICATE CHẶT CHẼ: cả ID và nội dung + thời gian
      const existingIndex = messages.value.findIndex(m => {
        // Kiểm tra theo ID (chính xác nhất) - bỏ qua temp messages
        if (m.id && newMsg.id && !m.id.toString().startsWith('temp-') && m.id === newMsg.id) {
          return true
        }
        // Kiểm tra theo nội dung + người gửi + thời gian (trong vòng 3 giây)
        if (m.noiDung === newMsg.noiDung &&
            m.isFromCustomer === newMsg.isFromCustomer &&
            m.ngayPhanHoi && newMsg.ngayPhanHoi &&
            !m.id?.toString().startsWith('temp-')) {
          const timeDiff = Math.abs(new Date(m.ngayPhanHoi) - new Date(newMsg.ngayPhanHoi))
          if (timeDiff < 3000) { // Cùng thời gian (3 giây)
            return true
          }
        }
        return false
      })

      if (existingIndex === -1) {
        // Chưa có, thêm mới
        messages.value.push(newMsg)
        nextTick(() => scrollToBottom())
        console.log('✅ Thêm message mới từ WebSocket:', newMsg.id, newMsg.noiDung)
      } else {
        // Đã có, chỉ cập nhật (KHÔNG thêm mới)
        console.log('⚠️ Duplicate message detected, updating existing:', {
          existingId: messages.value[existingIndex].id,
          newId: newMsg.id,
          content: newMsg.noiDung
        })
        messages.value[existingIndex] = newMsg
        nextTick(() => scrollToBottom())
      }

      // Cập nhật conversationId nếu chưa có
      if (!conversationId.value && newMsg.conversationId) {
        conversationId.value = newMsg.conversationId
      }

      // Update unread count
      if (!newMsg.isFromCustomer) {
        unreadCount.value++
      }

      // Mark as read
      if (!newMsg.isFromCustomer) {
        markAsRead(convId, true)
      }

      // Reset sending flag sau khi nhận message
      isSending.value = false
    } catch (error) {
      console.error('❌ Lỗi khi parse message từ WebSocket:', error)
      isSending.value = false
    }
  })

  console.log('✅ Subscribed to conversation:', convId, 'Subscription ID:', subscription.id)

  stompClient.subscribe(`/topic/conversation/${convId}/typing`, (message) => {
    try {
      const typing = JSON.parse(message.body)
      if (typing.isTyping && typing.userId !== currentCustomerId.value) {
        isTyping.value = true
        setTimeout(() => {
          isTyping.value = false
        }, 3000)
      } else {
        isTyping.value = false
      }
    } catch (error) {
      console.error('Lỗi khi parse typing từ WebSocket:', error)
    }
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Hôm nay'
  if (d.toDateString() === yesterday.toDateString()) return 'Hôm qua'
  return d.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const formatMessageTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

const formatMessage = (text) => {
  if (!text) return ''
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>').replace(/\n/g, '<br>')
}

const shouldShowDateSeparator = (message, index) => {
  if (index === 0) return true
  const currentDate = new Date(message.ngayPhanHoi).toDateString()
  const prevDate = new Date(messages.value[index - 1].ngayPhanHoi).toDateString()
  return currentDate !== prevDate
}

const replyToMessage = (message) => {
  replyingTo.value = message
  messageInput.value?.focus()
}

const cancelReply = () => {
  replyingTo.value = null
}

const handleFileSelect = () => {
  // TODO: Implement file upload
  alert('Tính năng gửi file đang được phát triển')
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const openImageModal = (imageUrl) => {
  selectedImage.value = imageUrl
}

const scrollToMessage = (messageId) => {
  const messageElement = document.querySelector(`[data-message-id="${messageId}"]`)
  if (messageElement) {
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// Watch auth changes
watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    loadUnreadCount()
    // Reset conversationId khi đăng nhập lại
    conversationId.value = null
  } else {
    unreadCount.value = 0
    conversationId.value = null
    if (isOpen.value) {
      closeChat()
    }
  }
})

// Watch conversationId để subscribe khi có conversation mới
watch(conversationId, (newConvId) => {
  if (newConvId && stompClient && stompClient.connected) {
    subscribeToConversation(newConvId)
  }
})

// Lifecycle
onMounted(() => {
  if (authStore.isAuthenticated) {
    loadUnreadCount()
    // Poll unread count every 30 seconds
    setInterval(loadUnreadCount, 30000)
  }
})

onUnmounted(() => {
  if (stompClient) {
    stompClient.deactivate()
  }
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }
})
</script>

<style scoped>
.chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s;
  position: relative;
}

.chat-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.chat-button.has-unread {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 0 rgba(102, 126, 234, 0.7);
  }
  50% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 10px rgba(102, 126, 234, 0);
  }
}

.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #f44336;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.chat-window {
  width: 380px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.header-text h6 {
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.header-text small {
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #f5f5f5;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
}

.message-wrapper.message-customer {
  align-items: flex-end;
}

.message-wrapper.message-staff {
  align-items: flex-start;
}

.date-separator {
  text-align: center;
  margin: 16px 0;
  color: #999;
  font-size: 12px;
  position: relative;
}

.date-separator::before,
.date-separator::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #e0e0e0;
}

.date-separator::before {
  left: 0;
}

.date-separator::after {
  right: 0;
}

.message-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 18px;
  word-wrap: break-word;
}

.message-customer .message-bubble {
  background: #2196f3;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-staff .message-bubble {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.reply-preview {
  background: rgba(0, 0, 0, 0.1);
  border-left: 3px solid rgba(255, 255, 255, 0.5);
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.message-staff .reply-preview {
  background: rgba(0, 0, 0, 0.05);
  border-left-color: #2196f3;
}

.message-content {
  position: relative;
}

.message-image img {
  max-width: 250px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 4px;
}

.message-file {
  padding: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.file-link {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-text {
  margin: 0;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-text :deep(a) {
  color: inherit;
  text-decoration: underline;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 11px;
  opacity: 0.8;
}

.read-indicator {
  margin-left: 4px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  padding: 8px 12px;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  background: #999;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.chat-input-area {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  background: white;
}

.reply-preview-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f5f5;
  border-left: 3px solid #2196f3;
  margin-bottom: 8px;
  border-radius: 4px;
  font-size: 13px;
}

.reply-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.input-group {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.input-group textarea {
  resize: none;
  min-height: 40px;
  max-height: 100px;
  border-radius: 20px;
  padding: 10px 16px;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.image-modal-content img {
  max-width: 100%;
  max-height: 90vh;
  border-radius: 8px;
}

.image-modal-close {
  position: absolute;
  top: -40px;
  right: 0;
}

/* Scrollbar */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive */
@media (max-width: 768px) {
  .chat-window {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>

