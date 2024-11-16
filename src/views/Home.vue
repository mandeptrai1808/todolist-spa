<template>
  <div class="todo-page">
    <!-- Header Section -->
    <div class="header-section" style="display: flex; justify-content: space-between; align-items: center;">
      <h1>My Todo List</h1>
      <button @click="toggleAddTaskForm" class="add-task-button"
      style="
          width: 50px; 
          height: 50px; 
          border-radius: 50%; 
          background-color: blueviolet; 
          color: white; 
          border: none; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          cursor: pointer; 
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <i class="fas fa-plus"></i>
      </button>
    </div>

    <!-- Input Form -->
    <form v-if="showAddTaskForm" @submit.prevent="addTask" class="todo-form">
      <input v-model="newTask.title" type="text" placeholder="Task title" required />
      <textarea v-model="newTask.description" placeholder="Task description"></textarea>
      <select v-model="newTask.priority">
        <option value="true">High Priority</option>
        <option value="false">Normal Priority</option>
      </select>
      <div class="form-actions">
        <button type="submit" style="margin-right: 10px;" class="btn btn-success">Add Task</button>
        <button type="button" @click="toggleAddTaskForm" class="btn btn-secondary">
          Cancel
        </button>
      </div>
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
        <div class="task" :class="{ completed: task.status === 'completed' }">
          <!-- Task Content -->
          <div class="task-content">
            <div class="task-header">
              <input
                type="checkbox"
                :checked="task.status === 'completed'"
                @change="toggleStatus(task.id)"
                style="transform: scale(2.5); margin-right: 10px; margin-left: 10px; cursor: pointer;"
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
            <button @click="startEdit(task)" title="Edit Task">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deleteTask(task.id)" title="Delete Task">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </li>
    </ul>
    <!-- Edit Form -->
<form v-if="editingTask" @submit.prevent="saveTask" class="edit-form"
style="
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 80%;
    max-width: 400px;"
>
  <h2 class="edit-title">Edit Task</h2>
  <div class="form-group">
    <label for="edit-title">Title</label>
    <input
      id="edit-title"
      v-model="editingTask.title"
      type="text"
      class="form-control"
      placeholder="Task title"
      required
    />
  </div>
  <div class="form-group">
    <label for="edit-description">Description</label>
    <textarea
      id="edit-description"
      v-model="editingTask.description"
      class="form-control"
      placeholder="Task description"
    ></textarea>
  </div>
  <div class="form-group">
    <label for="edit-priority">Priority</label>
    <select
      id="edit-priority"
      v-model="editingTask.priority"
      class="form-control"
    >
      <option value="true">High Priority</option>
      <option value="false">Normal Priority</option>
    </select>
  </div>
  <div class="edit-actions">
    <button type="submit" class="btn btn-success">Save Changes</button>
    <button type="button" @click="cancelEdit" class="btn btn-secondary">
      Cancel
    </button>
  </div>
</form>
  </div>

  
</template>



<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';
const showAddTaskForm = ref(false); 
const tasks = ref([]); // Danh sách công việc
const newTask = ref({
  title: '',
  description: '',
  priority: false,
}); // Công việc mới
const editingTask = ref(null); // Công việc đang được chỉnh sửa
const currentFilter = ref('All'); // Bộ lọc hiện tại
const filters = ['All', 'Pending', 'Completed']; // Bộ lọc

// Lấy danh sách công việc
async function fetchTasks() {
  const isLogin = localStorage.getItem('isLogin');
  if(isLogin == "true"){
    localStorage.setItem('isLogin', false);
    window.location.reload()
  }
  try {
    const response = await api.getUserTasks();
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
    await api.createTask(taskToCreate);
    fetchTasks();
    newTask.value = { title: '', description: '', priority: false }; // Reset form
  } catch (error) {
    console.error('Error adding task:', error.message);
  }
}

// Bắt đầu chỉnh sửa công việc
function startEdit(task) {
  editingTask.value = { ...task }; // Copy công việc để chỉnh sửa
  
}

// Lưu công việc sau khi chỉnh sửa
async function saveTask() {
  try {
    const updatedTask = {
      ...editingTask.value,
      priority: editingTask.value.priority === 'true', // Chuyển thành Boolean
    };
    await api.updateTask(updatedTask.id, updatedTask); // Gửi yêu cầu cập nhật
    fetchTasks(); // Làm mới danh sách công việc
    editingTask.value = null; // Reset trạng thái chỉnh sửa
  } catch (error) {
    console.error('Error saving task:', error.message);
  }
}

// Hủy chỉnh sửa
function cancelEdit() {
  editingTask.value = null; // Reset trạng thái chỉnh sửa
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

// Toggle hiển thị form thêm công việc
function toggleAddTaskForm() {
  showAddTaskForm.value = !showAddTaskForm.value;
}

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
.edit-form {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.edit-title {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
}

.add-task-icon {
  text-align: right;
  margin-bottom: 10px;
}

.todo-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.edit-actions {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.edit-actions .btn {
  padding: 8px 16px;
  font-size: 1rem;
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}



.add-task-button:hover {
  background-color: darkred !important;
}


.add-task-button i {
  font-size: 1.5rem;
}

.add-task-button:hover {
  background-color: darkred;
}

.todo-form {
  margin-top: 20px;
}


</style>
