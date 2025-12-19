<template>
  <div class="warranty-page container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <!-- <h2 class="fw-bold mb-0 text-primary">
        <i class="bi bi-shield-check me-2"></i>Bảo hành của tôi
      </h2> -->
      <button class="btn btn-outline-primary" @click="showRequestHistory">
        <i class="bi bi-clock-history me-1"></i> Lịch sử yêu cầu
      </button>
    </div>

    <!-- Switch View: List vs Request Form -->
    <div v-if="!isCreatingRequest">
      <div class="card shadow-sm border-0 mb-4">
        <div class="card-header bg-white py-3">
          <h5 class="mb-0 fw-bold">Sản phẩm của bạn</h5>
        </div>
        <div class="card-body p-0">
          <div v-if="isLoading" class="p-4 text-center">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
          <div v-else-if="warranties.length === 0" class="p-5 text-center text-muted">
            <i class="bi bi-box-seam display-1 d-block mb-3"></i>
            <p>Bạn chưa có sản phẩm nào đang trong thời gian bảo hành hoặc chưa mua hàng.</p>
            <router-link to="/products" class="btn btn-primary mt-2">Mua sắm ngay</router-link>
          </div>
          <div v-else class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
              <thead class="bg-light">
                <tr>
                  <th class="ps-4">Mã hóa đơn</th>
                  <th>Sản phẩm</th>
                  <th>Serial Number</th>
                  <th>Ngày hết hạn</th>

                  <th class="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in warranties" :key="item.id">
                  <td class="ps-4">
                    <span class="fw-semibold text-primary">{{ item.maHoaDon || 'N/A' }}</span>
                  </td>
                  <td>
                    <span class="fw-medium">{{ item.tenSanPham || 'Sản phẩm' }}</span>
                    <br>
                    <small class="text-muted">Mã: {{ item.maCtsp }}</small>
                  </td>
                  <td>
                    <span class="font-monospace bg-light px-2 py-1 rounded">{{ item.serialNo }}</span>
                  </td>
                  <td>
                    <span>{{ calculateExpirationDate(item) }}</span>
                  </td>

                  <td class="text-end pe-4">
                    <button class="btn btn-sm"
                            :class="isWarrantyActive(item.warrantyRequestStatus) ? 'btn-outline-secondary' : 'btn-primary'"
                            @click="createRequest(item)"
                            :title="isWarrantyActive(item.warrantyRequestStatus) ? 'Sản phẩm đang được bảo hành' : 'Yêu cầu bảo hành'">
                      <i class="bi bi-wrench-adjustable me-1"></i> Báo lỗi
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="alert alert-info border-0 shadow-sm">
        <i class="bi bi-info-circle-fill me-2"></i>
        Để yêu cầu bảo hành cho sản phẩm không có trong danh sách, vui lòng liên hệ hotline: <strong>1900 1234</strong>
      </div>
    </div>

    <!-- Create Request Component -->
    <div v-else>
      <div class="mb-3">
        <button class="btn btn-link text-decoration-none ps-0" @click="isCreatingRequest = false">
          <i class="bi bi-arrow-left me-1"></i> Quay lại danh sách
        </button>
      </div>
      <CreateWarrantyRequest :selectedSerial="selectedSerialForRequest" @request-created="handleRequestCreated" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import warrantyService from '@/service/customer/warrantyService' // Không dùng service này nữa
import orderService from '@/service/customer/orderService'
import baohanhService from '@/service/baohanh/baohanhService'
import { useAuthStore } from '@/stores/customer/authStore'
import CreateWarrantyRequest from '@/components/baohanh/CreateWarrantyRequest.vue'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const warranties = ref([]) // Danh sách sản phẩm từ các đơn hàng
const isLoading = ref(false)
const isCreatingRequest = ref(false)
const selectedSerialForRequest = ref(null)

onMounted(async () => {
  await fetchWarranties()
})

const fetchWarranties = async () => {
  try {
    isLoading.value = true
    const customerId = authStore.getCustomerId()
    if (!customerId) {
        // toast.error('Vui lòng đăng nhập')
        return
    }

    // 1. Lấy danh sách đơn hàng
    const response = await orderService.getOrders(0, 50, null, customerId)

    let orders = []
    if (response && response.data) {
      if (response.data.data && response.data.data.content !== undefined) {
        orders = response.data.data.content
      } else if (response.data.content !== undefined) {
        orders = response.data.content
      }
    }

    const validOrders = orders.filter(o =>
        ['DA_THANH_TOAN', 'DANG_GIAO', 'HOAN_THANH'].includes(o.trangThai)
    )

    // 2. Lấy chi tiết bảo hành (serial) cho từng đơn hàng
    const items = []
    const promises = validOrders.map(async (order) => {
        try {
            // Run both requests in parallel
            const [conditionRes, warrantyRes] = await Promise.all([
                baohanhService.kiemTraDieuKien(order.id),
                baohanhService.getWarrantyRequestsByInvoice(order.id).catch(() => ({ data: [] }))
            ])

            const data = conditionRes?.data?.data || conditionRes?.data
            const warranties = warrantyRes?.data?.data || warrantyRes?.data || []

            // Map warranties by serial ID for quick lookup
            // Key: idSerialDaBan, Value: Latest warranty request
            const warrantyMap = {}
            if (Array.isArray(warranties)) {
                warranties.forEach(w => {
                    // Map by serialNo (soSerial) because idSerialDaBan is not in the response
                    if (w.soSerial) {
                         const existing = warrantyMap[w.soSerial]
                         if (!existing) {
                             warrantyMap[w.soSerial] = w
                         } else {
                             // Prioritize Active warranties (status != 4 and != 5)
                             // If both are active or both inactive, take the newer one
                             const isNewActive = w.trangThai !== 4 && w.trangThai !== 5
                             const isExistingActive = existing.trangThai !== 4 && existing.trangThai !== 5

                             if (isNewActive && !isExistingActive) {
                                 warrantyMap[w.soSerial] = w
                             } else if (isNewActive === isExistingActive) {
                                 // Compare timestamps
                                 const newDate = new Date(w.ngayTao).getTime()
                                 const existingDate = new Date(existing.ngayTao).getTime()
                                 if (newDate > existingDate) {
                                     warrantyMap[w.soSerial] = w
                                 }
                             }
                         }
                    }
                })
            }

            // Create a map of product details for quick lookup
            const productMap = {}
            if (data && data.danhSachSanPham && Array.isArray(data.danhSachSanPham)) {
                data.danhSachSanPham.forEach(sp => {
                    productMap[sp.idHoaDonChiTiet] = sp
                })
            }

            // Check danhSachSerial
            if (data && data.danhSachSerial && Array.isArray(data.danhSachSerial) && data.danhSachSerial.length > 0) {
                data.danhSachSerial.forEach(serialItem => {
                   const productDetail = productMap[serialItem.idHoaDonChiTiet] || {}
                   const productCode = productDetail.maSanPham || productDetail.maCtsp || serialItem.maSanPham || 'N/A'

                   // Check warranty status using serialNo
                   const serialId = serialItem.idSerialDaBan || serialItem.id
                   const serialNo = serialItem.soSerial || serialItem.serialNo || 'N/A'
                   const currentWarranty = warrantyMap[serialNo]

                   items.push({
                       id: serialId,
                       maHoaDon: order.ma,
                       idHoaDon: order.id,
                       tenSanPham: productDetail.tenSanPham || serialItem.tenSanPham || 'Sản phẩm',
                       maCtsp: productCode,
                       serialNo: serialItem.soSerial || serialItem.serialNo || 'N/A',
                       ngayMua: order.ngayTao,
                       ngayKetThuc: null,
                       trangThai: 2,
                       trangThaiText: 'Đã mua',
                       // Warranty Request Info
                       warrantyRequestStatus: currentWarranty ? currentWarranty.trangThai : null,
                       warrantyRequestId: currentWarranty ? currentWarranty.id : null
                   })
                })
            } else if (data && data.danhSachSanPham && Array.isArray(data.danhSachSanPham)) {
                 data.danhSachSanPham.forEach(sp => {
                   items.push({
                       id: sp.idHoaDonChiTiet,
                       maHoaDon: order.ma,
                       idHoaDon: order.id,
                       tenSanPham: sp.tenSanPham,
                       maCtsp: sp.maSanPham,
                       serialNo: 'N/A',
                       ngayMua: order.ngayTao,
                       ngayKetThuc: null,
                       trangThai: 2,
                       trangThaiText: 'Đã mua',
                       warrantyRequestStatus: null,
                       warrantyRequestId: null
                   })
                 })
            }
        } catch (e) {
            console.error(`Failed to load condition for order ${order.ma}`, e)
        }
    })

    await Promise.all(promises)

    items.sort((a, b) => new Date(b.ngayMua) - new Date(a.ngayMua))
    warranties.value = items

  } catch (error) {
    console.error('Error fetching warranties:', error)
    toast.error('Không thể tải danh sách sản phẩm')
  } finally {
    isLoading.value = false
  }
}

const createRequest = (item) => {
  if (isWarrantyActive(item.warrantyRequestStatus)) {
      toast.warning('Sản phẩm này đang có phiếu bảo hành chưa hoàn tất. Vui lòng đợi hoàn thành trước khi tạo yêu cầu mới.')
      return
  }

  selectedSerialForRequest.value = {
      ...item,
      tenSanPham: item.tenSanPham,
      serialNo: item.serialNo
  }
  isCreatingRequest.value = true
}

const showRequestHistory = () => {
  router.push('/account/warranty/history')
}

const handleRequestCreated = () => {
  isCreatingRequest.value = false
  selectedSerialForRequest.value = null
  toast.success('Yêu cầu bảo hành đã được gửi')
  fetchWarranties() // Reload to update status
}



const isWarrantyActive = (status) => {
    // Active if exists and not completed (4) or cancelled (5)
    return status !== null && status !== undefined && status !== 4 && status !== 5
}

const calculateExpirationDate = (item) => {
  if (item.ngayKetThuc) {
    return formatDate(item.ngayKetThuc)
  }
  const purchaseDateStr = item.ngayMua
  if (purchaseDateStr) {
    const purchaseDate = new Date(purchaseDateStr)
    purchaseDate.setMonth(purchaseDate.getMonth() + 12)
    return formatDate(purchaseDate)
  }
  return 'N/A'
}

const formatDate = (dateInput) => {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}




</script>

<style scoped>
.warranty-page {
  min-height: 80vh;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  color: #6c757d;
}
</style>
