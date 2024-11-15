/**
 * Helper function to fetch data with error handling
 * @param {string} url - The URL to fetch
 * @param {RequestInit} options - Additional fetch options
 * @returns {Promise<any>} - Parsed JSON response
 * 
 */
import { eventBus, userState } from '@/eventBus';

async function efetch(url, options = {}) {
  let result = {};
  let json = {};
  try {
    result = await fetch(url, options); 
    json = await result.json();
    console.log(json)
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
  
  if (!result.ok) {
    throw new Error(json.message || 'Error fetching data');
  } else console.log("error here")
  console.log('Parsed JSON Response:', json.data);
  if (json.user) return json.user
  return json.data;
}

/**
 * API Service to interact with the backend
 */
function makeApiService() {
  const baseUrl = 'http://localhost:3000/api'; // Ensure this matches your backend URL

  /**
   * Login user and get a token
   * @param {Object} credentials - User credentials (email and password)
   * @returns {Promise<any>} - Login response with token
   */
  async function login(credentials) {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
  
    const { token } = await response.json();
  
    // Lưu token vào localStorage
    localStorage.setItem('token', token);
  
    // Gọi getUserInfo để lấy thông tin người dùng
    const userInfo = await getUserInfo(token);
    console.log(userInfo)
    // Lưu thông tin người dùng vào localStorage
    localStorage.setItem('user', JSON.stringify(userInfo));
  // Cập nhật userState
  userState.user = userInfo;

  // Phát sự kiện để cập nhật giao diện
  eventBus.emit('user-updated', userInfo);
    return userInfo;
  }
  

  /**
   * Register a new user
   * @param {Object} user - New user data (username, email, password)
   * @returns {Promise<any>} - Registration response
   */
  async function register(user) {
    const url = `${baseUrl}/auth/register`;
    return efetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
  }

  /**
   * Get information about the logged-in user
   * @param {string} token - Authorization token
   * @returns {Promise<any>} - User information
   */
  async function getUserInfo(token) {
    const url = `${baseUrl}/auth/me`;
    return efetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  /**
   * Logout the user (optional server logout if implemented)
   * @returns {Promise<void>}
   */
  async function logout() {
    localStorage.removeItem('token'); // Remove token from localStorage
    console.log('User logged out');
  }

  /**
   * Update user information (Admin only)
   * @param {string} userId - ID of the user to update
   * @param {Object} updatedData - Updated user data (username, email, role, etc.)
   * @param {string} token - Authorization token
   * @returns {Promise<any>} - Updated user information
   */
  async function updateUser(userId, updatedData, token) {
    const url = `${baseUrl}/auth/admin/users/${userId}`;
    return efetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
  }

  /**
   * Get a list of all users (Admin only)
   * @param {string} token - Authorization token
   * @returns {Promise<any>} - List of users
   */
  async function getAllUsers(token) {
    const url = `${baseUrl}/auth/admin/users`;
    return efetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  /**
   * Delete a user by ID (Admin only)
   * @param {string} userId - ID of the user to delete
   * @param {string} token - Authorization token
   * @returns {Promise<any>} - Delete confirmation
   */
  async function deleteUser(userId, token) {
    const url = `${baseUrl}/auth/admin/users/${userId}`;
    return efetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  return {
    login,
    register,
    getUserInfo,
    logout,
    updateUser,
    getAllUsers,
    deleteUser,
  };
}

export default makeApiService();
