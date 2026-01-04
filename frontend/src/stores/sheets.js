import { defineStore } from 'pinia';
import { sheetsAPI } from '../services/api';

export const useSheetsStore = defineStore('sheets', {
  state: () => ({
    sheets: [],
    loading: false,
    error: null,
    filters: {
      categoryId: null,
      sortBy: 'newest' // 'newest' or 'popular'
    }
  }),

  getters: {
    filteredSheets: (state) => {
      let result = state.sheets;

      // Filter by category if specified
      if (state.filters.categoryId) {
        result = result.filter(
          (sheet) => sheet.category_id === state.filters.categoryId
        );
      }

      return result;
    }
  },

  actions: {
    async fetchSheets() {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await sheetsAPI.getAll({
          category: this.filters.categoryId,
          sort: this.filters.sortBy
        });

        this.sheets = data;
      } catch (error) {
        this.error = error.response?.data?.message || 'שגיאה בטעינת דפי המקורות';
        console.error('Error fetching sheets:', error);
      } finally {
        this.loading = false;
      }
    },

    async downloadSheet(id) {
      try {
        const { data } = await sheetsAPI.download(id);

        // Open PDF in new tab
        window.open(data.fileUrl, '_blank');

        // Update local download count
        const sheet = this.sheets.find((s) => s.id === id);
        if (sheet) {
          sheet.download_count = data.downloadCount;
        }

        return true;
      } catch (error) {
        console.error('Download error:', error);
        throw error;
      }
    },

    async createSheet(formData) {
      try {
        const { data } = await sheetsAPI.create(formData);

        // Add new sheet to the list
        this.sheets.unshift(data.sheet);

        return true;
      } catch (error) {
        console.error('Create sheet error:', error);
        throw error;
      }
    },

    async deleteSheet(id) {
      try {
        await sheetsAPI.delete(id);

        // Remove from list
        this.sheets = this.sheets.filter((s) => s.id !== id);

        return true;
      } catch (error) {
        console.error('Delete sheet error:', error);
        throw error;
      }
    },

    setFilter(key, value) {
      this.filters[key] = value;
      this.fetchSheets();
    },

    clearFilters() {
      this.filters.categoryId = null;
      this.filters.sortBy = 'newest';
      this.fetchSheets();
    }
  }
});
