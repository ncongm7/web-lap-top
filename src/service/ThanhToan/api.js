// API service for checkout (clean normalized file)
import { provinces, wardsByProvince } from '../../data/vietnam-locations.js'

export const apiService = {
  async getAddresses() {
    return [
      {
        id: 1,
        full_name: 'Nguyễn Văn A',
        phone: '0123456789',
        email: 'nguyenvana@example.com',
        province_id: 1,
        province_name: 'Hà Nội',
        ward_id: 1,
        ward_name: 'Phường Cống Vị',
        address_detail: '123 Đường ABC',
        is_default: true,
      },
    ]
  },

  async getProvinces() {
    return provinces
  },

  async getDistricts(provinceId) {
    const districts = {
      1: [
        { id: 1, name: 'Quận Ba Đình' },
        { id: 2, name: 'Quận Hoàn Kiếm' },
        { id: 3, name: 'Quận Đống Đa' },
      ],
      2: [
        { id: 4, name: 'Quận 1' },
        { id: 5, name: 'Quận 2' },
        { id: 6, name: 'Quận 3' },
      ],
    }
    return districts[provinceId] || []
  },

  // Deprecated but kept for compatibility
  // eslint-disable-next-line no-unused-vars
  async getWards(_districtId) {
    return []
  },

  async getWardsByProvince(provinceId) {
    return wardsByProvince[provinceId] || []
  },

  async getShippingMethods() {
    return [
      {
        id: 1,
        name: 'Giao hàng tiêu chuẩn',
        description: 'Giao hàng trong 3-5 ngày làm việc',
        fee: 30000,
        estimated_days: '3-5',
      },
      {
        id: 2,
        name: 'Giao hàng nhanh',
        description: 'Giao hàng trong 1-2 ngày làm việc',
        fee: 50000,
        estimated_days: '1-2',
      },
      {
        id: 3,
        name: 'Giao hàng siêu tốc',
        description: 'Giao hàng trong ngày',
        fee: 80000,
        estimated_days: '1',
      },
    ]
  },

  async getPaymentMethods() {
    return [
      {
        id: 1,
        name: 'COD - Thanh toán khi nhận hàng',
        code: 'COD',
        description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      },
      {
        id: 2,
        name: 'Chuyển khoản ngân hàng',
        code: 'BANK_TRANSFER',
        description: 'Chuyển khoản qua ngân hàng',
        bank_info: {
          bank_name: 'Vietcombank',
          account_number: '1234567890',
          account_holder: 'CÔNG TY ABC',
          branch: 'Chi nhánh Hà Nội',
        },
      },
    ]
  },

  // eslint-disable-next-line no-unused-vars
  async validateCart(_cartData) {
    return { valid: true, errors: [] }
  },

  // eslint-disable-next-line no-unused-vars
  async createOrder(_orderData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          order_id: 'ORD' + Date.now(),
          order_number: 'ORD' + Date.now(),
          message: 'Đặt hàng thành công!',
        })
      }, 1000)
    })
  },

  async getCartItems() {
    return [
      {
        id: 1,
        product_id: 1,
        product_name: 'Sản phẩm 1',
        product_image: 'https://via.placeholder.com/100',
        price: 200000,
        quantity: 2,
        subtotal: 400000,
      },
      {
        id: 2,
        product_id: 2,
        product_name: 'Sản phẩm 2',
        product_image: 'https://via.placeholder.com/100',
        price: 150000,
        quantity: 1,
        subtotal: 150000,
      },
    ]
  },
}
