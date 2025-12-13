/**
 * CHATBOT REDESIGN - FRONTEND ACTION HANDLERS
 * Add this code to ChatWidget.vue in <script setup> section
 * Location: After line 750 (after handleTyping function)
 */

// ========== IMPORT DEPENDENCIES (add to top) ==========
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/customer/cartStore'
import { useToast } from 'vue-toastification'

// Add these in setup:
const router = useRouter()
const cartStore = useCartStore()
const toast = useToast()

// ========== NEW: ACTION HANDLERS ==========

/**
 * Handle Quick Reply Selection
 * This is called when user clicks a quick reply button
 */
const handleQuickReplySelect = async (reply) => {
  console.log('Quick reply selected:', reply)
  
  // Handle ACTION type quick replies
  if (reply.replyType === 'ACTION') {
    await handleQuickReplyAction(reply.replyValue)
  }
  
  // For all types, send message to bot
  newMessage.value = reply.replyText
  await sendMessage()
}

/**
 * Handle Quick Reply Actions
 * Format: "action_type|parameter"
 */
const handleQuickReplyAction = async (replyValue) => {
  const [action, param] = replyValue.split('|')
  
  try {
    switch (action) {
      // ========== SALES ACTIONS ==========
      
      case 'add_to_cart':
        // Add product variant to cart
        // Param is product ID, need to get first variant
        try {
          // Get product details to find first variant
          const productResponse = await fetch(`http://localhost:8080/api/san-pham/${param}`)
          const productData = await productResponse.json()
          
          if (productData.data && productData.data.chiTietSanPhams && productData.data.chiTietSanPhams.length > 0) {
            const firstVariant = productData.data.chiTietSanPhams[0]
            await cartStore.addToCart(firstVariant.id, 1)
            toast.success('✅ Đã thêm sản phẩm vào giỏ hàng!')
          } else {
            toast.error('Sản phẩm không có biến thể khả dụng')
          }
        } catch (error) {
          console.error('Error adding to cart:', error)
          toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại!')
        }
        break
      
      case 'view_product':
        // Navigate to product detail page
        router.push(`/products/${param}`)
        closeChat() // Close chat when navigating
        break
      
      // ========== ORDER ACTIONS ==========
      
      case 'view_order':
        // Navigate to order detail page
        router.push(`/orders/${param}`)
        closeChat()
        break
      
      case 'pay_order':
        // Navigate to payment page for order
        router.push(`/checkout?orderId=${param}`)
        closeChat()
        break
      
      case 'cancel_order':
        // Show confirm dialog
        if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
          try {
            await fetch(`http://localhost:8080/api/v1/customer/orders/${param}/cancel`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                'Content-Type': 'application/json'
              }
            })
            toast.success('Đơn hàng đã được hủy')
            // Send confirmation message to chat
            newMessage.value = 'Tôi đã hủy đơn hàng'
            await sendMessage()
          } catch (error) {
            toast.error('Không thể hủy đơn hàng')
          }
        }
        break
      
      case 'review_order':
        // Navigate to review page
        router.push(`/orders/${param}/review`)
        closeChat()
        break
      
      // ========== WARRANTY ACTIONS ==========
      
      case 'create_warranty':
        // Navigate to warranty request creation
        router.push(`/warranty/create?serial=${param}`)
        closeChat()
        break
      
      case 'warranty_history':
        // Navigate to warranty history
        router.push(`/warranty/history?serial=${param}`)
        closeChat()
        break
      
      // ========== ACCOUNT ACTIONS ==========
      
      case 'login_redirect':
        // Navigate to login page
        router.push('/login')
        closeChat()
        break
      
      case 'register_redirect':
        // Navigate to register  page
        router.push('/register')
        closeChat()
        break
      
      case 'profile_page':
        // Navigate to profile page
        router.push('/profile')
        closeChat()
        break
      
      case 'change_password':
        // Navigate to profile page, password tab
        router.push('/profile?tab=security')
        closeChat()
        break
      
      case 'manage_address':
        // Navigate to address management
        router.push('/profile?tab=addresses')
        closeChat()
        break
      
      case 'points_page':
        // Navigate to loyalty points page
        router.push('/profile?tab=points')
        closeChat()
        break
      
      // ========== SUPPORT ACTIONS ==========
      
      case 'ESCALATE':
        // Request human support
        await requestHumanSupport()
        break
      
      default:
        console.warn('Unknown action:', action)
        // Send as normal message
        newMessage.value = replyValue
        await sendMessage()
    }
  } catch (error) {
    console.error('Error handling quick reply action:', error)
    toast.error('Có lỗi xảy ra. Vui lòng thử lại!')
  }
}

/**
 * Request Human Support
 * Escalate conversation to human agent
 */
const requestHumanSupport = async () => {
  try {
    newMessage.value = 'Tôi muốn nói chuyện với nhân viên'
    await sendMessage()
    
    // Optional: Call API to escalate
    if (conversationId.value) {
      await fetch(`http://localhost:8080/api/chat/escalate/${conversationId.value}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      })
    }
    
    toast.info('Đang kết nối với nhân viên tư vấn...')
    showEscalateButton.value = false
  } catch (error) {
    console.error('Error requesting human support:', error)
  }
}

/**
 * Handle bot response with quick replies
 * Called when receiving WebSocket message from bot
 */
const handleBotResponse = (message) => {
  // Add message to list
  messages.value.push(message)
  
  // Update quick replies if provided
  if (message.quickReplies && Array.isArray(message.quickReplies)) {
    currentQuickReplies.value = message.quickReplies
  } else {
    currentQuickReplies.value = []
  }
  
  // Update escalate button visibility
  if (message.shouldEscalate) {
    showEscalateButton.value = true
  }
  
  // Scroll to bottom
  nextTick(() => {
    scrollToBottom()
  })
  
  // Play sound if enabled
  if (soundEnabled.value) {
    playNotificationSound()
  }
}

// ========== UPDATE WebSocket message handler ==========
// Find the existing WebSocket subscription and UPDATE it to call handleBotResponse

// In subscribeToConversation function, UPDATE the message handler:
/*
stompClient.subscribe(`/topic/chat.${convId}`, (message) => {
  const receivedMessage = JSON.parse(message.body)
  
  // Check if message is from bot
  if (receivedMessage.isBotMessage) {
    handleBotResponse(receivedMessage)
  } else {
    // Regular message handling
    const existingIndex = messages.value.findIndex(m => 
      m.id === receivedMessage.id ||
      (m.id && m.id.startsWith('temp-') && 
       m.noiDung === receivedMessage.noiDung &&
       m.isFromCustomer === receivedMessage.isFromCustomer)
    )
    
    if (existingIndex !== -1) {
      messages.value[existingIndex] = receivedMessage
    } else {
      messages.value.push(receivedMessage)
    }
    
    nextTick(() => scrollToBottom())
    if (soundEnabled.value) playNotificationSound()
  }
})
*/

console.log('✅ Chatbot action handlers loaded!')
