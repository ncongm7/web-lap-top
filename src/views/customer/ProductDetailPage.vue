<template>
  <section>
    <!-- Container chính chỉ hiển thị khi có dữ liệu sản phẩm -->
    <div class="container my-3" v-if="store.ctsp">
      <!-- Grid system với khoảng cách 3 (g-3) và căn đầu các cột -->
      <div class="row g-3 align-items-start">
        <!-- Cột trái: Hiển thị ảnh sản phẩm (chiếm 4/12 cols trên màn hình medium) -->
        <div class="col-md-4">
          <img :src="imageUrl" class="img-fluid w-100" alt="Ảnh sản phẩm">
        </div>

        <!-- Cột phải: Chứa thông tin sản phẩm (chiếm 8/12 cols) -->
        <div class="col-md-8">
          <!-- Tiêu đề sản phẩm: kết hợp tên và thông số kỹ thuật -->
          <div class="row">
            <div class="col-12">
              <h5 class="mb-3">{{ titleLine }}</h5>
            </div>

            <!-- Cột giữa: Hiển thị giá, các tùy chọn cấu hình và nút mua ngay -->
            <div class="col-md-6 mb-3">
              <!-- Khung hiển thị giá bán -->
              <div class="border rounded p-3 mb-3">
                <!-- Giá được hiển thị với màu đỏ và định dạng tiền VND -->
                <div class="h3 text-danger mb-2">{{ formatVND(store.ctsp.giaBan) }}</div>
                <div class="small text-muted">Giá đã gồm VAT (nếu có)</div>
              </div>

              <!-- Phần chọn cấu hình khác của sản phẩm -->
              <div class="mb-3" v-if="variantsToShow.length">
                <div class="fw-semibold mb-2">Tùy chọn cấu hình</div>
                <div class="list-group">
                  <button v-for="v in variantsToShow" :key="v.idctsp" type="button"
                    class="list-group-item list-group-item-action" @click="goVariant(v.idctsp)">
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

            <!-- Cột phải: Quà tặng / quảng cáo -->
            <div class="col-md-6 mb-3">
              <div class="border rounded p-3">
                <div class="badge bg-success mb-2">🎁 QUÀ TẶNG/KHUYẾN MẠI</div>
                <ul class="mb-0">
                  <li>Windows bản quyền.</li>
                  <li>✅ Miễn phí cân màu màn hình công nghệ cao.</li>
                  <li>✅ Balo thời trang VietLapTop sành điệu.</li>
                  <li>✅ Chuột không dây &amp; Bàn di cao cấp.</li>
                  <li>✅ Gói bảo dưỡng, vệ sinh tra keo tản nhiệt Thermal Grizzly Kryonaut &amp; cài đặt phần mềm miễn
                    phí TRỌN ĐỜI.</li>
                  <li>✅ Voucher giảm giá cho lần mua hàng tiếp theo.</li>
                  <li>☎ Giá máy chưa được áp dụng các chương trình khuyến mãi, Liên hệ ngay để biết thông tin chi tiết
                  </li>
                </ul>
              </div>
              <div class="border rounded p-3">
                <div class="fw-bold text-danger text-center mb-2">
                  🛍️ YÊN TÂM MUA SẮM TẠI LAPTOP AZ
                </div>
                <ul class="mb-0">
                  <li>⭐ Chất lượng sản phẩm là hàng đầu</li>
                  <li>⭐ Dùng test máy 15 ngày đầu lỗi 1 đổi 1</li>
                  <li>⭐ Hỗ trợ và hậu mãi sau bán hàng tốt nhất</li>
                  <li>⭐ Trả góp ưu đãi lãi suất qua thẻ visa</li>
                  <li>⭐ Giao hàng miễn phí toàn quốc nhanh nhất</li>
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
  <section>

  </section>
</template>

<script setup>
// Import các composables và store cần thiết
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCtspCustomerStore } from "@/stores/ctspStore";

// Khởi tạo router và store
const route = useRoute();
const router = useRouter();
const store = useCtspCustomerStore();

// URL ảnh sản phẩm (có thể chuyển thành dynamic sau)
const imageUrl = "https://laptopaz.vn/media/product/3789_46549_ap7.jpg";

// Khi component được mount, tải thông tin chi tiết sản phẩm
onMounted(async () => {
  const id = route.params.id;
  await store.fetchById(id);
});

// Theo dõi sự thay đổi của ID sản phẩm để tải danh sách biến thể
watch(
  () => store.ctsp?.idsp,
  async (idsp) => { if (idsp) await store.fetchVariants(idsp); },
  { immediate: true } // Chạy ngay lập tức khi component được tạo
);

// Tính toán tiêu đề sản phẩm từ các thông số kỹ thuật
const titleLine = computed(() => {
  const d = store.ctsp;
  if (!d) return "";
  // Kết hợp các thông số thành một chuỗi, phân cách bằng dấu |
  return [d.tenSp, d.tenCpu, d.tenGpu, d.tenRam, d.dungLuongOCung, d.kichThuocManHinh]
    .filter(Boolean).join(" | ");
});

// Hàm định dạng số thành tiền VND
function formatVND(n) {
  if (n == null) return "";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(n);
}

// Tạo chuỗi tóm tắt thông số cho mỗi biến thể
function variantSummary(v) {
  return [v.tenCpu, v.tenRam, v.dungLuongOCung, v.kichThuocManHinh]
    .filter(Boolean)
    .join(", ");
}

// Chuyển hướng người dùng đến biến thể khác của sản phẩm
function goVariant(idctsp) {
  if (idctsp && idctsp !== route.params.id) {
    // Giữ nguyên tên route, chỉ thay đổi id trong params
    router.push({ name: route.name, params: { id: idctsp } });
  }
}
const variantsToShow = computed(() => {
  const cur = String(store.ctsp?.idctsp || "");
  return (store.variants || []).filter(v => String(v.idctsp || v.id) !== cur);
});


// Xử lý sự kiện khi người dùng nhấn nút Mua ngay
function buyNow() {
  // TODO: Implement thêm chức năng mua hàng
  // Có thể chuyển hướng đến trang giỏ hàng/thanh toán:
  // router.push({ name: "Checkout", query: { ctspId: store.ctsp.idctsp, qty: 1 } });
  alert("Mua ngay: " + (store.ctsp?.tenSp || ""));
}
</script>
