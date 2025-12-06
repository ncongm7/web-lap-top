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
                    <input v-model="formData.tenKhachHang" type="text" class="form-control" required
                      placeholder="Nhập họ và tên" />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
                    <input v-model="formData.soDienThoai" type="tel" class="form-control" required
                      placeholder="Nhập số điện thoại" />
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input v-model="formData.email" type="email" class="form-control"
                    placeholder="Nhập email (để nhận xác nhận đơn hàng)" />
                </div>

                <!-- Địa chỉ giao hàng -->
                <div class="mb-3">
                  <label class="form-label">Địa chỉ giao hàng <span class="text-danger">*</span></label>
                  <textarea v-model="formData.diaChi" class="form-control" rows="3" required
                    placeholder="Nhập địa chỉ giao hàng"></textarea>
                </div>

                <div class="mb-3">
                  <label class="form-label">Ghi chú</label>
                  <textarea v-model="formData.ghiChu" class="form-control" rows="2"
                    placeholder="Ghi chú cho đơn hàng (nếu có)"></textarea>
                </div>
              </form>
            </div>
          </div>

          <!-- Points Usage -->
          <PointsRedemption v-if="customerId && availablePoints > 0" v-model="pointsToUse"
            :available-points="availablePoints" :conversion-rate="quyDoiDiem?.tienTieuDiem || 0"
            :max-allowed-points="maxPointsAllowed" @update:model-value="calculatePointsDiscount" />

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
              <h5 class="mb-0">Thanh toán QR</h5>
            </div>
            <div class="card-body">
              <div class="alert alert-info mb-0">
                <i class="bi bi-info-circle me-2"></i>
                Sau khi đặt hàng, bạn sẽ được chuyển đến trang thanh toán QR
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
                <div v-if="pointsDiscount > 0" class="d-flex justify-content-between mb-2 text-success">
                  <span>Giảm từ điểm:</span>
                  <span>-{{ formatPrice(pointsDiscount) }}</span>
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

    <!-- QR Payment Modal -->
    <QRPaymentModal :show="showQRPaymentModal" :qr-data="qrData" :loading="qrLoading" :error="qrError"
      :status="qrStatus" :order-id="createdOrderId" @close="handleCloseQRModal"
      @payment-confirmed="handlePaymentConfirmed" @retry="handleRetryQR" @expired="handleQRExpired" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/customer/authStore'
import { useCartStore } from '@/stores/customer/cartStore'
import orderService from '@/service/customer/orderService'
import addressService from '@/service/customer/addressService'
import { generateQRPayment, checkPaymentStatus } from '@/service/customer/paymentService'
import { useQRPayment } from '@/composables/customer/useQRPayment'
import QRPaymentModal from '@/components/customer/payment/QRPaymentModal.vue'
import { tichDiemService } from '@/service/diem/tichDiemService'
import { quyDoiDiemService } from '@/service/diem/quyDoiDiemService'
import PointsRedemption from '@/components/customer/checkout/PointsRedemption.vue'
import dayjs from 'dayjs'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

// QR Payment composable
const {
  qrCodeData: qrData,
  loading: qrLoading,
  error: qrError,
  status: qrStatus,
  generateQR: generateQRCode,
  checkStatus: checkQRStatus,
  handleExpired: handleQRExpired,
  pausePolling,
  resumePolling
} = useQRPayment({
  amount: computed(() => total.value),
  orderCode: computed(() => orderCode.value),
  onPaymentConfirmed: (data) => {
    console.log('✅ Thanh toán QR đã được xác nhận!', data)
    // Payment confirmed - modal will handle the UI
  }
})

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

  // Tự động fill thông tin từ profile và địa chỉ mặc định nếu đã đăng nhập
  if (customerId) {
    try {
      // Bước 1: Lấy thông tin khách hàng để có maKhachHang
      let customerInfo = null
      let maKhachHang = null

      try {
        // Sử dụng addressService.getCustomerById để lấy thông tin khách hàng
        const customerResponse = await addressService.getCustomerById(customerId)
        customerInfo = customerResponse.data || customerResponse
        console.log('🔍 [CheckoutPage] Customer info:', customerInfo)

        // Lấy maKhachHang từ customerInfo (có thể là maKhachHang hoặc ma)
        maKhachHang = customerInfo?.maKhachHang || customerInfo?.ma || user?.maKhachHang
        console.log('🔍 [CheckoutPage] maKhachHang:', maKhachHang)

        // Điền thông tin cơ bản từ customerInfo trước (fallback)
        if (customerInfo?.hoTen) {
          formData.value.tenKhachHang = customerInfo.hoTen
        }
        if (customerInfo?.soDienThoai) {
          formData.value.soDienThoai = customerInfo.soDienThoai
        }
        if (customerInfo?.email) {
          formData.value.email = customerInfo.email
        }
      } catch (customerError) {
        console.warn('⚠️ [CheckoutPage] Không thể lấy thông tin khách hàng:', customerError)
        // Thử lấy maKhachHang từ user nếu không lấy được từ API
        maKhachHang = user?.maKhachHang
      }

      // Nếu không có maKhachHang từ customerInfo, thử lấy từ user
      if (!maKhachHang && user?.maKhachHang) {
        maKhachHang = user.maKhachHang
        console.log('🔍 [CheckoutPage] Lấy maKhachHang từ user:', maKhachHang)
      }

      // Bước 2: Lấy địa chỉ mặc định nếu có maKhachHang
      if (maKhachHang) {
        try {
          console.log('🔍 [CheckoutPage] Đang lấy địa chỉ cho maKhachHang:', maKhachHang)
          const addressResponse = await addressService.getAddressesByMaKhachHang(maKhachHang)
          console.log('🔍 [CheckoutPage] Address response:', addressResponse)

          const addresses = addressResponse.data || addressResponse || []
          console.log('🔍 [CheckoutPage] Addresses list:', addresses)

          // Tìm địa chỉ mặc định (macDinh = true)
          const defaultAddress = addresses.find((addr) => addr.macDinh === true)
          console.log('🔍 [CheckoutPage] Default address:', defaultAddress)

          if (defaultAddress) {
            // Ưu tiên: Lấy thông tin từ địa chỉ mặc định
            if (defaultAddress.hoTen) {
              formData.value.tenKhachHang = defaultAddress.hoTen
            }

            // Lấy số điện thoại (có thể là sdt hoặc soDienThoai)
            if (defaultAddress.sdt || defaultAddress.soDienThoai) {
              formData.value.soDienThoai = defaultAddress.sdt || defaultAddress.soDienThoai
            }

            // Tạo chuỗi địa chỉ đầy đủ từ các thành phần
            const addressParts = []
            if (defaultAddress.diaChi) {
              addressParts.push(defaultAddress.diaChi)
            }
            if (defaultAddress.xa) {
              addressParts.push(defaultAddress.xa)
            }
            if (defaultAddress.tinh) {
              addressParts.push(defaultAddress.tinh)
            }

            // Ghép địa chỉ với dấu phẩy và khoảng trắng
            if (addressParts.length > 0) {
              formData.value.diaChi = addressParts.join(', ')
            }

            console.log('✅ [CheckoutPage] Đã điền thông tin từ địa chỉ mặc định:', {
              tenKhachHang: formData.value.tenKhachHang,
              soDienThoai: formData.value.soDienThoai,
              diaChi: formData.value.diaChi,
            })
          } else {
            console.warn('⚠️ [CheckoutPage] Không tìm thấy địa chỉ mặc định trong danh sách')
          }
        } catch (addressError) {
          console.error('❌ [CheckoutPage] Lỗi khi lấy địa chỉ mặc định:', addressError)
          // Tiếp tục với thông tin từ profile nếu không lấy được địa chỉ
        }
      } else {
        console.warn('⚠️ [CheckoutPage] Không có maKhachHang để lấy địa chỉ')
      }

      // Nếu vẫn chưa có thông tin, thử từ customerInfo (nếu có trong response)
      if (customerInfo && !formData.value.diaChi) {
        // Nếu có diaChiMacDinh trong customerInfo
        if (customerInfo.diaChiMacDinh) {
          const address = customerInfo.diaChiMacDinh
          const addressParts = []
          if (address.diaChi) addressParts.push(address.diaChi)
          if (address.xa) addressParts.push(address.xa)
          if (address.tinh) addressParts.push(address.tinh)
          if (addressParts.length > 0) {
            formData.value.diaChi = addressParts.join(', ')
          }
          if (address.hoTen && !formData.value.tenKhachHang) {
            formData.value.tenKhachHang = address.hoTen
          }
          if ((address.sdt || address.soDienThoai) && !formData.value.soDienThoai) {
            formData.value.soDienThoai = address.sdt || address.soDienThoai
          }
        }

        // Load saved addresses
        await loadSavedAddresses()
      }
    } catch (error) {
      console.warn(
        '⚠️ [CheckoutPage] Không thể lấy thông tin profile, sử dụng thông tin từ authStore:',
        error,
      )
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

  // Fetch cart trước để đảm bảo có dữ liệu mới nhất
  if (!cartStore.cart) {
    await cartStore.fetchCart()
  }

  // Ưu tiên lấy từ cartStore (có voucher) nếu có selectedItems
  if (cartStore.selectedItems && cartStore.selectedItems.length > 0) {
    // Load từ cartStore - đã có voucher được áp dụng
    orderItems.value = cartStore.selectedItems.map((item) => {
      // Tính thanhTien: ưu tiên subtotal của item, nếu không có thì tính price * quantity
      const itemPrice = Number(item.price) || 0
      const itemQuantity = Number(item.quantity) || 1
      const itemSubtotal = Number(item.subtotal) || itemPrice * itemQuantity

      return {
        idCtsp: item.ctspId || item.idCtsp || item.id,
        tenSp: item.tenSp || item.tenSanPham || 'Sản phẩm',
        soLuong: itemQuantity,
        donGia: itemPrice,
        thanhTien: itemSubtotal,
        imageUrl: item.imageUrl || item.anhSanPham,
      }
    })
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

  // Generate order code
  orderCode.value = 'DH' + Date.now()

  // Load points if customer is logged in
  if (customerId.value) {
    loadPoints()
  }
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
  // Tính từ orderItems local trước (dữ liệu chính xác nhất)
  const calculatedSubtotal = orderItems.value.reduce((sum, item) => {
    return sum + (Number(item.thanhTien) || 0)
  }, 0)

  // Nếu có orderItems và đã tính được subtotal, ưu tiên dùng giá trị này
  if (calculatedSubtotal > 0) {
    // Nếu có cartStore với voucher, ưu tiên dùng cartStore.subtotal (có voucher tính)
    if (cartStore.selectedItems && cartStore.selectedItems.length > 0 && cartStore.subtotal > 0) {
      return cartStore.subtotal
    }
    return calculatedSubtotal
  }

  // Nếu không có orderItems, thử lấy từ cartStore
  if (cartStore.selectedItems && cartStore.selectedItems.length > 0 && cartStore.subtotal > 0) {
    return cartStore.subtotal
  }

  return 0
})

const shippingFee = computed(() => {
  // Tính subtotal sau discount để kiểm tra miễn phí vận chuyển
  const subtotalAfterDiscount = subtotal.value - discount.value

  // Miễn phí vận chuyển nếu >= 1.000.000
  if (subtotalAfterDiscount >= 1000000) {
    return 0
  }

  // Ưu tiên lấy từ cartStore nếu có
  if (
    cartStore.selectedItems &&
    cartStore.selectedItems.length > 0 &&
    cartStore.shippingFee !== undefined
  ) {
    return cartStore.shippingFee
  }

  return 0 // Free shipping mặc định
})

const discount = computed(() => {
  // Lấy discount từ cartStore nếu có voucher được áp dụng
  return cartStore.discount || 0
})

const total = computed(() => {
  // Nếu dùng cartStore, total đã bao gồm giảm giá điểm
  if (cartStore.selectedItems && cartStore.selectedItems.length > 0 && cartStore.total > 0) {
    return cartStore.total
  }

  // Nếu không (ví dụ mua ngay), tính thủ công
  const calculatedTotal = subtotal.value + shippingFee.value - discount.value - pointsDiscount.value
  return Math.max(0, calculatedTotal)
})

// State for QR Payment Modal
const showQRPaymentModal = ref(false)
const createdOrderId = ref(null)

// Points
const availablePoints = ref(0)
const pointsToUse = computed({
  get: () => cartStore.pointsUsed,
  set: (val) => cartStore.pointsUsed = val
})
const pointsDiscount = computed(() => cartStore.pointsDiscount)
const pointsError = ref('')
const quyDoiDiem = ref(null)
const customerId = computed(() => authStore.getCustomerId())

// Computed: Số điểm tối đa được phép sử dụng
const maxPointsAllowed = computed(() => {
  if (!quyDoiDiem.value || !quyDoiDiem.value.tienTieuDiem) return 0

  // Tính tổng tiền cần thanh toán sau khi trừ voucher (nhưng chưa trừ điểm)
  const totalAfterVoucher = Math.max(0, subtotal.value - discount.value)

  // Tính số điểm tối đa có thể dùng dựa trên số tiền này
  const maxPointsByTotal = Math.floor(totalAfterVoucher / quyDoiDiem.value.tienTieuDiem)

  // Số điểm tối đa là min của (điểm đang có, điểm tối đa theo tiền)
  return Math.min(availablePoints.value, maxPointsByTotal)
})

// Load points and conversion rate
const loadPoints = async () => {
  if (!customerId.value) return

  try {
    // Lấy thông tin khách hàng để có UUID của khách hàng
    const customerInfo = await addressService.getCustomerById(customerId.value)
    const khachHangId = customerInfo?.data?.id || customerInfo?.id
    
    if (!khachHangId) {
      console.warn('⚠️ Không tìm thấy ID khách hàng cho userId:', customerId.value)
      availablePoints.value = 0
      return
    }

    // Load available points using khachHangId (UUID)
    const tichDiem = await tichDiemService.getTichDiemByUserId(khachHangId)
    availablePoints.value = tichDiem?.tongDiem || 0

    // Load conversion rate
    const quyDoi = await quyDoiDiemService.getQuyDoiDiemDangHoatDong()
    quyDoiDiem.value = quyDoi
  } catch (error) {
    console.error('Lỗi khi tải điểm:', error)
    availablePoints.value = 0
  }
}

// Calculate points discount
const calculatePointsDiscount = () => {
  pointsError.value = ''

  if (!pointsToUse.value || pointsToUse.value <= 0) {
    cartStore.setPointsDiscount(0, 0)
    return
  }

  // Validate against maxPointsAllowed
  if (pointsToUse.value > maxPointsAllowed.value) {
    pointsToUse.value = maxPointsAllowed.value
    pointsError.value = `Tối đa có thể dùng ${maxPointsAllowed.value} điểm`
  }

  if (!quyDoiDiem.value || !quyDoiDiem.value.tienTieuDiem) {
    cartStore.setPointsDiscount(pointsToUse.value, 0)
    return
  }

  // Calculate discount
  const discountAmount = pointsToUse.value * quyDoiDiem.value.tienTieuDiem
  cartStore.setPointsDiscount(pointsToUse.value, discountAmount)
}

// Watch for changes that affect max points and recalculate discount
watch([subtotal, discount, availablePoints, pointsToUse], () => {
  // Ensure points don't exceed max allowed
  if (pointsToUse.value > maxPointsAllowed.value) {
    pointsToUse.value = maxPointsAllowed.value
  }
  // Recalculate discount
  calculatePointsDiscount()
})

// Clear points
const clearPoints = () => {
  pointsToUse.value = 0
  cartStore.setPointsDiscount(0, 0)
  pointsError.value = ''
}

// Removed: Watch tự động tạo QR khi chọn phương thức thanh toán
// QR sẽ được tạo sau khi user click "Đặt hàng" và đơn hàng được tạo thành công

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
  // Kiểm tra địa chỉ từ formData (user nhập trực tiếp)
  if (!formData.value.diaChi || !formData.value.diaChi.trim()) {
    formErrors.value.diaChi = 'Vui lòng nhập địa chỉ giao hàng'
    return false
  }

  // Nếu có addressFormRef (component địa chỉ), validate qua component đó
  if (addressFormRef.value && typeof addressFormRef.value.validateForm === 'function') {
    if (!addressFormRef.value.validateForm()) {
      formErrors.value.diaChi = 'Vui lòng điền đầy đủ thông tin địa chỉ'
      return false
    }
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
  // Kiểm tra địa chỉ đã được nhập (từ formData.diaChi)
  const hasAddress = formData.value.diaChi && formData.value.diaChi.trim().length > 0

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
      soDiemSuDung: pointsToUse.value > 0 ? pointsToUse.value : null, // Truyền số điểm sử dụng
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

      // Xóa các sản phẩm đã đặt hàng khỏi giỏ hàng
      try {
        // Lấy danh sách các sản phẩm đã đặt hàng (từ selectedItems trong cartStore)
        const orderedItems = cartStore.selectedItems || []

        if (orderedItems.length > 0) {
          console.log('🗑️ [CheckoutPage] Xóa các sản phẩm đã đặt hàng khỏi giỏ hàng:', orderedItems)

          // Lưu danh sách item IDs cần xóa trước khi xóa
          const itemIdsToRemove = orderedItems
            .map((item) => item.id) // ID của cart item (GioHangChiTiet.id)
            .filter((id) => id != null) // Lọc bỏ các item không có ID

          console.log('🗑️ [CheckoutPage] Danh sách item IDs cần xóa:', itemIdsToRemove)

          if (itemIdsToRemove.length > 0) {
            // Xóa từng item đã đặt hàng khỏi giỏ hàng
            // Sử dụng Promise.allSettled để đảm bảo tất cả đều được xử lý, kể cả có lỗi
            const removePromises = itemIdsToRemove.map((itemId) => {
              return cartStore.removeCartItem(itemId).catch((err) => {
                console.error(`❌ [CheckoutPage] Lỗi khi xóa cart item ${itemId}:`, err)
                // Không throw error để không chặn việc redirect
                return { success: false, error: err }
              })
            })

            // Đợi tất cả các item được xóa (hoặc bỏ qua lỗi)
            await Promise.allSettled(removePromises)
            console.log('✅ [CheckoutPage] Đã xóa các sản phẩm đã đặt hàng khỏi giỏ hàng')

            // Refresh lại giỏ hàng để đảm bảo state được cập nhật
            await cartStore.fetchCart()
          } else {
            console.warn('⚠️ [CheckoutPage] Không có item ID hợp lệ để xóa khỏi giỏ hàng')
          }
        } else {
          console.log('ℹ️ [CheckoutPage] Không có sản phẩm nào trong selectedItems để xóa')
        }
      } catch (error) {
        // Không block việc redirect nếu có lỗi khi xóa giỏ hàng
        console.error(
          '⚠️ [CheckoutPage] Lỗi khi xóa sản phẩm khỏi giỏ hàng (không ảnh hưởng đến đơn hàng):',
          error,
        )
      }

      // Get order ID from response
      const orderId = response.data?.data?.id || response.data?.id
      const orderCodeFromResponse = response.data?.data?.ma || response.data?.ma || 'N/A'

      // Update orderCode ref
      orderCode.value = orderCodeFromResponse

      // Nếu là thanh toán online, tạo QR và mở modal
      if (formData.value.phuongThucThanhToan === 1) {
        console.log('🔄 [CheckoutPage] Tạo QR code cho đơn hàng:', { orderId, orderCode: orderCodeFromResponse, total: total.value })

        // Store order ID for modal
        createdOrderId.value = orderId

        // Generate QR với orderId thật
        await generateQRCode(orderCodeFromResponse, total.value, orderId)

        // Resume polling if was paused
        resumePolling()

        // Mở modal QR payment
        showQRPaymentModal.value = true
      } else {
        // COD: Redirect đến order success page
        router.push({
          name: 'order-success',
          query: {
            orderId: orderId || null,
            orderCode: orderCodeFromResponse,
          },
        })
      }
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

// QR Payment Modal handlers
const handleCloseQRModal = () => {
  showQRPaymentModal.value = false
  pausePolling()
}

const handlePaymentConfirmed = (data) => {
  console.log('✅ [CheckoutPage] Payment confirmed:', data)
  // Modal will auto-close after 3 seconds
  // User can click "Xem đơn hàng" button
}

const handleRetryQR = async () => {
  if (createdOrderId.value && orderCode.value) {
    await generateQRCode(orderCode.value, total.value, createdOrderId.value)
    resumePolling()
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

/* QR Payment Styles */
.qr-image {
  max-width: 100%;
  width: 280px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timer-badge {
  font-size: 1.05rem;
}

@media (max-width: 768px) {
  .checkout-page {
    padding: 20px 0;
  }

  .qr-image {
    width: 220px;
  }
}
</style>
