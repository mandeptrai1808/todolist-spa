<template>
  <div class="profile-page">
    <div class="profile-header">
      <!-- Avatar -->
      <img :src="user.avatar || defaultAvatar" alt="User Avatar" class="avatar" />

      <!-- User Information -->
      <div class="user-info">
        <h2>{{ user.username }}</h2>
        <p>Email: {{ user.email }}</p>
      </div>
    </div>

    <!-- Task Statistics -->
    <div class="task-stats">
      <h3>Task Statistics</h3>
      <p>Total Tasks: <strong>{{ totalTasks }}</strong></p>
      <p>Completed Tasks: <strong>{{ completedTasks }}</strong></p>
      <p>Pending Tasks: <strong>{{ pendingTasks }}</strong></p>
    </div>

    <!-- Edit Profile Button -->
    <button class="btn btn-primary edit-btn" @click="toggleEditMode">
      {{ editMode ? 'Cancel' : 'Edit Profile' }}
    </button>

    <!-- Edit Profile Form -->
    <div v-if="editMode" class="edit-profile">
      <h3>Edit Profile</h3>
      <form @submit.prevent="updateUserProfile">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" v-model="editUser.username" type="text" placeholder="Enter new username" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="editUser.email" type="email" placeholder="Enter new email" />
        </div>

        <div class="form-group">
          <label for="avatar">Avatar URL</label>
          <input id="avatar" v-model="editUser.avatar" type="text" placeholder="Enter new avatar URL" />
        </div>

        <button type="submit" class="btn btn-success">Save Changes</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/services/api';

const defaultAvatar = 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg'; // Đường dẫn avatar mặc định
const user = ref({
  username: '',
  email: '',
  created_at: '',
  avatar: ''
}); // Thông tin người dùng
const tasks = ref([]); // Danh sách công việc

const editMode = ref(false); // Kiểm soát chế độ chỉnh sửa
const editUser = ref({ ...user.value }); // Dữ liệu chỉnh sửa

// Lấy số lượng task
const totalTasks = computed(() => tasks.value.length);
const completedTasks = computed(() => tasks.value.filter(task => task.status === 'completed').length);
const pendingTasks = computed(() => tasks.value.filter(task => task.status === 'pending').length);

// Lấy thông tin người dùng và task
async function fetchProfileData() {
  try {
    const token = localStorage.getItem('token');
    const userInfo = await api.getUserInfo(token);
    user.value = userInfo;

    // Đồng bộ dữ liệu chỉnh sửa với thông tin người dùng
    editUser.value = { ...user.value };

    // Lấy danh sách công việc
    const userTasks = await api.getUserTasks();
    tasks.value = userTasks;
  } catch (error) {
    console.error('Error fetching profile data:', error.message);
  }
}

// Cập nhật thông tin người dùng
async function updateUserProfile() {
  try {
    const token = localStorage.getItem('token');
    const data = await api.updateUser(user.value.id, editUser.value, token);
    localStorage.setItem('user', JSON.stringify(data));
    
    // Cập nhật thông tin hiển thị
    user.value = { ...editUser.value };

    // Thông báo thành công
    alert('Profile updated successfully!');

    // Tắt chế độ chỉnh sửa
    editMode.value = false;
  } catch (error) {
    console.error('Error updating profile:', error.message);
    alert('Failed to update profile.');
  }
}

// Bật/Tắt chế độ chỉnh sửa
function toggleEditMode() {
  editMode.value = !editMode.value;

  // Nếu hủy chỉnh sửa, hoàn nguyên dữ liệu
  if (!editMode.value) {
    editUser.value = { ...user.value };
  }
}

onMounted(() => {
  fetchProfileData();
});
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #007bff;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-info h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}

.user-info p {
  margin: 5px 0;
  font-size: 1rem;
  color: #666;
}

.task-stats {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
}

.task-stats h3 {
  margin: 0;
  margin-bottom: 10px;
  font-size: 1.4rem;
  color: #333;
}

.task-stats p {
  margin: 5px 0;
  font-size: 1rem;
  color: #555;
}

.task-stats strong {
  color: #007bff;
}

.edit-profile {
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.edit-profile h3 {
  margin-bottom: 15px;
}

.edit-profile .form-group {
  margin-bottom: 15px;
}

.edit-profile .form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.edit-profile .form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.edit-btn {
  margin-top: 20px;
}
</style>
