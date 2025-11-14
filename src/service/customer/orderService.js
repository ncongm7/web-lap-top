import axiosInstance from '../axiosInstance'

const API_BASE = '/api/v1/customer/orders'

/**
 * Service quản lý đơn hàng của customer
 */

/**
 * Tạo đơn hàng
 */
export const createOrder = async (orderData) => {
  try {
    console.log('📦 [OrderService] Tạo đơn hàng:', orderData)
    const response = await axiosInstance.post(API_BASE, orderData)
    console.log('✅ [OrderService] Đơn hàng đã được tạo:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ [OrderService] Lỗi khi tạo đơn hàng:', error)
    throw error
  }
}

/**
 * Lấy danh sách đơn hàng của customer
 */
export const getOrders = async (khachHangId, page = 0, size = 10) => {
  try {
    console.log('📋 [OrderService] Lấy danh sách đơn hàng:', { khachHangId, page, size })
    const response = await axiosInstance.get(API_BASE, {
      params: { khachHangId, page, size },
    })
    console.log('✅ [OrderService] Danh sách đơn hàng:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ [OrderService] Lỗi khi lấy danh sách đơn hàng:', error)
    throw error
  }
}

/**
 * Lấy chi tiết đơn hàng
 */
export const getOrderDetail = async (idHoaDon) => {
  try {
    console.log('🔍 [OrderService] Lấy chi tiết đơn hàng:', idHoaDon)
    const response = await axiosInstance.get(`${API_BASE}/${idHoaDon}`)
    console.log('✅ [OrderService] Chi tiết đơn hàng:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ [OrderService] Lỗi khi lấy chi tiết đơn hàng:', error)
    throw error
  }
}

export default {
  createOrder,
  getOrders,
  getOrderDetail,
}
