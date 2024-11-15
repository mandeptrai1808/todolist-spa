<template>
    <div class="register-page">
      <div class="register-container">
        <h1>Register</h1>
        <form @submit.prevent="handleRegister">
          <!-- Username Input -->
          <div class="form-group">
            <label for="username">Username</label>
            <input v-model="username" type="text" id="username" placeholder="Enter your username" required />
          </div>
  
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
          <button type="submit" class="btn btn-primary">Register</button>
        </form>
  
        <!-- Back to Login Button -->
        <button class="btn btn-secondary mt-3" @click="goToLogin">Return Login</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '@/services/api';
  
  const username = ref('');
  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const router = useRouter();
  
  async function handleRegister() {
    try {
      await api.register({ username: username.value, email: email.value, password: password.value });
      alert('Đăng ký thành công! Quay lại trang đăng nhập.');
      router.push({ name: 'login' });
    } catch (error) {
      errorMessage.value = error.message || 'Đăng ký thất bại.';
    }
  }
  
  function goToLogin() {
    router.push({ name: 'login' });
  }
  </script>
  
  <style scoped>
  .register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  .register-container {
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
  
  .btn-secondary {
    background-color: #6c757d;
  }
  
  .btn-secondary:hover {
    background-color: #5a6268;
  }
  
  .btn:hover {
    background-color: #0056b3;
  }
  
  .mt-3 {
    margin-top: 1rem;
  }
  </style>
  