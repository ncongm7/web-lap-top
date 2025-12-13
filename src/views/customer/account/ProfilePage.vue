<template>
    <div class="profile-page container">
        <div class="row justify-content-center">
            <div class="col-md-10 col-lg-8">
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h4 class="card-title mb-4 fw-bold text-primary">
                            <i class="bi bi-person-circle me-2"></i>Hồ sơ cá nhân
                        </h4>

                        <!-- Tabs -->
                        <ul class="nav nav-tabs mb-4">
                            <li class="nav-item">
                                <a class="nav-link" :class="{ active: activeTab === 'info' }" href="#"
                                    @click.prevent="activeTab = 'info'">
                                    <i class="bi bi-info-circle me-1"></i> Thông tin cơ bản
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" :class="{ active: activeTab === 'security' }" href="#"
                                    @click.prevent="activeTab = 'security'">
                                    <i class="bi bi-shield-lock me-1"></i> Bảo mật
                                </a>
                            </li>
                        </ul>

                        <!-- Info Tab -->
                        <div v-if="activeTab === 'info'">
                            <form @submit.prevent="handleUpdateProfile">
                                <div class="mb-3">
                                    <label class="form-label text-muted">Họ và tên</label>
                                    <input type="text" class="form-control" v-model="profileForm.name" required
                                        placeholder="Nhập họ tên của bạn">
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label text-muted">Số điện thoại</label>
                                        <input type="tel" class="form-control" v-model="profileForm.phone"
                                            placeholder="Nhập số điện thoại">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label text-muted">Email</label>
                                        <input type="email" class="form-control bg-light" v-model="profileForm.email"
                                            disabled readonly>
                                        <small class="text-muted fst-italic">Không thể thay đổi email đăng nhập</small>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label text-muted">Giới tính</label>
                                        <select class="form-select" v-model="profileForm.gender">
                                            <option :value="true">Nam</option>
                                            <option :value="false">Nữ</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label text-muted">Ngày sinh</label>
                                        <input type="date" class="form-control" v-model="profileForm.birthday">
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted">Địa chỉ mặc định (từ hồ sơ nhân sự/khách
                                        hàng)</label>
                                    <input type="text" class="form-control" v-model="profileForm.address"
                                        placeholder="Địa chỉ liên hệ">
                                </div>

                                <div class="d-flex justify-content-end mt-4">
                                    <button type="submit" class="btn btn-primary px-4" :disabled="isLoading">
                                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                        Cập nhật thông tin
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Security Tab -->
                        <div v-if="activeTab === 'security'">
                            <form @submit.prevent="handleChangePassword">
                                <div class="mb-3">
                                    <label class="form-label">Mật khẩu hiện tại</label>
                                    <input type="password" class="form-control" v-model="passwordForm.oldPassword"
                                        required>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Mật khẩu mới</label>
                                    <input type="password" class="form-control" v-model="passwordForm.newPassword"
                                        required minlength="6">
                                    <div class="form-text">Tối thiểu 6 ký tự</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Xác nhận mật khẩu mới</label>
                                    <input type="password" class="form-control" v-model="passwordForm.confirmPassword"
                                        required>
                                </div>

                                <div v-if="passwordError" class="alert alert-danger py-2">
                                    {{ passwordError }}
                                </div>

                                <div class="d-flex justify-content-end mt-4">
                                    <button type="submit" class="btn btn-warning px-4 text-white"
                                        :disabled="isPasswordLoading">
                                        <span v-if="isPasswordLoading"
                                            class="spinner-border spinner-border-sm me-2"></span>
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import userService from '@/service/customer/userService'
import { useToast } from 'vue-toastification'
import { useLayoutStore } from '@/stores/customer/layoutStore'

const toast = useToast()
const layoutStore = useLayoutStore()
const activeTab = ref('info')
const isLoading = ref(false)
const isPasswordLoading = ref(false)
const passwordError = ref('')

const profileForm = reactive({
    name: '',
    phone: '',
    email: '',
    gender: true,
    birthday: '',
    address: ''
})

const passwordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

onMounted(async () => {
    await fetchProfile()
})

const fetchProfile = async () => {
    try {
        isLoading.value = true
        const res = await userService.getMyProfile()
        if (res.data) {
            const u = res.data
            profileForm.name = u.name
            profileForm.phone = u.phone
            profileForm.email = u.email
            // Assuming layoutStore stores similar info, update it
            // Note: Backend DTO might need check for gender/dob if we added them to UserDTO
            // Currently UserDTO only has basic info. 
            // Wait, I updated UserDTO? No, I updated UserController but UserDTO structure is still basic?
            // Step 1989 showed UserDTO structure. It DOES NOT have gender/birthday.
            // So fetchProfile won't get them unless I update UserDTO.

            // I should update UserDTO in backend first? Or assume they are missing for now?
            // I added logic to UPDATE them in backend, but GET mapping (mapToUserDTO) was NOT updated to include them.
            // I will fix Backend UserDTO in next step. For now frontend is ready to receive them.

            profileForm.address = u.address
            if (u.gender !== undefined) profileForm.gender = u.gender
            if (u.birthday) profileForm.birthday = u.birthday
        }
    } catch (error) {
        console.error(error)
        toast.error('Không thể tải thông tin hồ sơ')
    } finally {
        isLoading.value = false
    }
}

const handleUpdateProfile = async () => {
    try {
        isLoading.value = true
        const res = await userService.updateMyProfile({
            name: profileForm.name,
            phone: profileForm.phone,
            email: profileForm.email,
            gender: profileForm.gender,
            birthday: profileForm.birthday, // Ensure format YYYY-MM-DD
            address: profileForm.address
        })

        toast.success('Cập nhật hồ sơ thành công')
        // Update store display name
        layoutStore.checkAuthStatus()
    } catch (error) {
        console.error(error)
        toast.error('Cập nhật thất bại: ' + (error.response?.data?.message || 'Lỗi hệ thống'))
    } finally {
        isLoading.value = false
    }
}

const handleChangePassword = async () => {
    passwordError.value = ''
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        passwordError.value = 'Mật khẩu xác nhận không khớp'
        return
    }

    try {
        isPasswordLoading.value = true
        await userService.changePassword({
            oldPassword: passwordForm.oldPassword,
            newPassword: passwordForm.newPassword
        })
        toast.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.')
        // Logout flow? Or just stay logged in?
        // Usually stay logged in or logout.
        resetPasswordForm()
    } catch (error) {
        console.error(error)
        passwordError.value = error.response?.data?.message || 'Đổi mật khẩu thất bại'
    } finally {
        isPasswordLoading.value = false
    }
}

const resetPasswordForm = () => {
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
}
</script>

<style scoped>
.profile-page {
    padding-top: 2rem;
    padding-bottom: 3rem;
    background-color: #f8f9fa;
    min-height: 80vh;
}

.nav-link {
    color: #495057;
    cursor: pointer;
}

.nav-link.active {
    color: #0d6efd;
    font-weight: 600;
}
</style>
