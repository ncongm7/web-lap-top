<template>
  <section>
    <!-- Container chính chỉ hiển thị khi có dữ liệu sản phẩm -->
    <div class="container my-3" v-if="store.ctsp">
      <div class="row g-3 align-items-start">
        <!-- Cột trái: Ảnh sản phẩm -->
        <div class="col-md-4">
          <img :src="imageUrl" class="img-fluid w-100" alt="Ảnh sản phẩm">
        </div>

        <!-- Cột phải: Thông tin + cấu hình + mua ngay -->
        <div class="col-md-8">
          <div class="row">
            <div class="col-12">
              <h5 class="mb-3">{{ titleLine }}</h5>
            </div>

            <!-- Giá + danh sách biến thể + mua ngay -->
            <div class="col-md-6 mb-3">
              <div class="border rounded p-3 mb-3">
                <div class="h3 text-danger mb-2">{{ formatVND(store.ctsp.giaBan) }}</div>
                <div class="small text-muted">Giá đã gồm VAT (nếu có)</div>
              </div>

              <div class="mb-3" v-if="variantsToShow.length">
                <div class="fw-semibold mb-2">Tùy chọn cấu hình</div>
                <div class="list-group">
                  <button
                    v-for="v in variantsToShow"
                    :key="v.idctsp"
                    type="button"
                    class="list-group-item list-group-item-action"
                    @click="goVariant(v.idctsp)"
                  >
                    <div class="d-flex justify-content-between">
                      <span class="me-2">{{ variantSummary(v) }}</span>
                      <span v-if="v.giaBan" class="fw-semibold text-danger">{{ formatVND(v.giaBan) }}</span>
                    </div>
                  </button>
                </div>
              </div>

              <button class="btn btn-danger btn-lg w-100" @click="buyNow">
                MUA NGAY
              </button>
            </div>

            <!-- Khối khuyến mãi/phụ -->
            <div class="col-md-6 mb-3">
              <div class="border rounded p-3">
                <div class="badge bg-success mb-2">🎁 QUÀ TẶNG/KHUYẾN MẠI</div>
                <ul class="mb-0">
                  <li>Windows bản quyền.</li>
                  <li>✅ Miễn phí cân màu màn hình công nghệ cao.</li>
                  <li>✅ Balo thời trang VietLapTop sành điệu.</li>
                  <li>✅ Chuột không dây &amp; Bàn di cao cấp.</li>
                  <li>✅ Gói bảo dưỡng, vệ sinh tra keo tản nhiệt &amp; cài phần mềm trọn đời.</li>
                  <li>✅ Voucher giảm giá cho lần mua tiếp theo.</li>
                  <li>☎ Liên hệ để biết chương trình khuyến mãi hiện hành.</li>
                </ul>
              </div>
              <div class="border rounded p-3">
                <div class="fw-bold text-danger text-center mb-2">
                  🛍️ YÊN TÂM MUA SẮM TẠI LAPTOP AZ
                </div>
                <ul class="mb-0">
                  <li>⭐ Chất lượng sản phẩm là hàng đầu</li>
                  <li>⭐ Dùng test 15 ngày đầu, lỗi 1 đổi 1</li>
                  <li>⭐ Hỗ trợ và hậu mãi tốt</li>
                  <li>⭐ Trả góp ưu đãi qua thẻ</li>
                  <li>⭐ Giao hàng miễn phí toàn quốc</li>
                </ul>
              </div>
            </div>
          </div>
        </div><!-- /col-md-8 -->
      </div>
    </div>

    <div class="container my-3" v-else>
      <div class="alert alert-info" v-if="store.loading">Đang tải chi tiết sản phẩm...</div>
      <div class="alert alert-danger" v-else-if="store.error">Lỗi tải dữ liệu.</div>
    </div>
  </section>

  <!-- Bảng thông số kỹ thuật -->
  <section v-if="store.ctsp" class="container my-4">
    <div class="card">
      <div class="card-header fw-semibold">Thông số kỹ thuật</div>
      <div class="card-body p-0">
        <table class="table mb-0 align-middle">
          <tbody>
            <tr v-for="row in attrRows" :key="row.key">
              <th class="w-25 text-nowrap">{{ row.label }}</th>
              <td>
                <span>{{ row.value }}</span>
                <!-- swatch màu -->
                <span
                  v-if="row.hex"
                  class="ms-2 d-inline-block align-middle"
                  :style="{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: '1px solid rgba(0,0,0,.15)',
                    backgroundColor: row.hex,
                    verticalAlign: 'middle'
                  }"
                  :title="row.hex"
                ></span>
                <small v-if="row.hex" class="ms-1 text-muted">{{ row.hex }}</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
// Core
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCtspCustomerStore } from "@/stores/ctspStore";

// Router + Store
const route = useRoute();
const router = useRouter();
const store = useCtspCustomerStore();

// Ảnh tạm (có thể đổi dynamic)
const imageUrl = "https://laptopaz.vn/media/product/3789_46549_ap7.jpg";

/**
 * Refetch khi đổi :id trên URL
 * - lấy chi tiết CTSP theo id
 * - sau khi có chi tiết, kéo variants theo idsp
 */
watch(
  () => route.params.id,
  async (id) => {
    if (!id) return;
    store.loading = true;
    store.error = null;
    try {
      await store.fetchById(id);
      const idsp = store.ctsp?.idsp;
      if (idsp) await store.fetchVariants(idsp);
    } catch (e) {
      // error đã set trong store
    } finally {
      store.loading = false;
    }
  },
  { immediate: true }
);

// Title line
const titleLine = computed(() => {
  const d = store.ctsp;
  if (!d) return "";
  return [d.tenSp, d.tenCpu, d.tenGpu, d.tenRam, d.dungLuongOCung, d.kichThuocManHinh]
    .filter(Boolean)
    .join(" | ");
});

// Định dạng VND
function formatVND(n) {
  if (n == null) return "";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
}

// Tóm tắt biến thể
function variantSummary(v) {
  return [v.tenCpu, v.tenRam, v.dungLuongOCung, v.kichThuocManHinh]
    .filter(Boolean)
    .join(", ");
}

// Điều hướng đến biến thể theo route name 'product-detail'
function goVariant(idctsp) {
  const cur = String(route.params.id || "");
  const next = String(idctsp || "");
  if (!next || next === cur) return;
  router.push({ name: "product-detail", params: { id: next } });
}

// Ẩn biến thể hiện tại khỏi danh sách
const variantsToShow = computed(() => {
  const cur = String(store.ctsp?.idctsp || "");
  return (store.variants || []).filter((v) => String(v.idctsp || v.id) !== cur);
});

// Helper tạo "Tên (Mô tả)"
const withDesc = (name, desc) => {
  const n = name?.toString().trim();
  const d = desc?.toString().trim();
  if (n && d) return `${n} (${d})`;
  return n || d || "";
};

// Hàng thông số kỹ thuật
const attrRows = computed(() => {
  const d = store.ctsp || {};
  return [
    { key: "ten",      label: "Tên sản phẩm", value: d.tenSp || "" },
    { key: "cpu",      label: "CPU",          value: withDesc(d.tenCpu, d.moTaCpu) },
    { key: "gpu",      label: "GPU",          value: withDesc(d.tenGpu, d.moTaGpu) },
    { key: "ram",      label: "RAM",          value: withDesc(d.tenRam, d.moTaRam) },
    { key: "ocung",    label: "Ổ cứng",       value: withDesc(d.dungLuongOCung, d.moTaOCung) },
    { key: "manhinh",  label: "Màn hình",     value: withDesc(d.kichThuocManHinh, d.moTaManHinh) },
    { key: "pin",      label: "Pin",          value: withDesc(d.dungLuongPin, d.moTaPin) },
    { key: "mausac",   label: "Màu sắc",      value: withDesc(d.tenMauSac, d.moTaMauSac), hex: d.hexCodeMauSac },
    { key: "giaban",   label: "Giá bán",      value: d.giaBan != null ? formatVND(d.giaBan) : "" },
    // Nếu muốn hiện mã/ID:
    // { key: "idctsp",   label: "Mã CTSP",      value: d.idctsp || "" },
    // { key: "idsp",     label: "Mã SP",        value: d.idsp || "" },
  ].filter((r) => r.value); // Ẩn dòng trống
});

// Mua ngay (demo)
function buyNow() {
  alert("Mua ngay: " + (store.ctsp?.tenSp || ""));
}
</script>
