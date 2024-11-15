<template>
    <div class="container mt-5">
      <h1>Profile Page</h1>
      <p>Welcome to your profile page, {{ user.username }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Lấy thông tin từ localStorage
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  </script>
  
  <style scoped>
  .container {
    text-align: center;
  }
  </style>
  