<template>
    <div class="login-page">
      <div class="login-container">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
          <!-- Email Input -->
          <div class="form-group">
            <label for="email">Email</label>
            <input v-model="email" type="email" id="email" placeholder="Enter your email" required />
          </div>
  
          <!-- Password Input -->
          <div class="form-group">
            <label for="password">Password</label>
            <input v-model="password" type="password" id="password" placeholder="Enter your password" required />
          </div>
  
          <!-- Error Message -->
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  
          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
  
        <!-- Link to Register -->
        <p class="register-link">
            Don't have an account?  
          <router-link :to="{ name: 'register' }">Register</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

async function handleLogin() {
  try {
    // Gọi API login
    const userInfo = await api.login({
      email: email.value,
      password: password.value,
    });

    console.log('User info after login:', userInfo);

    // Phát sự kiện thông báo user info đã thay đổi

    // Điều hướng tới trang chính sau khi đăng nhập thành công
    
    router.push({ name: 'home' });
  } catch (error) {
    console.error('Login failed:', error.message);
    errorMessage.value = error.message; // Hiển thị lỗi
  }
}
</script>

  
  <style scoped>
  /* Styling for login page */
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  .login-container {
    max-width: 400px;
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .error-message {
    color: red;
    margin-top: 10px;
  }
  
  .btn {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: #0056b3;
  }
  
  .register-link {
    margin-top: 15px;
    color: #007bff;
  }
  
  .register-link a {
    color: #007bff;
    text-decoration: underline;
  }
  
  .register-link a:hover {
    text-decoration: none;
  }
  </style>
  