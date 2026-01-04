import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Lazy load views
const HomeView = () => import('../views/HomeView.vue');
const LoginView = () => import('../views/LoginView.vue');
const AdminView = () => import('../views/AdminView.vue');

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'מקורות בקליק - דפי מקורות תורניים' }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'התחברות - מקורות בקליק' }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: {
      title: 'ניהול - מקורות בקליק',
      requiresAuth: true
    },
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();

      if (!authStore.isAuthenticated) {
        // Redirect to login if not authenticated
        next({ name: 'login', query: { redirect: to.fullPath } });
      } else {
        next();
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Update document title on route change
router.afterEach((to) => {
  document.title = to.meta.title || 'מקורות בקליק';
});

export default router;
