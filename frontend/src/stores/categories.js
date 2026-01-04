import { defineStore } from 'pinia';
import { categoriesAPI } from '../services/api';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await categoriesAPI.getAll();
        this.categories = data;
      } catch (error) {
        this.error = error.response?.data?.message || 'שגיאה בטעינת הקטגוריות';
        console.error('Error fetching categories:', error);
      } finally {
        this.loading = false;
      }
    },

    async createCategory(name) {
      try {
        const { data } = await categoriesAPI.create(name);

        // Add new category to the list
        this.categories.push(data.category);

        return true;
      } catch (error) {
        console.error('Create category error:', error);
        throw error;
      }
    },

    async deleteCategory(id) {
      try {
        await categoriesAPI.delete(id);

        // Remove from list
        this.categories = this.categories.filter((c) => c.id !== id);

        return true;
      } catch (error) {
        console.error('Delete category error:', error);
        throw error;
      }
    }
  }
});
