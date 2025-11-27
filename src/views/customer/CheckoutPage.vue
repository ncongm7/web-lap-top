<template>
  <div class="checkout-page">
    <div class="container py-4">
      <h2 class="mb-4">Thanh toán đơn hàng</h2>

      <div v-if="!orderItems.length" class="alert alert-warning">
        <p>Không có sản phẩm để thanh toán. Vui lòng quay lại trang sản phẩm.</p>
        <router-link to="/" class="btn checkout-btn">Quay lại trang chủ</router-link>
      </div>

      <div v-else class="row">
        <!-- Left Column: Form -->
        <div class="col-lg-8">
          <!-- Customer Information -->
          <div class="card mb-4">
            <div class="card-header checkout-header">
              <h5 class="mb-0">Thông tin khách hàng</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleSubmit">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Họ và tên <span class="text-danger">*</span></label>
                    <input
                      v-model="formData.tenKhachHang"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.tenKhachHang }"
                      placeholder="Nhập họ và tên"
                      @blur="validateTenKhachHang"
                      @input="clearError('tenKhachHang')"
                    />
                    <div v-if="formErrors.tenKhachHang" class="invalid-feedback">
                      {{ formErrors.tenKhachHang }}
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
                    <input
                      v-model="formData.soDienThoai"
                      type="tel"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.soDienThoai }"
                      placeholder="Nhập số điện thoại"
                      @blur="validateSoDienThoai"
                      @input="clearError('soDienThoai')"
                    />
                    <div v-if="formErrors.soDienThoai" class="invalid-feedback">
                      {{ formErrors.soDienThoai }}
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    v-model="formData.email"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': formErrors.email }"
                    placeholder="Nhập email (để nhận xác nhận đơn hàng)"
                    @blur="validateEmail"
                    @input="clearError('email')"
                  />
                  <div v-if="formErrors.email" class="invalid-feedback">
                    {{ formErrors.email }}
                  </div>
                </div>

                <!-- Địa chỉ giao hàng -->
                <div class="mb-3">
                  <label class="form-label">Địa chỉ giao hàng <span class="text-danger">*</span></label>

                  <!-- Dropdown chọn địa chỉ đã lưu -->
                  <div v-if="savedAddresses.length > 0" class="mb-3">
                    <select
                      v-model="selectedSavedAddressId"
                      @change="loadSavedAddress"
                      class="form-select"
                    >
                      <option value="">-- Chọn địa chỉ đã lưu --</option>
                      <option v-for="addr in savedAddresses" :key="addr.id" :value="addr.id">
                        {{ formatAddressDisplay(addr) }}
                      </option>
                    </select>
                  </div>

                  <!-- Form nhập địa chỉ mới -->
                  <AddressForm
                    v-model="addressFormData"
                    :show-save-button="true"
                    :check-duplicate-fn="checkDuplicateAddress"
                    @success="handleAddressSaved"
                    ref="addressFormRef"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Ghi chú</label>
                  <textarea v-model="formData.ghiChu" class="form-control" rows="2"
                    placeholder="Ghi chú cho đơn hàng (nếu có)"></textarea>
                </div>
              </form>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="card mb-4">
            <div class="card-header checkout-header">
              <h5 class="mb-0">Phương thức thanh toán</h5>
            </div>
            <div class="card-body">
              <div class="form-check mb-3">
                <input v-model="formData.phuongThucThanhToan" class="form-check-input" type="radio" name="paymentMethod"
                  :value="0" id="cod" />
                <label class="form-check-label" for="cod">
                  <strong>Thanh toán khi nhận hàng (COD)</strong>
                  <small class="d-block text-muted">Thanh toán bằng tiền mặt khi nhận hàng</small>
                </label>
              </div>
              <div class="form-check">
                <input v-model="formData.phuongThucThanhToan" class="form-check-input" type="radio" name="paymentMethod"
                  :value="1" id="online" />
                <label class="form-check-label" for="online">
                  <strong>Thanh toán online</strong>
                  <small class="d-block text-muted">Chuyển khoản qua ngân hàng hoặc ví điện tử</small>
                </label>
              </div>
            </div>
          </div>

          <!-- Online Payment Info -->
          <div v-if="formData.phuongThucThanhToan === 1" class="card mb-4 payment-info-card">
            <div class="card-header payment-info-header">
              <h5 class="mb-0">Thông tin thanh toán</h5>
            </div>
            <div class="card-body text-center">
              <div class="mb-3">
                <h6>Quét mã QR để thanh toán</h6>
                <div class="qr-code-placeholder bg-light p-4 rounded d-inline-block">
                  <div class="qr-code">
                    <div class="qr-placeholder-text">QR Code</div>
                  </div>
                  <p class="text-muted small mt-2">Hoặc chuyển khoản đến:</p>
                </div>
              </div>
              <div class="bank-info">
                <p class="mb-1"><strong>Ngân hàng:</strong> Vietcombank</p>
                <p class="mb-1">
                  <strong>Số tài khoản:</strong>
                  <span class="text-primary fw-bold">1234567890</span>
                </p>
                <p class="mb-1"><strong>Chủ tài khoản:</strong> CONG TY TNHH VIETLAPTOP</p>
                <p class="mb-0">
                  <strong>Nội dung chuyển khoản:</strong>
                  <span class="text-danger fw-bold">{{ orderCode }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Order Summary -->
        <div class="col-lg-4">
          <div class="card sticky-top" style="top: 20px">
            <div class="card-header checkout-header">
              <h5 class="mb-0">Tóm tắt đơn hàng</h5>
            </div>
            <div class="card-body">
              <!-- Products List -->
              <div class="order-items mb-3">
                <div v-for="(item, index) in orderItems" :key="index" class="d-flex mb-3 pb-3 border-bottom">
                  <img :src="item.imageUrl || '/placeholder.jpg'" :alt="item.tenSp" class="product-image me-2"
                    style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px" />
                  <div class="flex-grow-1">
                    <h6 class="mb-1 small">{{ item.tenSp }}</h6>
                    <div class="d-flex justify-content-between">
                      <span class="text-muted small">x{{ item.soLuong }}</span>
                      <span class="fw-bold">{{ formatPrice(item.thanhTien) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Summary -->
              <div class="order-summary">
                <div class="d-flex justify-content-between mb-2">
                  <span>Tạm tính:</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Phí vận chuyển:</span>
                  <span>{{ formatPrice(shippingFee) }}</span>
                </div>
                <div v-if="discount > 0" class="d-flex justify-content-between mb-2 text-danger">
                  <span>Giảm giá:</span>
                  <span>-{{ formatPrice(discount) }}</span>
                </div>
                <hr />
                <div class="d-flex justify-content-between mb-3">
                  <strong>Tổng cộng:</strong>
                  <strong class="text-danger fs-5">{{ formatPrice(total) }}</strong>
                </div>
              </div>

              <!-- Submit Button -->
              <button @click="handleSubmit" class="btn checkout-btn w-100 btn-lg" :disabled="loading || !canSubmit">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Đang xử lý...' : 'Đặt hàng' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/customer/authStore'
import { useCartStore } from '@/stores/customer/cartStore'
import orderService from '@/service/customer/orderService'
import customerService from '@/service/customer/customerService'
import addressService from '@/service/customer/addressService'
import AddressForm from '@/components/customer/checkout/AddressForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

// Form data
const formData = ref({
  tenKhachHang: '',
  soDienThoai: '',
  email: '',
  diaChi: '',
  ghiChu: '',
  phuongThucThanhToan: 0, // 0: COD, 1: Online
})

// Form errors
const formErrors = ref({
  tenKhachHang: '',
  soDienThoai: '',
  email: '',
  diaChi: '',
})

// Address form data
const addressFormData = ref({
  diaChi: '',
  tinh: '',
  xa: '',
  tinhCode: '',
  xaCode: '',
})

// Saved addresses
const savedAddresses = ref([])
const selectedSavedAddressId = ref('')
const isLoadingAddresses = ref(false)
const addressFormRef = ref(null)

// Order items
const orderItems = ref([])
const loading = ref(false)
const orderCode = ref('')

// Load checkout data from sessionStorage or cartStore
onMounted(async () => {
  // Load user info if logged in
  const user = authStore.getCurrentUser()
  const customerId = authStore.getCustomerId()

  // Tự động fill thông tin từ profile nếu đã đăng nhập
  if (customerId) {
    try {
      const profileResponse = await customerService.getCustomerProfile(customerId)
      if (profileResponse.success && profileResponse.data) {
        const profile = profileResponse.data
        // Fill thông tin từ profile
        formData.value.tenKhachHang = profile.hoTen || ''
        formData.value.soDienThoai = profile.soDienThoai || ''
        formData.value.email = profile.email || ''

        // Fill địa chỉ mặc định nếu có
        if (profile.diaChiMacDinh) {
          const address = profile.diaChiMacDinh
          loadAddressToForm(address)
        }

        // Load saved addresses
        await loadSavedAddresses()
      }
    } catch (error) {
      console.warn('⚠️ [CheckoutPage] Không thể lấy thông tin profile, sử dụng thông tin từ authStore:', error)
      // Fallback: sử dụng thông tin từ authStore
      if (user) {
        formData.value.tenKhachHang = user.hoTen || ''
        formData.value.soDienThoai = user.soDienThoai || ''
        formData.value.email = user.email || ''
      }
    }
  } else if (user) {
    // Fallback nếu không có customerId
    formData.value.tenKhachHang = user.hoTen || ''
    formData.value.soDienThoai = user.soDienThoai || ''
    formData.value.email = user.email || ''
  }

  // Ưu tiên lấy từ cartStore (có voucher) nếu có selectedItems
  if (cartStore.selectedItems && cartStore.selectedItems.length > 0) {
    // Load từ cartStore - đã có voucher được áp dụng
    orderItems.value = cartStore.selectedItems.map((item) => ({
      idCtsp: item.ctspId || item.idCtsp || item.id,
      tenSp: item.tenSp || item.tenSanPham || 'Sản phẩm',
      soLuong: item.quantity || item.soLuong || 1,
      donGia: item.donGia || item.giaBan || 0,
      thanhTien: (item.thanhTien || item.donGia * (item.quantity || 1)),
      imageUrl: item.imageUrl || item.anhSanPham,
    }))
  } else {
    // Fallback: Load product from sessionStorage
    const checkoutDataStr = sessionStorage.getItem('checkout_data')
    if (checkoutDataStr) {
      try {
        const checkoutData = JSON.parse(checkoutDataStr)
        if (checkoutData.product) {
          const product = checkoutData.product
          const giaBan = product.giaSauGiam || product.giaBan || 0
          orderItems.value = [
            {
              idCtsp: product.idCtsp,
              tenSp: product.tenSp,
              soLuong: product.soLuong || 1,
              donGia: giaBan,
              thanhTien: giaBan * (product.soLuong || 1),
              imageUrl: product.imageUrl,
            },
          ]
        }
      } catch (e) {
        console.error('Error parsing checkout data:', e)
      }
    }
  }

  // Fetch cart nếu chưa có để đảm bảo có voucher info
  if (!cartStore.cart) {
    await cartStore.fetchCart()
  }

  // Generate order code
  orderCode.value = 'DH' + Date.now()
})

// Address methods
const loadSavedAddresses = async () => {
  const customerId = authStore.getCustomerId()
  if (!customerId) return

  try {
    isLoadingAddresses.value = true
    // Get customer info to get maKhachHang
    const customerInfo = await customerService.getCustomerProfile(customerId)
    const maKhachHang = customerInfo?.data?.maKhachHang || customerInfo?.maKhachHang

    if (maKhachHang) {
      const response = await addressService.getAddressesByMaKhachHang(maKhachHang)
      savedAddresses.value = response?.data || response || []
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách địa chỉ:', error)
    savedAddresses.value = []
  } finally {
    isLoadingAddresses.value = false
  }
}

const loadSavedAddress = () => {
  if (!selectedSavedAddressId.value) {
    return
  }

  const address = savedAddresses.value.find(addr => addr.id === selectedSavedAddressId.value)
  if (!address) {
    return
  }

  // Load address to form
  loadAddressToForm(address)

  // Load to AddressForm component
  if (addressFormRef.value) {
    addressFormRef.value.form.diaChi = address.diaChi || ''
    addressFormRef.value.form.tinh = address.tinh || ''
    addressFormRef.value.form.xa = address.xa || ''
    addressFormRef.value.form.xaCode = address.xa || ''

    // Load province if needed
    if (address.tinh && addressFormRef.value.provinces) {
      const province = addressFormRef.value.provinces.find(p => p.name === address.tinh)
      if (province) {
        addressFormRef.value.form.tinhCode = province.id
        addressFormRef.value.selectProvince(province)
      }
    }
  }

  // Update customer info from address
  if (address.hoTen && !formData.value.tenKhachHang) {
    formData.value.tenKhachHang = address.hoTen
  }
  if (address.sdt && !formData.value.soDienThoai) {
    formData.value.soDienThoai = address.sdt
  }
}

const loadAddressToForm = (address) => {
  // Update address form data
  addressFormData.value.diaChi = address.diaChi || ''
  addressFormData.value.tinh = address.tinh || ''
  addressFormData.value.xa = address.xa || ''

  // Build full address string
  let fullAddress = address.diaChi || ''
  if (address.xa) {
    fullAddress += (fullAddress ? ', ' : '') + address.xa
  }
  if (address.tinh) {
    fullAddress += (fullAddress ? ', ' : '') + address.tinh
  }
  formData.value.diaChi = fullAddress

  // Update customer info from address
  if (address.hoTen && !formData.value.tenKhachHang) {
    formData.value.tenKhachHang = address.hoTen
  }
  if (address.sdt && !formData.value.soDienThoai) {
    formData.value.soDienThoai = address.sdt
  }
}

const formatAddressDisplay = (address) => {
  const parts = []
  if (address.diaChi) parts.push(address.diaChi)
  if (address.xa) parts.push(address.xa)
  if (address.tinh) parts.push(address.tinh)
  return parts.join(', ')
}

const checkDuplicateAddress = async (formData) => {
  if (!formData || !savedAddresses.value.length) return false

  const normalize = (str) => (str || '').toLowerCase().trim().replace(/\s+/g, ' ')

  const currentAddress = {
    diaChi: normalize(formData.diaChi || ''),
    tinh: normalize(formData.tinh || ''),
    xa: normalize(formData.xa || ''),
  }

  const duplicate = savedAddresses.value.find(addr => {
    const savedAddr = {
      diaChi: normalize(addr.diaChi || ''),
      tinh: normalize(addr.tinh || ''),
      xa: normalize(addr.xa || ''),
    }
    return (
      savedAddr.diaChi === currentAddress.diaChi &&
      savedAddr.tinh === currentAddress.tinh &&
      savedAddr.xa === currentAddress.xa
    )
  })

  if (duplicate) {
    selectedSavedAddressId.value = duplicate.id
    return true
  }
  return false
}

const handleAddressSaved = () => {
  loadSavedAddresses()
}

// Computed
const subtotal = computed(() => {
  // Ưu tiên lấy từ cartStore nếu có (đã tính đúng với voucher)
  if (cartStore.selectedItems && cartStore.selectedItems.length > 0 && cartStore.subtotal) {
    return cartStore.subtotal
  }
  // Fallback: tính từ orderItems local
  return orderItems.value.reduce((sum, item) => sum + item.thanhTien, 0)
})

const shippingFee = computed(() => {
  // Ưu tiên lấy từ cartStore
  if (cartStore.selectedItems && cartStore.selectedItems.length > 0 && cartStore.shippingFee !== undefined) {
    return cartStore.shippingFee
  }
  return 0 // Free shipping
})

const discount = computed(() => {
  // Lấy discount từ cartStore nếu có voucher được áp dụng
  return cartStore.discount || 0
})

const total = computed(() => {
  // Ưu tiên lấy từ cartStore nếu có (đã tính đúng với voucher)
  if (cartStore.selectedItems && cartStore.selectedItems.length > 0 && cartStore.total) {
    return cartStore.total
  }
  // Fallback: tính từ các giá trị local
  return subtotal.value + shippingFee.value - discount.value
})

// Validation methods
const validateTenKhachHang = () => {
  if (!formData.value.tenKhachHang || !formData.value.tenKhachHang.trim()) {
    formErrors.value.tenKhachHang = 'Vui lòng nhập họ và tên'
    return false
  }
  if (formData.value.tenKhachHang.trim().length < 2) {
    formErrors.value.tenKhachHang = 'Họ và tên phải có ít nhất 2 ký tự'
    return false
  }
  if (formData.value.tenKhachHang.trim().length > 100) {
    formErrors.value.tenKhachHang = 'Họ và tên không được vượt quá 100 ký tự'
    return false
  }
  formErrors.value.tenKhachHang = ''
  return true
}

const validateSoDienThoai = () => {
  if (!formData.value.soDienThoai || !formData.value.soDienThoai.trim()) {
    formErrors.value.soDienThoai = 'Vui lòng nhập số điện thoại'
    return false
  }
  // Validate phone number: 10-11 digits, can start with 0
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/
  const phoneNumber = formData.value.soDienThoai.trim().replace(/\s+/g, '')
  if (!phoneRegex.test(phoneNumber)) {
    formErrors.value.soDienThoai = 'Số điện thoại không hợp lệ (ví dụ: 0912345678 hoặc +84912345678)'
    return false
  }
  formErrors.value.soDienThoai = ''
  return true
}

const validateEmail = () => {
  if (!formData.value.email || !formData.value.email.trim()) {
    // Email is optional, so clear error if empty
    formErrors.value.email = ''
    return true
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email.trim())) {
    formErrors.value.email = 'Email không hợp lệ (ví dụ: example@email.com)'
    return false
  }
  formErrors.value.email = ''
  return true
}

const validateAddress = () => {
  if (!addressFormData.value.diaChi || !addressFormData.value.diaChi.trim()) {
    formErrors.value.diaChi = 'Vui lòng nhập địa chỉ chi tiết'
    return false
  }
  if (!addressFormData.value.tinh || !addressFormData.value.tinh.trim()) {
    formErrors.value.diaChi = 'Vui lòng chọn tỉnh/thành phố'
    return false
  }
  // Validate address form through component
  if (addressFormRef.value && !addressFormRef.value.validateForm()) {
    formErrors.value.diaChi = 'Vui lòng điền đầy đủ thông tin địa chỉ'
    return false
  }
  formErrors.value.diaChi = ''
  return true
}

const clearError = (field) => {
  if (formErrors.value[field]) {
    formErrors.value[field] = ''
  }
}

const validateAll = () => {
  const isValidTenKhachHang = validateTenKhachHang()
  const isValidSoDienThoai = validateSoDienThoai()
  const isValidEmail = validateEmail()
  const isValidAddress = validateAddress()

  return isValidTenKhachHang && isValidSoDienThoai && isValidEmail && isValidAddress
}

const canSubmit = computed(() => {
  // Basic check - full validation will be done on submit
  const hasAddress = addressFormData.value.diaChi && addressFormData.value.tinh

  return (
    formData.value.tenKhachHang &&
    formData.value.soDienThoai &&
    hasAddress &&
    orderItems.value.length > 0 &&
    !formErrors.value.tenKhachHang &&
    !formErrors.value.soDienThoai &&
    !formErrors.value.email &&
    !formErrors.value.diaChi
  )
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price || 0)
}

const handleSubmit = async () => {
  // Validate all fields
  if (!validateAll()) {
    alert('Vui lòng kiểm tra và điền đầy đủ thông tin hợp lệ')
    // Scroll to first error
    const firstErrorField = document.querySelector('.is-invalid')
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      firstErrorField.focus()
    }
    return
  }

  if (!canSubmit.value) {
    alert('Vui lòng điền đầy đủ thông tin')
    return
  }

  const customerId = authStore.getCustomerId()
  if (!customerId) {
    alert('Vui lòng đăng nhập để đặt hàng')
    router.push({ name: 'login' })
    return
  }

  loading.value = true

  try {
    // Lấy voucher code từ cartStore nếu có voucher được áp dụng
    const voucherCode = cartStore.appliedVoucher?.ma || null

    // Build full address from address form
    const addressParts = []
    if (addressFormData.value.diaChi) addressParts.push(addressFormData.value.diaChi)
    if (addressFormData.value.xa) addressParts.push(addressFormData.value.xa)
    if (addressFormData.value.tinh) addressParts.push(addressFormData.value.tinh)
    const fullAddress = addressParts.join(', ')

    const orderData = {
      khachHangId: customerId,
      tenKhachHang: formData.value.tenKhachHang,
      soDienThoai: formData.value.soDienThoai,
      email: formData.value.email,
      diaChi: fullAddress || formData.value.diaChi,
      ghiChu: formData.value.ghiChu,
      phuongThucThanhToan: formData.value.phuongThucThanhToan,
      maPhieuGiamGia: voucherCode, // Truyền voucher code vào order
      sanPhams: orderItems.value.map((item) => ({
        idCtsp: item.idCtsp,
        soLuong: item.soLuong,
      })),
    }

    console.log('🔍 [CheckoutPage] Order data:', orderData)

    const response = await orderService.createOrder(orderData)

    if (response.success || response.data) {
      // Clear checkout data
      sessionStorage.removeItem('checkout_data')

      // Xóa các sản phẩm đã mua khỏi giỏ hàng
      try {
        // Lấy danh sách item IDs đã được mua
        const purchasedItemIds = orderItems.value.map(item => {
          // Tìm item trong cart tương ứng với sản phẩm đã mua
          const cartItem = cartStore.cartItems.find(ci =>
            ci.ctspId === item.idCtsp ||
            ci.idCtsp === item.idCtsp ||
            ci.id === item.idCtsp
          )
          return cartItem?.id
        }).filter(Boolean)

        // Xóa từng item đã mua khỏi giỏ hàng
        for (const itemId of purchasedItemIds) {
          try {
            await cartStore.removeCartItem(itemId)
          } catch (err) {
            console.warn('⚠️ Không thể xóa item khỏi giỏ hàng:', err)
            // Tiếp tục xóa các item khác dù có lỗi
          }
        }

        // Refresh cart để cập nhật
        await cartStore.fetchCart()
      } catch (err) {
        console.warn('⚠️ Lỗi khi xóa sản phẩm khỏi giỏ hàng:', err)
        // Không block việc redirect nếu xóa cart thất bại
      }

      // Get order ID from response
      const orderId = response.data?.data?.id || response.data?.id
      const orderCode = response.data?.data?.ma || response.data?.ma || 'N/A'

      // Redirect to order success page with query params
      router.push({
        name: 'order-success',
        query: {
          orderId: orderId || null,
          orderCode: orderCode
        }
      })
    } else {
      throw new Error(response.message || 'Không thể tạo đơn hàng')
    }
  } catch (error) {
    console.error('Error creating order:', error)
    const errorMessage =
      error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đặt hàng'
    alert(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 60px);
  width: 100%;
  box-sizing: border-box;
}

.checkout-page h2 {
  color: #1e293b;
  font-weight: 700;
  font-size: clamp(24px, 2.5vw, 32px);
}

.card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
}

.checkout-header {
  background-color: #047857;
  color: #ffffff;
  border-bottom: none;
  padding: 16px 20px;
  font-weight: 600;
}

.checkout-header h5 {
  color: #ffffff;
  margin: 0;
}

.qr-code-placeholder {
  min-width: 200px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.qr-code {
  width: 200px;
  height: 200px;
  background: #ffffff;
  border: 2px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #999;
  border-radius: 8px;
}

.qr-placeholder-text {
  text-align: center;
  color: #999;
}

.bank-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
}

.order-items {
  max-height: 300px;
  overflow-y: auto;
}

.product-image {
  border: 1px solid #dee2e6;
}

.checkout-btn {
  background-color: #047857;
  border-color: #047857;
  color: #ffffff;
  font-weight: 600;
  transition: all 0.3s ease;
}

.checkout-btn:hover:not(:disabled) {
  background-color: #059669;
  border-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(4, 120, 87, 0.3);
}

.checkout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-label {
  color: #1e293b;
  font-weight: 500;
  margin-bottom: 8px;
}

.form-control,
.form-select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #047857;
  box-shadow: 0 0 0 3px rgba(4, 120, 87, 0.1);
}

.alert-warning {
  background-color: #fef3c7;
  border-color: #fbbf24;
  color: #92400e;
  border-radius: 12px;
}

.payment-info-card {
  border: 2px solid #dcfce7;
}

.payment-info-header {
  background-color: #10b981;
  color: #ffffff;
}

.payment-info-header h5 {
  color: #ffffff;
}

@media (max-width: 768px) {
  .checkout-page {
    padding: 20px 0;
  }
}
</style>
