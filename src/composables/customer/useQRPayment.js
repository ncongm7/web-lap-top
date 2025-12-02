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
      startPaymentCheck()

      // 🔥 AUTO-SIMULATE: Tự động gọi webhook sau 30 giây (giả lập user đã chuyển khoản)
      // Trong production thực tế, webhook được gọi từ bank
      setTimeout(async () => {
        if (status.value === 'checking') {
          console.log('🤖 [useQRPayment] Auto-simulating payment success...')
          try {
            await mockPaymentWebhook({
              orderCode: qrCodeData.value.orderCode,
              transactionId: `TXN${Date.now()}`,
              amount: qrCodeData.value.amount,
            })
            console.log('✅ [useQRPayment] Mock webhook sent successfully')
          } catch (err) {
            console.error('❌ [useQRPayment] Mock webhook error:', err)
          }
        }
      }, 2000) // 2 giây
    } catch (err) {
      console.error('❌ [useQRPayment] Generate QR error:', err)
      error.value = err.response?.data?.message || 'Không thể tạo mã QR. Vui lòng thử lại.'
    } finally {
      loading.value = false
    }
  }

  /**
   * Bắt đầu polling kiểm tra trạng thái thanh toán
   */
  const startPaymentCheck = () => {
    // Clear interval cũ nếu có
    stopPaymentCheck()

    status.value = 'checking'

    // Poll mỗi 5 giây
    paymentCheckInterval = setInterval(async () => {
      // Check expiry first
      checkExpiry()

      // Check payment status if has hoaDonId
      if (currentHoaDonId.value) {
        console.log('🔍 [useQRPayment] Polling payment status for hoaDonId:', currentHoaDonId.value)
        await checkStatus(currentHoaDonId.value)
      }
    }, 5000)
  }

  /**
   * Dừng polling payment check
   */
  const stopPaymentCheck = () => {
    if (paymentCheckInterval) {
      clearInterval(paymentCheckInterval)
      paymentCheckInterval = null
    }
  }

  /**
   * Kiểm tra hết hạn QR code
   */
  const checkExpiry = () => {
    if (!qrCodeData.value?.expiryTime) return

    const now = dayjs()
    const expiry = dayjs(qrCodeData.value.expiryTime)

    if (now.isAfter(expiry)) {
      handleExpired()
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán (được gọi từ bên ngoài khi có orderId)
   */
  const checkStatus = async (orderId) => {
    if (!orderId) return

    try {
      const response = await checkPaymentStatus(orderId)
      const data = response.data

      if (data.trangThaiThanhToan === 1) {
        handlePaymentConfirmed(data)
      }
    } catch (err) {
      console.error('❌ [useQRPayment] Check status error:', err)
    }
  }

  /**
   * Xử lý khi QR code hết hạn
   */
  const handleExpired = () => {
    status.value = 'expired'
    stopPaymentCheck()
    error.value = 'Mã QR đã hết hạn. Vui lòng tạo lại.'
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
  }
}
