import axiosInstance from '@/service/axiosInstance'

const FALLBACK_CATEGORIES = [
  {
    id: 'gaming',
    name: 'Laptop Gaming',
    slug: 'laptop-gaming',
    iconUrl: '',
    productCount: 150,
  },
  {
    id: 'office',
    name: 'Laptop Văn Phòng',
    slug: 'laptop-van-phong',
    iconUrl: '',
    productCount: 230,
  },
  {
    id: 'design',
    name: 'Laptop Đồ Họa',
    slug: 'laptop-do-hoa',
    iconUrl: '',
    productCount: 85,
  },
  {
    id: 'student',
    name: 'Laptop Sinh Viên',
    slug: 'laptop-sinh-vien',
    iconUrl: '',
    productCount: 180,
  },
  {
    id: 'ultrabook',
    name: 'Laptop Mỏng Nhẹ',
    slug: 'laptop-mong-nhe',
    iconUrl: '',
    productCount: 120,
  },
  {
    id: 'premium',
    name: 'Laptop Cao Cấp',
    slug: 'laptop-cao-cap',
    iconUrl: '',
    productCount: 95,
  },
]

export async function getCategories() {
  try {
    const response = await axiosInstance.get('/api/categories')
    const data = response.data?.data || response.data
    if (Array.isArray(data) && data.length > 0) {
      return data
    }
    console.warn('[CategoryService] API trả về rỗng, sử dụng fallback')
    return FALLBACK_CATEGORIES
  } catch (error) {
    console.warn(
      '[CategoryService] Lỗi khi lấy danh mục, sử dụng fallback.',
      error?.response?.status,
    )
    return FALLBACK_CATEGORIES
  }
}

export default {
  getCategories,
}
