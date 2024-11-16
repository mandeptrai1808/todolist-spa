import { createWebHistory, createRouter } from 'vue-router';
import Login from '@/views/Login.vue'; // Trang Login

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login, // Trang Login mặc định
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/Register.vue'), // Trang Đăng ký
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('@/views/Admin.vue'), // Trang Admin
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home.vue'), // Trang Home
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: () => import('@/views/NotFound.vue'), // Trang không tìm thấy
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/Profile.vue'),
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('@/views/AboutUs.vue'), // Thêm đường dẫn tới AboutUs.vue
      }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// Middleware kiểm tra xác thực
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Kiểm tra token

    // Các route không yêu cầu xác thực
    const publicPages = ['login', 'register', 'notfound'];
    
    if (!publicPages.includes(to.name) && !isAuthenticated) {
        next('/'); // Chuyển hướng về login nếu chưa đăng nhập
    } else {
        next(); // Cho phép tiếp tục
    }
});

export default router;
