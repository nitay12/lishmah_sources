<template>
  <div class="home-view">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-800">מקורות - לשמה</h1>
          <router-link
            to="/login"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            התחברות
          </router-link>
        </div>
        <p class="text-gray-600 mt-2">דפי מקורות תורניים מאת הרב בנימין טבדי</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 pb-8">
      <!-- Filters -->
      <FilterBar />

      <!-- Loading State -->
      <LoadingState
        v-if="sheetsStore.loading"
        message="טוען נתונים"
      />

      <!-- Error State -->
      <div v-else-if="sheetsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-700 font-medium">{{ sheetsStore.error }}</p>
        <button
          @click="loadData"
          class="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          נסה שוב
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="sheets.length === 0"
        class="text-center py-12"
      >
        <p class="text-xl text-gray-500">😔 אין עדיין דפי מקורות</p>
        <p class="text-gray-400 mt-2">חזור מאוחר יותר</p>
      </div>

      <!-- Sheets Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SheetCard
          v-for="sheet in sheets"
          :key="sheet.id"
          :sheet="sheet"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useSheetsStore } from '@/stores/sheets';
import { useCategoriesStore } from '@/stores/categories';
import SheetCard from '@/components/public/SheetCard.vue';
import FilterBar from '@/components/public/FilterBar.vue';
import LoadingState from '@/components/common/LoadingState.vue';

const sheetsStore = useSheetsStore();
const categoriesStore = useCategoriesStore();

const sheets = computed(() => sheetsStore.filteredSheets);

const loadData = async () => {
  await Promise.all([
    sheetsStore.fetchSheets(),
    categoriesStore.fetchCategories()
  ]);
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
