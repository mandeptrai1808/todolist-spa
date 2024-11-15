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
        component: () => import('@/views/Home.vue'), // Trang Home (sẽ thêm sau)
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
      
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});


// Middleware kiểm tra xác thực
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token'); // Kiểm tra token
    if (to.name !== 'login' && !isAuthenticated) {
        next('/'); 
    } else {
        next(); 
    }
});

export default router;
