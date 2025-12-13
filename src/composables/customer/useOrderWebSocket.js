import { ref, onUnmounted } from 'vue'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'

/**
 * Composable để listen WebSocket events cho đơn hàng
 * Cập nhật real-time khi admin thay đổi trạng thái
 */
export function useOrderWebSocket(orderId, onStatusUpdate) {
    const isConnected = ref(false)
    const stompClient = ref(null)
    const subscription = ref(null)

    // Store orderId để dùng trong các function
    const currentOrderId = orderId

    /**
     * Kết nối WebSocket
     */
    const connect = () => {
        if (stompClient.value && stompClient.value.connected) {
            console.log('✅ [useOrderWebSocket] Đã kết nối WebSocket rồi')
            return
        }

        if (!orderId) {
            console.warn('⚠️ [useOrderWebSocket] Không có orderId, không thể kết nối')
            return
        }

        try {
            console.log('🔌 [useOrderWebSocket] Đang kết nối WebSocket cho order:', orderId)

            // Lấy base URL từ environment hoặc dùng localhost:8080
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
            const wsUrl = apiBaseUrl.replace(/^https?:\/\//, '') + '/ws'

            const socket = new SockJS(`http://${wsUrl}`)
            const client = Stomp.over(socket)

            // Disable debug logs
            client.debug = () => { }

            client.connect(
                {},
                () => {
                    console.log('✅ [useOrderWebSocket] Đã kết nối WebSocket thành công')
                    isConnected.value = true
                    stompClient.value = client

                    // Subscribe vào topic order status changed
                    subscribeToOrderStatus()
                },
                (error) => {
                    console.error('❌ [useOrderWebSocket] Lỗi kết nối WebSocket:', error)
                    isConnected.value = false

                    // Retry sau 3 giây
                    setTimeout(() => {
                        if (!isConnected.value) {
                            connect()
                        }
                    }, 3000)
                }
            )
        } catch (error) {
            console.error('❌ [useOrderWebSocket] Lỗi khởi tạo WebSocket:', error)
        }
    }

    /**
     * Subscribe vào topic order status changed
     */
    const subscribeToOrderStatus = () => {
        if (!stompClient.value || !stompClient.value.connected) {
            console.warn('⚠️ [useOrderWebSocket] WebSocket chưa kết nối, không thể subscribe')
            return
        }

        try {
            // Subscribe vào topic chung
            subscription.value = stompClient.value.subscribe(
                '/topic/order-status-changed',
                (message) => {
                    try {
                        const data = JSON.parse(message.body)
                        console.log('📨 [useOrderWebSocket] Nhận được event:', data)

                        // Kiểm tra xem có phải đơn hàng hiện tại không
                        // So sánh cả string và UUID format (có thể là UUID object hoặc string)
                        let eventOrderId = data.orderId
                        if (eventOrderId && typeof eventOrderId !== 'string') {
                            eventOrderId = eventOrderId.toString()
                        }

                        let currentOrderIdStr = currentOrderId
                        if (currentOrderIdStr && typeof currentOrderIdStr !== 'string') {
                            currentOrderIdStr = currentOrderIdStr.toString()
                        }

                        // Normalize: remove dashes và lowercase để so sánh
                        const normalizeId = (id) => {
                            if (!id) return ''
                            return id.toString().toLowerCase().replace(/-/g, '')
                        }

                        if (normalizeId(eventOrderId) === normalizeId(currentOrderIdStr)) {
                            console.log('✅ [useOrderWebSocket] Trạng thái đơn hàng đã thay đổi:', {
                                orderId: eventOrderId,
                                oldStatus: data.oldStatus,
                                newStatus: data.newStatus
                            })

                            // Gọi callback để update UI
                            if (onStatusUpdate) {
                                onStatusUpdate(data)
                            }
                        }
                    } catch (error) {
                        console.error('❌ [useOrderWebSocket] Lỗi parse message:', error)
                    }
                },
                (error) => {
                    console.error('❌ [useOrderWebSocket] Lỗi subscribe:', error)
                }
            )

            console.log('✅ [useOrderWebSocket] Đã subscribe vào /topic/order-status-changed')

            // Subscribe vào topic hủy đơn hàng riêng cho order này
            if (currentOrderIdStr) {
                 subscriptionCancelled.value = stompClient.value.subscribe(
                    `/topic/order-cancelled/${currentOrderIdStr}`,
                    (message) => {
                        try {
                            const data = JSON.parse(message.body)
                            console.log('🚫 [useOrderWebSocket] Nhận được event hủy đơn:', data)
                             if (onStatusUpdate) {
                                // Map to similar structure or handle explicitly
                                onStatusUpdate({
                                    ...data,
                                    newStatus: 2, // Assuming 2 is Cancelled, or use reason
                                    isCancelled: true
                                })
                            }
                        } catch (error) {
                            console.error('❌ [useOrderWebSocket] Lỗi parse message hủy:', error)
                        }
                    }
                )
                 console.log(`✅ [useOrderWebSocket] Đã subscribe vào /topic/order-cancelled/${currentOrderIdStr}`)
            }

        } catch (error) {
            console.error('❌ [useOrderWebSocket] Lỗi khi subscribe:', error)
        }
    }

    /**
     * Ngắt kết nối WebSocket
     */
    const disconnect = () => {
        if (subscription.value) {
            subscription.value.unsubscribe()
            subscription.value = null
        }

        if (stompClient.value) {
            if (stompClient.value.connected) {
                stompClient.value.disconnect()
            }
            stompClient.value = null
        }

        isConnected.value = false
        console.log('🔌 [useOrderWebSocket] Đã ngắt kết nối WebSocket')
    }

    // Auto connect khi mount
    connect()

    // Auto disconnect khi unmount
    onUnmounted(() => {
        disconnect()
    })

    return {
        isConnected,
        connect,
        disconnect
    }
}

