<template>
  <div class="todo-page">
    <h1>My ToDo List</h1>
    <!-- Input Form -->
    <form @submit.prevent="addTask" class="todo-form">
      <input v-model="newTask.title" type="text" placeholder="Task title" required />
      <textarea v-model="newTask.description" placeholder="Task description"></textarea>
      <select v-model="newTask.priority">
        <option value="true">High Priority</option>
        <option value="false">Normal Priority</option>
      </select>
      <button type="submit" class="btn btn-primary">Add Task</button>
    </form>

    <!-- Filters -->
    <div class="filters">
      <button
        v-for="filter in filters"
        :key="filter"
        :class="{ active: currentFilter === filter }"
        @click="setFilter(filter)"
      >
        {{ filter }}
      </button>
    </div>

    <!-- Task List -->
    <ul class="task-list">
      <li
        v-for="task in sortedFilteredTasks"
        :key="task.id"
      >
        <div class="task"
        :class="{ completed: task.status === 'completed' }">
          <!-- Task Content -->
          <div  
          class="task-content">
            <div class="task-header">
              <input
                type="checkbox"
                :checked="task.status === 'completed'"
                @change="toggleStatus(task.id)"
              />
              <div class="task-details">
                <h3>
                  {{ task.title }}
                  <span v-if="task.priority" class="priority-icon" title="High Priority">
                    <i class="fas fa-star"></i>
                  </span>
                </h3>
                <p>{{ task.description }}</p>
              </div>
            </div>
          </div>

          <!-- Task Actions -->
          <div class="task-actions">
            <button @click="editTask(task)" title="Edit Task">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deleteTask(task.id)" title="Delete Task">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';

const tasks = ref([]); // Danh sách công việc
const newTask = ref({
  title: '',
  description: '',
  priority: false,
}); // Công việc mới
const currentFilter = ref('All'); // Bộ lọc hiện tại
const filters = ['All', 'Pending', 'Completed']; // Bộ lọc

// Lấy danh sách công việc
async function fetchTasks() {
  try {
    const response = await api.getUserTasks();
    console.log('Tasks fetched:', response);
    tasks.value = response;
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
  }
}

// Thêm công việc mới
async function addTask() {
  try {
    const taskToCreate = {
      ...newTask.value,
      priority: newTask.value.priority === 'true', // Chuyển thành Boolean
    };
    console.log('Task to create:', taskToCreate);
    await api.createTask(taskToCreate);
    fetchTasks();
    newTask.value = { title: '', description: '', priority: false }; // Reset form
  } catch (error) {
    console.error('Error adding task:', error.message);
  }
}

// Chỉnh sửa công việc (Mockup)
function editTask(task) {
  alert(`Edit feature not implemented yet for task: ${task.title}`);
}

// Xóa công việc
async function deleteTask(id) {
  try {
    await api.deleteTask(id);
    fetchTasks();
  } catch (error) {
    console.error('Error deleting task:', error.message);
  }
}

// Đổi trạng thái công việc
async function toggleStatus(id) {
  try {
    const task = tasks.value.find((t) => t.id === id);
    const updatedTask = { ...task, status: task.status === 'pending' ? 'completed' : 'pending' };
    await api.updateTask(id, updatedTask);
    fetchTasks();
  } catch (error) {
    console.error('Error toggling task status:', error.message);
  }
}

// Thiết lập bộ lọc
function setFilter(filter) {
  currentFilter.value = filter;
}

// Danh sách công việc đã lọc và sắp xếp
const sortedFilteredTasks = computed(() => {
  return [...tasks.value]
    .filter((task) => {
      if (currentFilter.value === 'All') return true;
      return task.status === currentFilter.value.toLowerCase();
    })
    .sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1; // Completed xuống cuối
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      if (a.priority !== b.priority) return b.priority - a.priority; // Ưu tiên trước
      return new Date(b.created_at) - new Date(a.created_at); // Task mới nhất lên trên
    });
});


// Lấy dữ liệu khi trang được load
onMounted(() => {
  fetchTasks();
});
</script>

<style>
.todo-page {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.todo-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filters button {
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}

.filters .active {
  font-weight: bold;
}

.task-list {
  list-style-type: none;
  padding: 0;
}

.task {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
  position: relative;
}

.task.completed {
  background-color: #d3d3d3 !important; /* Màu nền xám cho task hoàn thành */
  color: black;
}

.priority-icon {
  color: gold;
  font-size: 1.2rem;
  margin-left: 5px; /* Khoảng cách với tiêu đề */
}

.task-header {
  display: flex;
  align-items: center;
}

.task-details {
  margin-left: 10px;
}

.task-details h3 {
  margin: 0;
  font-size: 1.2rem;
}

.task-details p {
  margin: 0;
  font-size: 0.9rem;
  color: #555;
}

.task-actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}

button i {
  font-size: 1rem;
}
</style>
