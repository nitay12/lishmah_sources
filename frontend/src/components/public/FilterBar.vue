<template>
  <div class="filter-bar">
    <div class="categories-section">
      <h3>קטגוריות:</h3>
      <div class="category-chips">
        <button
          class="category-chip"
          :class="{ active: selectedCategory === null }"
          @click="selectCategory(null)"
        >
          הכל
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          class="category-chip"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
          <span class="count">({{ category.sheet_count }})</span>
        </button>
      </div>
    </div>

    <div class="sort-section">
      <h3>מיון:</h3>
      <div class="sort-buttons">
        <button
          class="sort-btn"
          :class="{ active: sortBy === 'newest' }"
          @click="setSortBy('newest')"
        >
          החדש ביותר
        </button>
        <button
          class="sort-btn"
          :class="{ active: sortBy === 'popular' }"
          @click="setSortBy('popular')"
        >
          הכי פופולרי
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSheetsStore } from '@/stores/sheets';
import { useCategoriesStore } from '@/stores/categories';

const sheetsStore = useSheetsStore();
const categoriesStore = useCategoriesStore();

const categories = computed(() => categoriesStore.categories);
const selectedCategory = computed(() => sheetsStore.filters.categoryId);
const sortBy = computed(() => sheetsStore.filters.sortBy);

const selectCategory = (categoryId) => {
  sheetsStore.setFilter('categoryId', categoryId);
};

const setSortBy = (sort) => {
  sheetsStore.setFilter('sortBy', sort);
};
</script>

<style scoped>
.filter-bar {
  @apply bg-white p-5 rounded-xl shadow-md mb-6;
}

.categories-section,
.sort-section {
  @apply mb-5 last:mb-0;
}

h3 {
  @apply m-0 mb-3 text-base font-semibold text-gray-800;
}

.category-chips {
  @apply flex gap-2 flex-wrap;
}

.category-chip {
  @apply bg-gray-100 border-2 border-transparent px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-gray-200;
}

.category-chip.active {
  @apply bg-green-500 text-white border-green-500;
}

.count {
  @apply text-xs opacity-80 mr-1;
}

.sort-buttons {
  @apply flex gap-2;
}

.sort-btn {
  @apply bg-gray-100 border-2 border-transparent px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-200;
}

.sort-btn.active {
  @apply bg-blue-500 text-white border-blue-500;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .filter-bar {
    @apply p-4;
  }

  .category-chips {
    @apply overflow-x-auto flex-nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .category-chips::-webkit-scrollbar {
    display: none;
  }

  .sort-buttons {
    @apply w-full;
  }

  .sort-btn {
    @apply flex-1;
  }
}
</style>
