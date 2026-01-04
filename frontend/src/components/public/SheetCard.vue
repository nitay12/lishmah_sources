<template>
  <div class="sheet-card">
    <div class="sheet-header">
      <span class="pdf-icon">📄</span>
      <h3 class="sheet-title">{{ sheet.title }}</h3>
    </div>

    <div class="sheet-meta">
      <span v-if="sheet.category_name" class="category">
        {{ sheet.category_name }}
      </span>
      <span class="date">{{ formatDate(sheet.created_at) }}</span>
    </div>

    <div class="sheet-footer">
      <button
        @click="handleDownload"
        class="download-btn"
        :disabled="downloading"
      >
        {{ downloading ? 'מוריד...' : 'הורד' }}
      </button>
      <span class="download-count">
        👁️ {{ sheet.download_count }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSheetsStore } from '@/stores/sheets';

const props = defineProps({
  sheet: {
    type: Object,
    required: true
  }
});

const sheetsStore = useSheetsStore();
const downloading = ref(false);

const handleDownload = async () => {
  downloading.value = true;
  try {
    await sheetsStore.downloadSheet(props.sheet.id);
  } catch (error) {
    alert('ההורדה נכשלה. אנא נסה שוב.');
  } finally {
    downloading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<style scoped>
.sheet-card {
  @apply bg-white border border-gray-200 rounded-xl p-5 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg;
}

.sheet-header {
  @apply flex items-start gap-3 mb-3;
}

.pdf-icon {
  @apply text-3xl shrink-0;
}

.sheet-title {
  @apply m-0 text-xl font-semibold text-gray-800 leading-snug;
}

.sheet-meta {
  @apply flex gap-3 mb-4 text-sm text-gray-600;
}

.category {
  @apply bg-gray-100 px-3 py-1 rounded-full font-medium;
}

.date {
  @apply py-1;
}

.sheet-footer {
  @apply flex justify-between items-center;
}

.download-btn {
  @apply bg-green-500 text-white border-none px-6 py-2.5 rounded-lg text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed;
}

.download-count {
  @apply flex items-center gap-1 text-base text-gray-600 font-medium;
}

/* Mobile responsive */
@media (max-width: 480px) {
  .sheet-card {
    @apply p-4;
  }

  .sheet-title {
    @apply text-lg;
  }

  .download-btn {
    @apply px-5 py-2 text-sm;
  }
}
</style>
