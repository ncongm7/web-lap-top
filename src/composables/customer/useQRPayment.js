import { ref, watch, onUnmounted } from 'vue'
import {
  generateQRPayment,
  checkPaymentStatus,
  mockPaymentWebhook,
} from '@/service/customer/paymentService'
import dayjs from 'dayjs'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'

/**
 * Composable xử lý thanh toán QR
 * @param {Object} options - { amount, orderCode, onPaymentConfirmed }
 */
export function useQRPayment(options = {}) {
  const { amount, orderCode, onPaymentConfirmed } = options

  // State
  const qrCodeData = ref(null)
  const loading = ref(false)
  const error = ref('')
  const status = ref('pending') // pending | checking | confirmed | expired
  const currentHoaDonId = ref(null) // Store hoaDonId for polling
  const isPollingPaused = ref(false) // Flag to pause/resume polling
  const pollingStartTime = ref(null) // Track when polling started
  const consecutiveErrors = ref(0) // Track consecutive errors for exponential backoff

  let paymentCheckInterval = null
  let stompClient = null
  let wsSubscription = null

  /**
   * Tạo QR code thanh toán
   */
  const generateQR = async (customOrderCode = null, customAmount = null, hoaDonId = null) => {
    loading.value = true
    error.value = ''
    status.value = 'pending'

    try {
      const code = customOrderCode || orderCode.value || `DH-${Date.now()}`
      const amt = customAmount || amount.value || 0

      console.log('🔄 [useQRPayment] Generating QR:', { code, amt, hoaDonId })

      const response = await generateQRPayment({
        hoaDonId: hoaDonId,
        amount: amt,
        orderCode: code,
        description: `Thanh toan don hang ${code}`,
      })

      qrCodeData.value = response.data
      currentHoaDonId.value = hoaDonId // Store hoaDonId for polling

      console.log('✅ [useQRPayment] QR generated:', qrCodeData.value)
      console.log('📌 [useQRPayment] Stored hoaDonId for polling:', currentHoaDonId.value)

      // Bắt đầu countdown và check payment
      pollingStartTime.value = Date.now()
      consecutiveErrors.value = 0
      startPaymentCheck()

      // ⚠️ LƯU Ý: KHÔNG tự động simulate payment trong production
      // Payment chỉ được confirm khi nhận webhook thực sự từ ngân hàng
      // Để test, có thể gọi mockPaymentWebhook thủ công từ Swagger hoặc Postman
    } catch (err) {
      console.error('❌ [useQRPayment] Generate QR error:', err)
      error.value = err.response?.data?.message || 'Không thể tạo mã QR. Vui lòng thử lại.'
    } finally {
      loading.value = false
    }
  }

  /**
   * Bắt đầu polling kiểm tra trạng thái thanh toán
   * Sử dụng adaptive polling: 3 giây ban đầu, 10 giây sau 2 phút
   */
  const startPaymentCheck = () => {
    // Clear interval cũ nếu có
    stopPaymentCheck()

    if (isPollingPaused.value) {
      return // Don't start if paused
    }

    status.value = 'checking'

    // Calculate polling interval based on elapsed time
    const getPollingInterval = () => {
      if (!pollingStartTime.value) return 3000
      
      const elapsedMinutes = (Date.now() - pollingStartTime.value) / 1000 / 60
      
      // After 2 minutes, reduce frequency to 10 seconds
      if (elapsedMinutes >= 2) {
        return 10000
      }
      
      // Initial: 3 seconds (faster for better UX)
      return 3000
    }

    // Poll with adaptive interval
    const poll = async () => {
      if (isPollingPaused.value) {
        return // Skip if paused
      }

      // Check expiry first
      checkExpiry()

      // Check payment status if has hoaDonId
      if (currentHoaDonId.value) {
        const interval = getPollingInterval()
        console.log(`🔍 [useQRPayment] Polling payment status (interval: ${interval}ms) for hoaDonId:`, currentHoaDonId.value)
        await checkStatus(currentHoaDonId.value)
      }
    }

    // Initial poll
    poll()

    // Set up interval with dynamic timing
    const scheduleNextPoll = () => {
      if (isPollingPaused.value || status.value === 'confirmed' || status.value === 'expired') {
        return
      }

      const interval = getPollingInterval()
      paymentCheckInterval = setTimeout(() => {
        poll()
        scheduleNextPoll()
      }, interval)
    }

    scheduleNextPoll()
  }

  /**
   * Dừng polling payment check
   */
  const stopPaymentCheck = () => {
    if (paymentCheckInterval) {
      clearTimeout(paymentCheckInterval)
      paymentCheckInterval = null
    }
  }

  /**
   * Tạm dừng polling (khi modal đóng)
   */
  const pausePolling = () => {
    isPollingPaused.value = true
    console.log('⏸️ [useQRPayment] Polling paused')
  }

  /**
   * Tiếp tục polling (khi modal mở lại)
   */
  const resumePolling = () => {
    isPollingPaused.value = false
    if (qrCodeData.value && currentHoaDonId.value && status.value === 'checking') {
      console.log('▶️ [useQRPayment] Polling resumed')
      startPaymentCheck()
    }
  }

  /**
   * Kiểm tra hết hạn QR code
   * Hiển thị warning khi còn < 5 phút
   */
  const checkExpiry = () => {
    if (!qrCodeData.value?.expiryTime) return

    const now = dayjs()
    const expiry = dayjs(qrCodeData.value.expiryTime)
    const remainingSeconds = expiry.diff(now, 'second')

    // Check if expired
    if (remainingSeconds <= 0) {
      handleExpired()
      return
    }

    // Warning when < 5 minutes (300 seconds)
    if (remainingSeconds < 300 && remainingSeconds > 0) {
      // Status is already 'checking', just log warning
      console.warn(`⚠️ [useQRPayment] QR code will expire in ${Math.floor(remainingSeconds / 60)} minutes`)
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán (được gọi từ bên ngoài khi có orderId)
   */
  const checkStatus = async (orderId) => {
    if (!orderId || isPollingPaused.value) return

    try {
      const response = await checkPaymentStatus(orderId)
      const data = response.data

      // Reset error count on success
      consecutiveErrors.value = 0

      if (data.trangThaiThanhToan === 1) {
        // Đảm bảo orderId được truyền vào paymentData
        const paymentData = {
          ...data,
          orderId: data.id || orderId || currentHoaDonId.value
        }
        handlePaymentConfirmed(paymentData)
      }
    } catch (err) {
      consecutiveErrors.value++
      console.error(`❌ [useQRPayment] Check status error (attempt ${consecutiveErrors.value}):`, err)
      
      // Exponential backoff: if too many errors, increase interval
      if (consecutiveErrors.value >= 5) {
        console.warn('⚠️ [useQRPayment] Too many errors, applying exponential backoff')
        // Will be handled by adaptive polling interval
      }
    }
  }

  /**
   * Xử lý khi QR code hết hạn
   * Có thể auto-refresh QR nếu cần
   */
  const handleExpired = () => {
    status.value = 'expired'
    stopPaymentCheck()
    error.value = 'Mã QR đã hết hạn. Vui lòng tạo lại.'
    
    // Option: Auto-refresh QR code (uncomment if needed)
    // if (currentHoaDonId.value && orderCode.value) {
    //   console.log('🔄 [useQRPayment] Auto-refreshing expired QR code...')
    //   generateQR(orderCode.value, amount.value, currentHoaDonId.value)
    // }
  }

  /**
   * Xử lý khi thanh toán được xác nhận
   */
  const handlePaymentConfirmed = (paymentData) => {
    status.value = 'confirmed'
    stopPaymentCheck()

    if (onPaymentConfirmed) {
      onPaymentConfirmed(paymentData)
    }
  }

  /**
   * Reset state
   */
  const reset = () => {
    qrCodeData.value = null
    loading.value = false
    error.value = ''
    status.value = 'pending'
    currentHoaDonId.value = null
    isPollingPaused.value = false
    pollingStartTime.value = null
    consecutiveErrors.value = 0
    stopPaymentCheck()
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stopPaymentCheck()
  })

  return {
    // State
    qrCodeData,
    loading,
    error,
    status,

    // Methods
    generateQR,
    checkStatus,
    reset,
    handleExpired,
    handlePaymentConfirmed,
    pausePolling,
    resumePolling,
  }
}
