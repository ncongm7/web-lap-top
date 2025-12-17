import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/customer/cartStore'
import { useToast } from 'vue-toastification'

export function useChatActions(options = {}) {
  const {
    sendMessage, // Function to send message (passed from ChatWidget)
    closeChat,   // Function to close chat
    setNewMessage // Function to update input text
  } = options

  const router = useRouter()
  const cartStore = useCartStore()
  const toast = useToast()

  /**
   * Handle Quick Reply Selection
   */
  const handleQuickReply = async (reply) => {
    console.log('🎯 Quick reply selected:', reply)

    // Handle ACTION type quick replies
    if (reply.replyType === 'ACTION') {
      await handleAction(reply.replyValue)
    }

    // For all types, send message to bot
    // We assume the caller handles setting message and sending
    // returning true to indicate handled
    return {
        text: reply.replyText,
        shouldSend: true
    }
  }

  /**
   * Handle Action Commands
   * Format: "action_type|parameter"
   */
  const handleAction = async (actionString) => {
    const [action, param] = actionString.split('|')

    try {
      switch (action) {
        // ========== SALES ACTIONS ==========
        case 'add_to_cart':
          try {
            const productResponse = await fetch(`http://localhost:8080/api/san-pham/${param}`)
            const productData = await productResponse.json()

            if (productData.data?.chiTietSanPhams?.length > 0) {
              const firstVariant = productData.data.chiTietSanPhams[0]
              await cartStore.addToCart(firstVariant.id, 1)
              toast.success('✅ Đã thêm sản phẩm vào giỏ hàng!')
            } else {
              toast.error('Sản phẩm không có biến thể')
            }
          } catch (error) {
            console.error('Error adding to cart:', error)
            toast.error('Không thể thêm vào giỏ hàng')
          }
          break

        case 'view_product':
          router.push(`/products/${param}`)
          if(closeChat) closeChat()
          break

        // ========== ORDER ACTIONS ==========
        case 'view_order':
          router.push(`/orders/${param}`)
          if(closeChat) closeChat()
          break

        case 'pay_order':
          router.push(`/checkout?orderId=${param}`)
          if(closeChat) closeChat()
          break

        case 'cancel_order':
          if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
            try {
              // Note: API URL logic might need to be centralized or use service
              await fetch(`http://localhost:8080/api/v1/customer/orders/${param}/cancel`, {
                method: 'POST',
                headers: { // Auth header should be handled by axios interceptor if possible, but here using fetch
                  'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('customer_token')}`,
                  'Content-Type': 'application/json'
                }
              })
              toast.success('Đơn hàng đã được hủy')
              return { handled: true, message: 'Tôi đã hủy đơn hàng' }
            } catch (error) {
              toast.error('Không thể hủy đơn hàng')
            }
          }
          break

        case 'review_order':
          router.push(`/orders/${param}/review`)
          if(closeChat) closeChat()
          break

        // ========== WARRANTY ACTIONS ==========
        case 'create_warranty':
          router.push(`/warranty/create?serial=${param}`)
          if(closeChat) closeChat()
          break

        case 'warranty_history':
          router.push(`/warranty/history?serial=${param}`)
          if(closeChat) closeChat()
          break

        // ========== ACCOUNT ACTIONS ==========
        case 'login_redirect':
          router.push('/login')
          if(closeChat) closeChat()
          break

        case 'register_redirect':
          router.push('/register')
          if(closeChat) closeChat()
          break

        case 'profile_page':
          router.push('/profile')
          if(closeChat) closeChat()
          break

        case 'change_password':
          router.push('/profile?tab=security')
          if(closeChat) closeChat()
          break

        case 'manage_address':
          router.push('/profile?tab=addresses')
          if(closeChat) closeChat()
          break

        case 'points_page':
          router.push('/profile?tab=points')
          if(closeChat) closeChat()
          break

        // ========== SUPPORT ACTIONS ==========
        case 'ESCALATE':
          // Identify this action to caller
          return { handled: true, action: 'ESCALATE' }

        default:
          console.warn('Unknown action:', action)
          return { handled: false, text: actionString }
      }
    } catch (error) {
      console.error('Error handling action:', error)
      toast.error('Có lỗi xảy ra khi xử lý hành động.')
    }
  }

  return {
    handleQuickReply,
    handleAction
  }
}
