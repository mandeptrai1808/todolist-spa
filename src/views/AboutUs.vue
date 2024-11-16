<template>
    <div class="about-page">
        <h1>About Us</h1>
    <p>
      Welcome to the TODO LIST application. This app is designed to help you manage your tasks efficiently and effectively. Whether you are organizing your daily to-do list, planning long-term goals, or tracking the progress of ongoing projects, this app is here to simplify your workflow and maximize productivity.
    </p>
    <p>
      With a clean and user-friendly interface, our application makes it easy for you to add, edit, prioritize, and complete tasks. You can filter tasks based on their status, manage your priorities with ease, and track your progress in real-time. Our goal is to make task management a stress-free experience for everyone.
    </p>
    <p>
      Feel free to explore and make the most out of our features. We are continuously working to improve and bring you the best experience possible. Thank you for choosing our application to stay organized and productive.
    </p>
    <div class="creators-section">
      <h2>Meet the Developers</h2>
      <div class="creator">
        <img
          src="/phuongthuy.jpg"
          alt="Phuong Thuy"
          class="creator-image"
        />
        <p class="creator-name">Phuong Thuy</p>
        <p class="creator-role">Co-Founder & Lead Developer</p>
      </div>
      <div class="creator">
        <img
          src="/taipham.jpg"
          alt="Tai Pham"
          class="creator-image"
        />
        <p class="creator-name">Tai Pham</p>
        <p class="creator-role">Co-Founder & Backend Specialist</p>
      </div>
    </div>
    </div>
  </template>
  
  <style scoped>
  .about-page {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    line-height: 1.6;
  }
  
  .about-page h1 {
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  .about-page p {
    font-size: 1rem;
    margin-bottom: 20px;
  }
  
  .creators-section {
    margin-top: 40px;
  }
  
  .creators-section h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
  
  .creator {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 15px;
  }
  
  .creator-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .creator-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
  }
  
  .creator-role {
    font-size: 0.9rem;
    color: #555;
    margin: 0;
  }
  </style>
  