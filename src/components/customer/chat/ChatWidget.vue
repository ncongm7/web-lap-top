<template>
  <div class="chat-widget">
    <!-- Chat Button (Floating) -->
    <div v-if="!isOpen" class="chat-launcher" @click="openChat">
      <div class="launcher-meta">
        <div class="launcher-avatar">
          <img :src="heroImage" alt="Trợ lý Dell" />
        </div>
        <div class="launcher-text">
          <span class="launcher-title">Trợ lý Dell AI</span>
          <small>Hỗ trợ nhanh trong giờ làm việc</small>
        </div>
      </div>
      <button class="chat-button" type="button" aria-label="Mở chat" :class="{ 'has-unread': unreadCount > 0 }"
        @click.stop="openChat">
        <i class="bi bi-chat-dots-fill"></i>
        <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
      </button>
    </div>

    <!-- Chat Window -->
    <div v-if="isOpen" class="chat-window">
      <!-- Header -->
      <div class="chat-header">
        <div class="header-info">
          <div class="avatar-circle">
            <img :src="heroImage" alt="Dell Assistant" />
          </div>
          <div class="header-text">
            <h6 class="mb-0">Hỗ trợ khách hàng</h6>
            <small class="text-muted">Dell Laptop Store</small>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-sm btn-link" @click="toggleSound"
            :title="soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'">
            <i :class="soundEnabled ? 'bi bi-volume-up' : 'bi bi-volume-mute'"></i>
          </button>
        </div>
        <div class="header-status">
          <!-- Connection status indicator -->
          <div v-if="wsConnectionStatus === 'connected'" class="status-indicator connected" title="Đã kết nối">
            <i class="bi bi-circle-fill"></i>
          </div>
          <div v-else-if="wsConnectionStatus === 'connecting'" class="status-indicator connecting"
            title="Đang kết nối...">
            <i class="bi bi-circle-fill"></i>
          </div>
          <div v-else-if="wsConnectionStatus === 'reconnecting'" class="status-indicator reconnecting"
            title="Đang kết nối lại...">
            <i class="bi bi-arrow-clockwise"></i>
          </div>
          <div v-else class="status-indicator disconnected" title="Mất kết nối">
            <i class="bi bi-circle-fill"></i>
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

        <div v-else>
          <div v-if="messages.length === 0" class="chat-welcome-panel">
            <div class="welcome-illustration">
              <img :src="heroImage" alt="Trợ lý mua sắm Dell" />
            </div>
            <div class="welcome-intro">
              <span class="welcome-badge"><i class="bi bi-robot"></i> Trợ lý Dell AI</span>
              <h5>Xin chào {{ customerDisplayName }}!</h5>
              <p>Hãy chọn nhanh một chủ đề bên dưới hoặc gõ câu hỏi của bạn, đội ngũ Dell sẽ hỗ trợ ngay.</p>
            </div>
            <div class="welcome-topic-grid">
              <button v-for="topic in welcomeTopics" :key="topic.id" class="welcome-topic-card"
                @click="handleWelcomeOption(topic)">
                <i :class="topic.icon"></i>
                <div class="topic-text">
                  <strong>{{ topic.title }}</strong>
                  <span>{{ topic.description }}</span>
                </div>
                <i class="bi bi-chevron-right topic-arrow"></i>
              </button>
            </div>
            <div class="consultation-button-wrapper">
              <button @click="startConsultation" class="consultation-btn">
                <i class="bi bi-robot"></i>
                Tư vấn chọn laptop tự động
              </button>
            </div>
          </div>

          <div v-else class="messages-list">
            <div v-for="(message, index) in messages" :key="message.id" class="message-wrapper"
              :class="{ 'message-customer': message.isFromCustomer, 'message-staff': !message.isFromCustomer }">
              <div v-if="shouldShowDateSeparator(message, index)" class="date-separator">
                {{ formatDate(message.ngayPhanHoi) }}
              </div>

              <div class="message-bubble">
                <div v-if="message.isBotMessage" class="bot-badge">
                  <i class="bi bi-robot"></i> Trợ lý tự động
                </div>

                <div v-if="message.replyTo" class="reply-preview" @click="scrollToMessage(message.replyToId)">
                  <div class="reply-line"></div>
                  <div class="reply-content">
                    <strong>{{ message.replyTo.isFromCustomer ? 'Bạn' : 'Nhân viên' }}</strong>
                    <p class="mb-0">{{ message.replyTo.noiDung }}</p>
                  </div>
                </div>

                <div class="message-content">
                  <div v-if="message.messageType === 'image' && message.fileUrl" class="message-image">
                    <img :src="message.fileUrl" alt="Image" @click="openImageModal(message.fileUrl)" />
                  </div>
                  <div v-else-if="message.messageType === 'file' && message.fileUrl" class="message-file">
                    <a :href="message.fileUrl" target="_blank" class="file-link">
                      <i class="bi bi-file-earmark"></i>
                      <span>Tải file</span>
                    </a>
                  </div>

                  <p class="message-text" v-html="formatMessage(message.noiDung)"></p>

                  <div class="message-meta">
                    <span class="message-time">{{ formatMessageTime(message.ngayPhanHoi) }}</span>
                    <span v-if="message.isFromCustomer" class="read-indicator">
                      <span v-if="message.status === 'sending'" class="status-sending" title="Đang gửi...">
                        <i class="bi bi-clock"></i>
                      </span>
                      <span v-else-if="message.status === 'sent' || (!message.isRead && !message.status)"
                        class="status-sent" title="Đã gửi">
                        <i class="bi bi-check2"></i>
                      </span>
                      <span v-else-if="message.isRead" class="status-read" title="Đã đọc">
                        <i class="bi bi-check2-all text-primary"></i>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="isTyping" class="typing-indicator">
              <div class="typing-content">
                <div class="typing-avatar">
                  <i class="bi bi-headset"></i>
                </div>
                <div class="typing-text">
                  <span class="typing-name">Nhân viên</span>
                  <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Replies (ngoài messages-list) -->
        <ChatQuickReplies v-if="currentQuickReplies.length > 0" :quick-replies="currentQuickReplies"
          @select="handleQuickReplySelect" />
      </div>

      <!-- Escalate to human button -->
      <div v-if="showEscalateButton" class="escalate-section">
        <button class="escalate-btn" @click="requestHumanSupport">
          <i class="bi bi-person-headset"></i>
          Tôi muốn nói chuyện với nhân viên
        </button>
      </div>

      <!-- File Preview Modal -->
      <div v-if="filePreview" class="file-preview-modal">
        <div class="file-preview-content">
          <div class="file-preview-header">
            <h6>Xem trước file</h6>
            <button class="btn btn-sm btn-link" @click="filePreview = null; filePreviewUrl = null">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="file-preview-body">
            <img v-if="filePreviewType === 'image'" :src="filePreviewUrl" alt="Preview" class="preview-image" />
            <div v-else class="preview-file">
              <i class="bi bi-file-earmark" style="font-size: 3rem;"></i>
              <p>{{ filePreview.name }}</p>
              <p class="text-muted">{{ formatFileSize(filePreview.size) }}</p>
            </div>
          </div>
          <div class="file-preview-footer">
            <button class="btn btn-secondary btn-sm" @click="filePreview = null; filePreviewUrl = null">
              Hủy
            </button>
            <button class="btn btn-primary btn-sm" @click="sendFileMessage" :disabled="uploadingFile">
              <span v-if="uploadingFile" class="spinner-border spinner-border-sm"></span>
              <span v-else>Gửi</span>
            </button>
          </div>
          <!-- Upload progress -->
          <div v-if="uploadingFile" class="upload-progress">
            <div class="progress">
              <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <small class="text-muted">Đang upload: {{ uploadProgress }}%</small>
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
          <button class="btn btn-outline-secondary btn-sm" @click="showEmojiPicker = !showEmojiPicker" title="Emoji">
            <i class="bi bi-emoji-smile"></i>
          </button>
          <button class="btn btn-outline-secondary btn-sm" @click="triggerFileUpload" title="Gửi file"
            :disabled="uploadingFile">
            <i class="bi bi-paperclip"></i>
          </button>
          <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*,.pdf,.doc,.docx"
            style="display: none" />
          <textarea class="form-control" v-model="newMessage" @keydown.enter.exact.prevent="handleEnterKey"
            @keydown.enter.shift.exact="newMessage += '\n'" @input="handleTyping" placeholder="Nhập tin nhắn..."
            rows="1" ref="messageInput"></textarea>
          <button class="btn btn-primary btn-sm" @click="sendMessage"
            :disabled="!canSendMessage || isSending || uploadingFile">
            <span v-if="isSending" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-send"></i>
          </button>
        </div>

        <!-- Emoji Picker -->
        <EmojiPicker :is-open="showEmojiPicker" @select="insertEmoji" @close="showEmojiPicker = false" />
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

    <!-- Consultation Flow Modal -->
    <ConsultationFlow :show="showConsultationFlow" @close="showConsultationFlow = false"
      @complete="handleConsultationComplete" />
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, nextTick, watch } from 'vue'
import { chatService } from '@/service/customer/chatService'
import { useAuthStore } from '@/stores/customer/authStore'
import ChatQuickReplies from './ChatQuickReplies.vue'
import EmojiPicker from './EmojiPicker.vue'
import ConsultationFlow from './ConsultationFlow.vue'
import heroIllustration from '@/assets/chat/assistant-hero.svg?url'
import { useChatWebSocket } from '@/composables/chat/useChatWebSocket'
import { useChatActions } from '@/composables/chat/useChatActions'

const authStore = useAuthStore()

// State
const isOpen = ref(false)
const messages = ref([])
const newMessage = ref('')
const isLoadingMessages = ref(false)
const isSending = ref(false)
const replyingTo = ref(null)
const selectedImage = ref(null)
const unreadCount = ref(0)
const conversationId = ref(null)
const messagesContainer = ref(null)
const messageInput = ref(null)
const fileInput = ref(null)
const uploadProgress = ref(0)
const uploadingFile = ref(false)
const filePreview = ref(null)
const filePreviewUrl = ref(null)
const filePreviewType = ref(null)
const soundEnabled = ref(true)

const showEmojiPicker = ref(false)

// NEW: Bot features
const currentQuickReplies = ref([])
const showEscalateButton = ref(false)


// Consultation Flow
const showConsultationFlow = ref(false)

const heroImage = heroIllustration

const defaultQuickReplies = [
  {
    id: 'quick-order-status',
    replyText: 'Tra cứu đơn hàng',
    replyValue: 'Tra cứu đơn hàng',
    replyType: 'intent_trigger',
    icon: 'bi bi-box-seam'
  },
  {
    id: 'quick-warranty',
    replyText: 'Kiểm tra bảo hành',
    replyValue: 'Chính sách bảo hành',
    replyType: 'intent_trigger',
    icon: 'bi bi-shield-check'
  },
  {
    id: 'quick-promotion',
    replyText: 'Ưu đãi hiện có',
    replyValue: 'Khuyến mãi hiện tại',
    replyType: 'intent_trigger',
    icon: 'bi bi-stars'
  },
  {
    id: 'quick-installment',
    replyText: 'Tư vấn trả góp',
    replyValue: 'Trả góp 0%',
    replyType: 'intent_trigger',
    icon: 'bi bi-credit-card-2-front'
  }
]

const welcomeTopics = [
  {
    id: 'welcome-order',
    title: 'Tình trạng đơn hàng',
    description: 'Theo dõi lộ trình giao hoặc cập nhật thanh toán',
    replyText: 'Tra cứu đơn hàng',
    replyValue: 'Tra cứu đơn hàng',
    replyType: 'intent_trigger',
    icon: 'bi bi-truck'
  },
  {
    id: 'welcome-consult',
    title: 'Tư vấn chọn máy',
    description: 'Gợi ý cấu hình theo nhu cầu học tập, làm việc, gaming',
    replyText: 'Tư vấn chọn laptop',
    replyValue: 'Tư vấn chọn laptop',
    replyType: 'intent_trigger',
    icon: 'bi bi-cpu'
  },
  {
    id: 'welcome-warranty',
    title: 'Chính sách bảo hành',
    description: 'Thông tin bảo hành, đổi trả và trung tâm hỗ trợ',
    replyText: 'Chính sách bảo hành',
    replyValue: 'Chính sách bảo hành',
    replyType: 'intent_trigger',
    icon: 'bi bi-shield-lock'
  },
  {
    id: 'welcome-promo',
    title: 'Ưu đãi & trả góp',
    description: 'Xem khuyến mãi, voucher và chương trình trả góp 0%',
    replyText: 'Khuyến mãi hiện tại',
    replyValue: 'Khuyến mãi hiện tại',
    replyType: 'intent_trigger',
    icon: 'bi bi-gift'
  }
]

// WebSocket & Actions
const {
  connect,
  disconnect,
  subscribe,
  sendMessage: sendWsMessage,
  sendTyping: sendWsTyping,
  connectionStatus: wsConnectionStatus,
  isTyping,
  typingUser
} = useChatWebSocket({
  onMessage: (msg) => handleIncomingMessage(msg),
  onTyping: () => { /* handled by composable state isTyping */ }
})

const { handleQuickReply, handleAction } = useChatActions({
  sendMessage: () => sendMessage(), // Wrapper will be defined
  closeChat: () => closeChat(),
  setNewMessage: (msg) => { newMessage.value = msg }
})

// Handler for incoming messages (moved from subscribeToConversation)
const handleIncomingMessage = (newMsg) => {
    try {
      // 1. Remove optimistic message (temp message)
      const tempIndex = messages.value.findIndex(m =>
        (m.id && m.id.toString().startsWith('temp-')) ||
        (m.noiDung === newMsg.noiDung &&
          m.isFromCustomer === newMsg.isFromCustomer &&
          !m.id &&
          m.ngayPhanHoi && newMsg.ngayPhanHoi &&
          Math.abs(new Date(m.ngayPhanHoi) - new Date(newMsg.ngayPhanHoi)) < 3000)
      )
      if (tempIndex > -1) {
        messages.value.splice(tempIndex, 1)
      }

      // 2. Check duplicate
      const existingIndex = messages.value.findIndex(m => {
        if (m.id && newMsg.id && !m.id.toString().startsWith('temp-') && m.id === newMsg.id) return true
        if (m.noiDung === newMsg.noiDung &&
          m.isFromCustomer === newMsg.isFromCustomer &&
          !m.id?.toString().startsWith('temp-')) {
          const timeDiff = Math.abs(new Date(m.ngayPhanHoi || 0) - new Date(newMsg.ngayPhanHoi || 0))
          if (timeDiff < 3000) return true
        }
        return false
      })

      // Set message status
      if (newMsg.isFromCustomer) {
        newMsg.status = newMsg.isRead ? 'read' : 'sent'
      }

      if (existingIndex === -1) {
        // Add new
        messages.value.push(newMsg)

        // Sound
        if (!newMsg.isFromCustomer) {
          playNotificationSound()
        }

        nextTick(() => scrollToBottom())
      } else {
        // Update existing
        messages.value[existingIndex] = newMsg
        nextTick(() => scrollToBottom())
      }

      // 4. Update conversationId if needed
      if (!conversationId.value && newMsg.conversationId) {
        conversationId.value = newMsg.conversationId
      }

      // 5. Update unread count
      if (!newMsg.isFromCustomer) {
        unreadCount.value++
        if (soundEnabled.value && (!isOpen.value || !document.hasFocus())) {
          playNotificationSound()
        }
         // Mark as read if window is open
         if (isOpen.value) {
            markAsRead(newMsg.conversationId, true)
         }
      }

      // 6. Reset sending flag
      isSending.value = false

      // 7. Welcome state
      applyWelcomeStateIfNeeded()

    } catch (error) {
      console.error('Error handling incoming message:', error)
      isSending.value = false
    }
}

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

const customerDisplayName = computed(() => {
  const rawName = authStore.user?.hoTen || authStore.user?.fullName || authStore.user?.name || ''
  const trimmed = rawName.trim()
  if (!trimmed) return 'bạn'
  const parts = trimmed.split(' ').filter(Boolean)
  return parts.length ? parts[parts.length - 1] : 'bạn'
})

// Methods
const openChat = async () => {
  if (!authStore.isAuthenticated) {
    alert('Vui lòng đăng nhập để sử dụng chat')
    return
  }

  isOpen.value = true

  // Kết nối WebSocket
  connect(currentCustomerId.value)

  // Tìm hoặc tạo conversation
  if (!conversationId.value) {
    try {
      const response = await chatService.findOrCreateConversation(currentCustomerId.value)
      conversationId.value = response.data

      // Nếu chưa có conversation, sẽ được tạo khi gửi tin nhắn đầu tiên
      if (conversationId.value) {
        await loadMessages(conversationId.value)
        subscribe(conversationId.value, currentCustomerId.value)
      } else {
        messages.value = []
      }
    } catch (error) {
      console.error('Lỗi khi tìm conversation:', error)
      messages.value = []
    }
  } else {
    // Đã có conversationId, load messages
    await loadMessages(conversationId.value)
    subscribe(conversationId.value, currentCustomerId.value)
  }
}

const closeChat = () => {
  isOpen.value = false
  disconnect()
}

const loadMessages = async (convId) => {
  if (!convId) return

  isLoadingMessages.value = true
  try {
    const response = await chatService.getMessages(convId)
    messages.value = response.data || []
    applyWelcomeStateIfNeeded()
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

// Helper methods restored
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

const sendMessage = async () => {
  if (!canSendMessage.value || isSending.value) return

  const messageText = newMessage.value.trim()
  if (!messageText) return

  isSending.value = true

  try {
    if (!currentCustomerId.value) {
      alert('Không tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại.')
      isSending.value = false
      return
    }

    const messageData = {
      khachHangId: currentCustomerId.value,
      nhanVienId: null,
      noiDung: messageText,
      conversationId: conversationId.value || null,
      messageType: 'text',
      isFromCustomer: true,
      replyToId: replyingTo.value?.id || null
    }

    // Try WebSocket first
    const sentViaWs = sendWsMessage('/app/chat.send', messageData)

    if (sentViaWs && conversationId.value) {
      // Optimistic update
      const tempId = 'temp-' + Date.now()
      const optimisticMessage = {
        id: tempId,
        noiDung: messageText,
        isFromCustomer: true,
        ngayPhanHoi: new Date().toISOString(),
        conversationId: conversationId.value,
        messageType: 'text',
        replyToId: replyingTo.value?.id || null,
        replyTo: replyingTo.value || null,
        status: 'sending',
        isRead: false
      }
      messages.value.push(optimisticMessage)
      await nextTick()
      scrollToBottom()

      // WebSocket handles saving and broadcasting
    } else {
      // Fallback: REST API
      console.log('Falling back to REST API for sendMessage')
      const response = await chatService.sendMessage(messageData)

      // Update conversationId if created
      if (!conversationId.value && response.data?.conversationId) {
        conversationId.value = response.data.conversationId
        connect(currentCustomerId.value) // Ensure connected
        // Need to wait slightly before subscribing? Connect is async but fires callback
        // For simplicity, we assume connect keeps retrying
      }

      // Add message to list (if not duplicate logic handled elsewhere, here simple push)
      if (response.data) {
         if (response.data.isFromCustomer) response.data.status = response.data.isRead ? 'read' : 'sent'
         messages.value.push(response.data)
         await nextTick()
         scrollToBottom()
      }
    }

    newMessage.value = ''
    replyingTo.value = null
    applyWelcomeStateIfNeeded()

  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn:', error)
    alert('Không thể gửi tin nhắn. Vui lòng thử lại.')
  } finally {
    isSending.value = false
  }
}

const handleTyping = () => {
  if (!conversationId.value || !currentCustomerId.value) return
  sendWsTyping(conversationId.value, currentCustomerId.value, authStore.user?.hoTen || 'Khách hàng', true)
}

const handleQuickReplySelect = async (reply) => {
  const result = await handleQuickReply(reply)
  if (result.shouldSend) {
     newMessage.value = result.text
     sendMessage()
  }
}

const handleWelcomeOption = (topic) => {
  if (!topic) return
  handleQuickReplySelect(topic)
}

// Old WebSocket methods removed




const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
}

const playNotificationSound = () => {
  if (!soundEnabled.value) return

  try {
    // Base64 ping sound (short beep)
    const audioData = 'data:audio/mp3;base64,SUQzBAAAAAABAFRYVFgAAAASAAADbWFqb3JfYnJhbmQAbXA0MgBUWFRYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFRYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzb21tcDQyAFRTU0UAAAAOAAADbGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//uQZAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABwAADDAcAGBgYGBgYGBhsbGxsbGxsbKioqKioqKiozs7Ozs7Ozs7i4uLi4uLi4vb29vb29vb2////////////////AAAAATFMYXZjNTguMTM0LjEwMAAAAAAAAAAAAAAA//uQZAAAAHP8WwAAAAMAAABwAAAAByo5LAAAAA0AAAHAAAAABjAAAAAAAAAAAAAAAEUAAAAASAAAAE0AAAAAAAAAAAAAAAD/+5BkAAABu1bIAAAAAA4AAAHAAAAAk5yXAAAAADgAAAcAAAAAGMAAAAAAAAAAAAAAARQAAAAJAAAATQAAAAAAAAAAAAAAAP/7kGQAAAG/1seAAAAAOAAABwAAAAJeclwAAAAA4AAAHAAAAABjAAAAAAAAAAAAAAAEUAAAAIgAAABNAAAAAAAAAAAAAAAA//uQZAAAAcvWyAAAAADgAAAcAAAACTnJcAAAAAOAAABwAAAAAYwAAAAAAAAAAAAAABFAAAACwAAAE0AAAAAAAAAAAAAAAD/+5BkAAABv9bIAAAAAOAAABwAAAAJOclwAAAAA4AAAHAAAAABjAAAAAAAAAAAAAAAEUAAAAMgAAABNAAAAAAAAAAAAAAAA//uQZAAAAc/WyAAAAADgAAAcAAAACTnJcAAAAAOAAABwAAAAAYwAAAAAAAAAAAAAABFAAAADoAAAE0AAAAAAAAAAAAAAAD/+5BkAAABvNbIAAAAAOAAABwAAAAJOclwAAAAA4AAAHAAAAABjAAAAAAAAAAAAAAAEUAAAEAAAAABNAAAAAAAAAAAAAAAA//uQZAAAAc/WyAAAAADgAAAcAAAACTnJcAAAAAOAAABwAAAAAYwAAAAAAAAAAAAAABFAAAAEgAAAE0AAAAAAAAAAAAAAAD/+5BkAAADBnJcAAAAAOAAABwAAAAJOclwAAAAA4AAAHAAAAABjAAAAAAAAAAAAAAAEUAAABTAAAATQAAAAAAAAAAAAAAAP/7kGQAAAMyclwAAAAA4AAAHAAAAAk5yXAAAAADgAAAcAAAAAGMAAAAAAAAAAAAAAARQAAAFcAAABNAAAAAAAAAAAAAAAA//uQZAAAAzZyXAAAAADgAAAcAAAACTnJcAAAAAOAAABwAAAAAYwAAAAAAAAAAAAAABFAAAAWwAAAE0AAAAAAAAAAAAAAAD/+5BkAAADNnJcAAAAAOAAABwAAAAJOclwAAAAA4AAAHAAAAABjAAAAAAAAAAAAAAAEUAAABfAAAATQAAAAAAAAAAAAAAAP/7kGQAAAM2clwAAAAA4AAAHAAAAAk5yXAAAAADgAAAcAAAAAGMAAAAAAAAAAAAAAARQAAAGMAAABNAAAAAAAAAAAAAAAA//uQZAAAAzZyXAAAAADgAAAcAAAACTnJcAAAAAOAAABwAAAAAYwAAAAAAAAAAAAAABFAAAAZwAAAE0AAAAAAAAAAAAAAAD/+5BkAAADNnJcAAAAAOAAABwAAAAJOclwAAAAA4AAAHAAAAABjAAAAAAAAAAAAAAAEUAAABrAAAATQAAAAAAAAAAAAAAAP/7kGQAAAM2clwAAAAA4AAAHAAAAAk5yXAAAAADgAAAcAAAAAGMAAAAAAAAAAAAAAARQAAAG8AAABNAAAAAAAAAAAAAAAA//uQZAAAAxZyXAAAAADgAAAcAAAACTnJcAAAAAOAAABwAAAAAYwAAAAAAAAAAAAAABFAAAAcwAAAE0AAAAAAAAAAAAAAAD/'
    const audio = new Audio(audioData)
    audio.play().catch(e => console.warn('Could not play notification sound:', e))
  } catch (e) {
    console.error('Error playing sound:', e)
  }
}

// subscribeToConversation removed


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

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const shouldShowDateSeparator = (message, index) => {
  if (index === 0) return true
  const currentDate = new Date(message.ngayPhanHoi).toDateString()
  const prevDate = new Date(messages.value[index - 1].ngayPhanHoi).toDateString()
  return currentDate !== prevDate
}



const cancelReply = () => {
  replyingTo.value = null
}

const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    alert(`File quá lớn. Kích thước tối đa: 10MB`)
    return
  }

  // Validate file type
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const allowedFileTypes = ['application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  const isImage = allowedImageTypes.includes(file.type)
  const isAllowedFile = isImage || allowedFileTypes.includes(file.type)

  if (!isAllowedFile) {
    alert('Loại file không được hỗ trợ. Chỉ chấp nhận: ảnh (JPG, PNG, GIF, WEBP) hoặc tài liệu (PDF, DOC, DOCX)')
    return
  }

  try {
    // Show preview for images
    if (isImage) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const previewUrl = e.target.result
        showFilePreview(file, previewUrl, true)
      }
      reader.readAsDataURL(file)
    } else {
      // For non-image files, upload directly
      await uploadFile(file)
    }
  } catch (error) {
    console.error('Error handling file:', error)
    alert('Lỗi khi xử lý file. Vui lòng thử lại.')
  }

  // Reset input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const showFilePreview = (file, previewUrl, isImage) => {
  filePreview.value = file
  filePreviewUrl.value = previewUrl
  filePreviewType.value = isImage ? 'image' : 'file'
}

const uploadFile = async (file) => {
  uploadingFile.value = true
  uploadProgress.value = 0

  try {
    const formData = new FormData()
    formData.append('file', file)
    if (conversationId.value) {
      formData.append('conversationId', conversationId.value)
    }

    // Simulate progress (in real implementation, use XMLHttpRequest for progress tracking)
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)

    const response = await fetch('http://localhost:8080/api/chat/upload', {
      method: 'POST',
      body: formData
    })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Upload failed')
    }

    const result = await response.json()
    const fileData = result.data

    // Send message with file
    const messageData = {
      khachHangId: currentCustomerId.value,
      nhanVienId: null,
      noiDung: fileData.fileName || 'Đã gửi file',
      conversationId: conversationId.value || null,
      messageType: fileData.messageType || 'file',
      isFromCustomer: true,
      fileUrl: fileData.fileUrl
    }

    // Send via WebSocket or REST API
    if (wsConnectionStatus.value === 'connected') {
      sendWsMessage('/app/chat.send', messageData)
    } else {
      await chatService.sendMessage(messageData)
    }

    // Clear preview
    filePreview.value = null
    filePreviewUrl.value = null
    filePreviewType.value = null

  } catch (error) {
    console.error('Error uploading file:', error)
    alert('Lỗi khi upload file: ' + error.message)
  } finally {
    uploadingFile.value = false
    uploadProgress.value = 0
  }
}

const sendFileMessage = async () => {
  if (!filePreview.value) return
  await uploadFile(filePreview.value)
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
  if (newConvId && wsConnectionStatus.value === 'connected') {
    subscribe(newConvId, currentCustomerId.value)
  }
})

// Lifecycle - moved to after toggleSound function



// handleWelcomeOption moved up

const startConsultation = () => {
  showConsultationFlow.value = true
}

const handleConsultationComplete = async (data) => {
  showConsultationFlow.value = false

  // Send consultation data to backend via WebSocket
  if (currentCustomerId.value && conversationId.value) {
    const messageData = {
      khachHangId: currentCustomerId.value,
      nhanVienId: null,
      noiDung: 'Tư vấn chọn laptop dựa trên thông tin đã cung cấp',
      conversationId: conversationId.value,
      messageType: 'text',
      isFromCustomer: true,
      consultationData: {
        purposes: data.purposes,
        budget: data.budget,
        features: data.features
      }
    }

    // Send via WebSocket if connected
    if (wsConnectionStatus.value === 'connected') {
        sendWsMessage('/app/chat.send', messageData)
    } else {
      // Fallback to REST API
      try {
        await chatService.sendMessage(messageData)
      } catch (error) {
        console.error('Error sending consultation data:', error)
      }
    }
  }
}

const applyWelcomeStateIfNeeded = () => {
  if (messages.value.length === 0) {
    currentQuickReplies.value = [...defaultQuickReplies]
    showEscalateButton.value = false
    return
  }

  const lastMessage = messages.value[messages.value.length - 1]

  if (lastMessage?.isBotMessage && lastMessage.quickReplies && lastMessage.quickReplies.length > 0) {
    currentQuickReplies.value = lastMessage.quickReplies
  } else {
    const latestBotWithReplies = [...messages.value].reverse().find(
      (msg) => msg.isBotMessage && msg.quickReplies && msg.quickReplies.length > 0
    )
    currentQuickReplies.value = latestBotWithReplies ? latestBotWithReplies.quickReplies : []
  }

  const hasStaffMessage = messages.value.some((msg) => !msg.isFromCustomer && !msg.isBotMessage)
  showEscalateButton.value = !hasStaffMessage
}

// Watch for bot messages with quick replies and welcome state
watch(messages, () => {
  applyWelcomeStateIfNeeded()
}, { deep: true })

// Initialize welcome state on component setup
applyWelcomeStateIfNeeded()

onUnmounted(() => {
   // Cleanup handled by composables
})
</script>

<style scoped>
.chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-launcher {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 10px 12px;
  border-radius: 14px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.25s ease;
}

.chat-launcher:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.16);
}

.launcher-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.launcher-avatar {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e3f2fd 0%, #ede7f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.launcher-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.launcher-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.launcher-title {
  font-weight: 700;
  color: #1f2a44;
}

.launcher-text small {
  color: #6b7280;
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

.chat-launcher .chat-button {
  flex-shrink: 0;
  box-shadow: 0 8px 18px rgba(118, 75, 162, 0.35);
}

.chat-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.chat-button.has-unread {
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
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

.chat-header .btn-link,
.chat-header .btn-link i {
  color: white;
  opacity: 0.9;
}

.chat-header .btn-link:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 6px;
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
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 8px;
}

.header-actions .btn {
  color: white;
  padding: 4px 8px;
}

.header-actions .btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #f5f5f5;
}

.chat-welcome-panel {
  background: linear-gradient(135deg, #f6f9ff 0%, #fdf6ff 100%);
  border-radius: 14px;
  padding: 18px;
  border: 1px solid #e6ecff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.welcome-illustration {
  display: flex;
  justify-content: center;
}

.welcome-illustration img {
  width: 180px;
  max-width: 100%;
}

.welcome-intro h5 {
  font-weight: 800;
  color: #1f2a44;
  margin: 6px 0;
}

.welcome-intro p {
  margin: 0;
  color: #4b5563;
}

.welcome-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eef2ff;
  color: #4338ca;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
}

.welcome-topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.welcome-topic-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(31, 41, 55, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.welcome-topic-card:hover {
  border-color: #6366f1;
  box-shadow: 0 10px 24px rgba(99, 102, 241, 0.18);
  transform: translateY(-2px);
}

.welcome-topic-card i {
  font-size: 18px;
  color: #4338ca;
  background: #eef2ff;
  padding: 8px;
  border-radius: 10px;
}

.welcome-topic-card .topic-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #1f2937;
  text-align: left;
}

.welcome-topic-card .topic-text span {
  color: #6b7280;
  font-size: 12px;
}

.consultation-button-wrapper {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.consultation-btn {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.consultation-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.consultation-btn i {
  font-size: 18px;
}

.topic-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
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
  display: inline-flex;
  align-items: center;
}

.status-sending {
  color: #999;
  animation: pulse 1.5s infinite;
}

.status-sent {
  color: #999;
}

.status-read {
  color: #2196f3;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.typing-indicator {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  margin-bottom: 8px;
}

.typing-content {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 10px 14px;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  max-width: 200px;
}

.typing-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.typing-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.typing-name {
  font-size: 11px;
  color: #666;
  font-weight: 600;
}

.typing-dots {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-dots span {
  width: 6px;
  height: 6px;
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

  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.7;
  }

  30% {
    transform: translateY(-8px);
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

/* Bot badge */
.bot-badge {
  font-size: 11px;
  color: #667eea;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  padding: 4px 8px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  width: fit-content;
}

.bot-badge i {
  font-size: 13px;
}

/* Escalate button */
.escalate-section {
  padding: 12px 16px;
  background: #fff8e1;
  border-top: 1px solid #ffe082;
  border-bottom: 1px solid #ffe082;
}

.escalate-btn {
  width: 100%;
  padding: 10px 16px;
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
}

.escalate-btn:hover {
  background: linear-gradient(135deg, #f57c00 0%, #e65100 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
}

.escalate-btn i {
  font-size: 16px;
}

/* Connection status indicator */
.header-status {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  animation: pulse 2s infinite;
}

.status-indicator.connected {
  background: #4caf50;
  color: #4caf50;
  animation: none;
}

.status-indicator.connecting {
  background: #ff9800;
  color: #ff9800;
}

.status-indicator.reconnecting {
  background: #ff9800;
  color: #ff9800;
  animation: spin 1s linear infinite;
}

.status-indicator.disconnected {
  background: #f44336;
  color: #f44336;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* File Preview Modal */
.file-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
}

.file-preview-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.file-preview-header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-preview-body {
  padding: 1rem;
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
}

.preview-file {
  text-align: center;
  padding: 2rem;
}

.preview-file i {
  color: #667eea;
  margin-bottom: 1rem;
}

.file-preview-footer {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.upload-progress {
  padding: 0 1rem 1rem;
}

.upload-progress .progress {
  height: 8px;
  border-radius: 4px;
  background: #f0f0f0;
  margin-bottom: 4px;
}

.upload-progress .progress-bar {
  background: #667eea;
  transition: width 0.3s;
}

/* Responsive */
@media (max-width: 768px) {
  .chat-widget {
    bottom: 0;
    right: 0;
    left: 0;
  }

  .chat-button {
    width: 56px;
    height: 56px;
    bottom: 16px;
    right: 16px;
  }

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

  .message-bubble {
    max-width: 85%;
  }

  .input-group textarea {
    font-size: 16px;
    /* Prevent zoom on iOS */
  }

  /* Swipe to close gesture area */
  .chat-header {
    position: relative;
  }

  .chat-header::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 4px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 2px;
  }
}

/* Touch gestures for mobile */
@media (hover: none) and (pointer: coarse) {
  .chat-window {
    touch-action: pan-y;
  }

  .message-bubble {
    -webkit-tap-highlight-color: transparent;
  }
}
</style>
