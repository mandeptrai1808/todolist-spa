<template>
  <nav class="navbar navbar-expand bg-dark" data-bs-theme="dark">
    <div class="container-fluid">
      <!-- Logo -->
      <a href="/home" class="navbar-brand">TODO LIST</a>

      <!-- Navbar Items -->
      <div class="me-auto navbar-nav">
        <li class="nav-item">
          <router-link :to="{ name: 'home' }" class="nav-link">
            Home
            <i class="fas fa-home"></i>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'admin' }" class="nav-link" v-if="isAdmin">
            Admin
            <i class="fas fa-user-cog"></i>
          </router-link>
        </li>
      </div>

      <!-- User Dropdown -->
      <div class="dropdown ms-auto" v-if="user">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          id="userDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ user.value?.username }}
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
          <li>
            <router-link :to="{ name: 'profile' }" class="dropdown-item">
              Profile
            </router-link>
          </li>
          <li>
            <button class="dropdown-item" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { userState } from '@/eventBus'; // Import EventBus
import { Dropdown } from 'bootstrap';

const user = ref(JSON.parse(localStorage.getItem('user')) || null);
const isAdmin = computed(() => user?.value?.role === 'admin');
const router = useRouter();



// Hàm load thông tin user từ localStorage
function loadUserFromLocalStorage() {
  try {
    const userData = localStorage.getItem('user');
    user.value = userData ? JSON.parse(userData) : null;
    console.log("header:", user.value)
    userState.value = user.value; // Đồng bộ userState
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
  }
}

// Theo dõi userState để cập nhật user khi có thay đổi
watch(userState, (newUser) => {
  user.value = newUser;
});

// Hàm logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  user.value = null;
  userState.value = null; // Đồng bộ trạng thái
  router.push({ name: 'login' });
}

// Load thông tin user khi component được mount
onMounted(() => {
  loadUserFromLocalStorage();
  const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
  dropdownElementList.map((dropdownToggleEl) => new Dropdown(dropdownToggleEl));
});
</script>


<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
