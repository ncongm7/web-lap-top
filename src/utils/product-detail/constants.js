/**
 * ========================================
 * PRODUCT CONSTANTS
 * ========================================
 * Các hằng số và cấu hình cho module sản phẩm
 */

// Placeholder images
export const PRODUCT_PLACEHOLDER_IMAGE = 'https://laptopaz.vn/media/product/3789_46549_ap7.jpg'

// Default texts
export const DEFAULT_PRODUCT_DESCRIPTION = 
  'Thông tin chi tiết sản phẩm đang được cập nhật. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.'

// Review filters
export const REVIEW_FILTERS = ['Tất cả', '5 sao', '4 sao', '3 sao', '2 sao', '1 sao']

// Tab names
export const PRODUCT_TABS = {
  DESCRIPTION: 'description',
  SPECS: 'specs',
  REVIEWS: 'reviews',
}

// Promotion list (có thể move ra API sau này)
export const DEFAULT_PROMOTIONS = [
  'Tặng Windows bản quyền trị giá 3.000.000đ',
  'Miễn phí cân màu màn hình chuyên nghiệp',
  'Tặng balo cao cấp + Chuột không dây',
  'Voucher 500.000đ cho lần mua tiếp theo',
]

// Similar products (mock data - nên thay bằng API call)
export const SIMILAR_PRODUCTS = [
  { id: 1, name: 'Laptop Asus Vivobook 15 OLED A1505', url: '#' },
  { id: 2, name: 'Laptop HP Pavilion 14 2024', url: '#' },
  { id: 3, name: 'Laptop Dell Inspiron 14 Plus', url: '#' },
  { id: 4, name: 'Laptop MSI Modern 15 B13M', url: '#' },
]

// Related news (mock data - nên thay bằng API call)
export const RELATED_NEWS = [
  { id: 1, title: 'Top 5 laptop học tập đáng mua 2024', url: '#' },
  { id: 2, title: 'Hướng dẫn tối ưu hiệu năng Windows 11', url: '#' },
  { id: 3, title: 'Kinh nghiệm chọn laptop đồ họa', url: '#' },
]

// Review breakdown (mock data - nên thay bằng API call)
export const DEFAULT_REVIEW_BREAKDOWN = [
  { stars: 5, percent: 68 },
  { stars: 4, percent: 20 },
  { stars: 3, percent: 7 },
  { stars: 2, percent: 3 },
  { stars: 1, percent: 2 },
]

// Rating metadata (mock - nên lấy từ API)
export const DEFAULT_RATING = {
  score: 4.5,
  total: 128,
}

