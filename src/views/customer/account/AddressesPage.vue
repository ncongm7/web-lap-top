<template>
  <div class="addresses-page">
    <div class="container py-4">
      <!-- Breadcrumb -->
      <div class="card mb-3">
        <div class="card-body py-2">
          <h5 class="fw-bold text-success mb-1">Quản Lý Địa Chỉ</h5>
          <nav style="--bs-breadcrumb-divider: '/'; font-size: 14px">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item">
                <router-link to="/">Trang chủ</router-link>
              </li>
              <li class="breadcrumb-item">Tài khoản</li>
              <li class="breadcrumb-item active">Địa chỉ</li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- Thông tin khách hàng -->
      <div class="card mb-4" v-if="customerInfo">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Mã khách hàng</label>
              <input type="text" class="form-control" v-model="customerInfo.maKhachHang" readonly />
            </div>
            <div class="col-md-6">
              <label class="form-label">Họ và tên</label>
              <input type="text" class="form-control" v-model="customerInfo.hoTen" readonly />
            </div>
            <div class="col-md-6">
              <label class="form-label">Số điện thoại</label>
              <input type="text" class="form-control" v-model="customerInfo.soDienThoai" readonly />
            </div>
            <div class="col-md-6">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" v-model="customerInfo.email" readonly />
            </div>
          </div>
        </div>
      </div>

      <!-- Quản lý địa chỉ -->
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold mb-0">
              <i class="fas fa-map-marker-alt me-1 text-success"></i> Danh sách địa chỉ
              <span class="badge bg-light text-dark ms-2">{{ addressList.length }} địa chỉ</span>
            </h6>
            <button
              class="btn btn-success btn-sm"
              @click="showAddAddressModal"
              :disabled="!customerInfo?.maKhachHang"
            >
              <i class="fas fa-plus me-1"></i> Thêm địa chỉ
            </button>
          </div>

          <!-- Danh sách địa chỉ -->
          <div
            v-if="addressList.length === 0"
            class="border rounded p-4 text-center text-muted"
            style="border-style: dashed"
          >
            <i class="fas fa-map-marker-alt fa-2x mb-2"></i>
            <p class="mb-2">Chưa có địa chỉ nào</p>
            <button
              class="btn btn-success btn-sm"
              @click="showAddAddressModal"
              :disabled="!customerInfo?.maKhachHang"
            >
              Thêm địa chỉ ngay
            </button>
          </div>

          <!-- Hiển thị danh sách địa chỉ -->
          <div v-else class="list-group">
            <div v-for="address in addressList" :key="address.id" class="list-group-item">
              <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                  <div class="fw-bold mb-1">
                    <i class="fas fa-user me-2"></i>{{ address.hoTen }}
                    <span v-if="address.macDinh" class="badge bg-success ms-2">Mặc định</span>
                  </div>
                  <div class="mb-1"><i class="fas fa-phone me-2"></i>{{ address.sdt }}</div>
                  <div class="mb-1">
                    <i class="fas fa-map-marker-alt me-2"></i>{{ address.diaChi }}
                  </div>
                  <div v-if="address.xa || address.tinh" class="text-muted small">
                    {{ [address.xa, address.tinh].filter(Boolean).join(', ') }}
                  </div>
                </div>
                <div class="btn-group btn-group-sm">
                  <button
                    v-if="!address.macDinh"
                    class="btn btn-outline-primary"
                    @click="setDefaultAddress(address.id)"
                    :disabled="loading"
                  >
                    <i class="fas fa-star me-1"></i> Đặt mặc định
                  </button>
                  <button
                    class="btn btn-outline-danger"
                    @click="deleteAddress(address.id)"
                    :disabled="loading"
                  >
                    <i class="fas fa-trash me-1"></i> Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal thêm địa chỉ -->
    <div
      class="modal fade"
      :class="{ 'show d-block': showAddressModal }"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5); z-index: 1050"
      @click.self="closeAddressModal"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thêm Địa Chỉ</h5>
            <button type="button" class="btn-close" @click="closeAddressModal"></button>
          </div>
          <div class="modal-body">
            <DiaChiForm
              :maKhachHang="customerInfo?.maKhachHang || ''"
              @close="closeAddressModal"
              @success="handleAddressSuccess"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import addressService from '@/service/customer/addressService'
import authService from '@/service/customer/authService'
import DiaChiForm from '@/components/customer/account/DiaChiForm.vue'

const toast = useToast()

const loading = ref(false)
const customerInfo = ref(null)
const addressList = ref([])
const showAddressModal = ref(false)

// Lấy thông tin khách hàng và địa chỉ
const fetchCustomerInfo = async () => {
  try {
    const userId = authService.getCustomerId()
    if (!userId) {
      toast.error('Vui lòng đăng nhập để xem địa chỉ')
      return
    }

    console.log('🔍 Fetching customer info với userId:', userId)

    loading.value = true
    const response = await addressService.getCustomerById(userId)
    console.log('🔍 Response từ API:', response)

    // Xử lý response - có thể là ResponseObject hoặc trực tiếp
    if (response?.data) {
      customerInfo.value = response.data
    } else if (response?.isSuccess !== false) {
      // Nếu không phải error response
      customerInfo.value = response
    } else {
      // Error response
      throw new Error(response.message || 'Khách hàng không tồn tại')
    }

    // Fetch địa chỉ nếu có maKhachHang
    if (customerInfo.value?.maKhachHang) {
      await fetchAddresses()
    } else {
      console.warn('⚠️ Không có maKhachHang trong customerInfo:', customerInfo.value)
      toast.warning('Không tìm thấy mã khách hàng. Vui lòng đăng nhập lại.')
    }
  } catch (error) {
    console.error('❌ Error fetching customer info:', error)
    const errorMessage =
      error.response?.data?.message || error.message || 'Không thể lấy thông tin khách hàng'
    toast.error(errorMessage)

    // Nếu lỗi 404, có thể user chưa có khách hàng - cần đăng ký lại
    if (error.response?.status === 404) {
      console.error('⚠️ Khách hàng không tồn tại. Có thể cần đăng ký lại.')
    }
  } finally {
    loading.value = false
  }
}

const fetchAddresses = async () => {
  if (!customerInfo.value?.maKhachHang) {
    addressList.value = []
    return
  }

  try {
    const response = await addressService.getAddressesByMaKhachHang(customerInfo.value.maKhachHang)
    addressList.value = response.data || response || []
  } catch (error) {
    console.error('Error fetching addresses:', error)
    addressList.value = []
  }
}

const showAddAddressModal = () => {
  if (!customerInfo.value?.maKhachHang) {
    toast.error('Vui lòng đợi thông tin khách hàng được tải')
    return
  }
  showAddressModal.value = true
}

const closeAddressModal = () => {
  showAddressModal.value = false
}

const handleAddressSuccess = () => {
  fetchAddresses()
  closeAddressModal()
}

const setDefaultAddress = async (addressId) => {
  if (!confirm('Bạn có chắc chắn muốn đặt địa chỉ này làm mặc định?')) {
    return
  }

  try {
    loading.value = true
    const address = addressList.value.find((addr) => addr.id === addressId)
    if (!address) return

    // Hủy tất cả địa chỉ mặc định khác
    const defaultAddresses = addressList.value.filter((addr) => addr.macDinh)
    for (const addr of defaultAddresses) {
      await addressService.updateAddress(addr.id, {
        maKhachHang: customerInfo.value.maKhachHang,
        hoTen: addr.hoTen,
        sdt: addr.sdt,
        diaChi: addr.diaChi,
        xa: addr.xa,
        tinh: addr.tinh,
        macDinh: false,
      })
    }

    // Đặt địa chỉ này làm mặc định
    await addressService.updateAddress(addressId, {
      maKhachHang: customerInfo.value.maKhachHang,
      hoTen: address.hoTen,
      sdt: address.sdt,
      diaChi: address.diaChi,
      xa: address.xa,
      tinh: address.tinh,
      macDinh: true,
    })

    toast.success('Đã đặt làm địa chỉ mặc định')
    await fetchAddresses()
  } catch (error) {
    console.error('Error setting default address:', error)
    toast.error('Có lỗi xảy ra')
  } finally {
    loading.value = false
  }
}

const deleteAddress = async (addressId) => {
  if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
    return
  }

  try {
    loading.value = true
    await addressService.deleteAddress(addressId)
    toast.success('Đã xóa địa chỉ thành công')
    await fetchAddresses()
  } catch (error) {
    console.error('Error deleting address:', error)
    toast.error('Có lỗi xảy ra khi xóa địa chỉ')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCustomerInfo()
})
</script>

<style scoped>
.addresses-page {
  min-height: 60vh;
}

.card {
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(60, 72, 88, 0.08);
}

.list-group-item {
  transition: all 0.3s;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.modal {
  z-index: 1050;
}

.form-label {
  font-weight: 500;
  font-size: 0.9rem;
}
</style>
