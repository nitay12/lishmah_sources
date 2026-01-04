import { defineStore } from 'pinia';
import { authAPI } from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_token') || null,
    username: localStorage.getItem('username') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await authAPI.login({ username, password });

        // Store token and username
        this.token = data.token;
        this.username = data.username;

        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('username', data.username);

        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'ההתחברות נכשלה';
        console.error('Login error:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      // Clear state
      this.token = null;
      this.username = null;

      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('username');
    }
  }
});
