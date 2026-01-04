<template>
  <div class="admin-view">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">לוח ניהול 🔧</h1>
            <p class="text-gray-600 mt-1">שלום, {{ authStore.username }}</p>
          </div>
          <div class="flex gap-3">
            <router-link
              to="/"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              לדף הבית
            </router-link>
            <button
              @click="handleLogout"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              התנתק
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 pb-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Upload Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">העלאת דף מקורות חדש</h2>

            <form @submit.prevent="handleUpload" class="space-y-4">
              <!-- Title -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                  כותרת
                </label>
                <input
                  id="title"
                  v-model="newSheet.title"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="לדוגמה: פרשת בראשית - יום ראשון"
                />
              </div>

              <!-- Category -->
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                  קטגוריה
                </label>
                <select
                  id="category"
                  v-model="newSheet.category_id"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option :value="null">ללא קטגוריה</option>
                  <option
                    v-for="category in categoriesStore.categories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- File Upload -->
              <div>
                <label for="file" class="block text-sm font-medium text-gray-700 mb-2">
                  קובץ PDF
                </label>
                <input
                  id="file"
                  type="file"
                  accept=".pdf,application/pdf"
                  required
                  @change="handleFileSelect"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p v-if="selectedFile" class="mt-2 text-sm text-gray-600">
                  נבחר: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
                </p>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="uploading"
                class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ uploading ? 'מעלה...' : 'העלה דף מקורות' }}
              </button>

              <!-- Success/Error Messages -->
              <div v-if="uploadMessage" :class="{
                'bg-green-50 border-green-200 text-green-700': uploadSuccess,
                'bg-red-50 border-red-200 text-red-700': !uploadSuccess
              }" class="border rounded-lg p-3">
                <p class="text-sm text-center">{{ uploadMessage }}</p>
              </div>
            </form>
          </div>
        </div>

        <!-- Category Management -->
        <div>
          <div class="bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">ניהול קטגוריות</h2>

            <!-- Add Category Form -->
            <form @submit.prevent="handleAddCategory" class="mb-6">
              <div class="flex gap-2">
                <input
                  v-model="newCategoryName"
                  type="text"
                  placeholder="שם קטגוריה חדשה"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  הוסף
                </button>
              </div>
            </form>

            <!-- Categories List -->
            <div class="space-y-2">
              <div
                v-for="category in categoriesStore.categories"
                :key="category.id"
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <span class="font-medium text-gray-800">{{ category.name }}</span>
                  <span class="text-xs text-gray-500 mr-2">({{ category.sheet_count }})</span>
                </div>
                <button
                  @click="handleDeleteCategory(category.id)"
                  class="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  מחק
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sheets List -->
      <div class="mt-6 bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">דפי מקורות קיימים</h2>

        <div v-if="sheetsStore.loading" class="text-center py-8">
          <p class="text-gray-500">טוען...</p>
        </div>

        <div v-else-if="sheetsStore.sheets.length === 0" class="text-center py-8">
          <p class="text-gray-500">אין עדיין דפי מקורות</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">כותרת</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">קטגוריה</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">הורדות</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">תאריך</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">פעולות</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="sheet in sheetsStore.sheets" :key="sheet.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm">{{ sheet.title }}</td>
                <td class="px-4 py-3 text-sm">{{ sheet.category_name || '-' }}</td>
                <td class="px-4 py-3 text-sm">{{ sheet.download_count }}</td>
                <td class="px-4 py-3 text-sm">{{ formatDate(sheet.created_at) }}</td>
                <td class="px-4 py-3 text-sm">
                  <button
                    @click="handleDeleteSheet(sheet.id, sheet.title)"
                    class="text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    מחק
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useSheetsStore } from '@/stores/sheets';
import { useCategoriesStore } from '@/stores/categories';

const router = useRouter();
const authStore = useAuthStore();
const sheetsStore = useSheetsStore();
const categoriesStore = useCategoriesStore();

// Upload form
const newSheet = ref({
  title: '',
  category_id: null
});
const selectedFile = ref(null);
const uploading = ref(false);
const uploadMessage = ref('');
const uploadSuccess = ref(false);

// Category form
const newCategoryName = ref('');

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0];
};

const handleUpload = async () => {
  if (!selectedFile.value) {
    uploadMessage.value = 'נא לבחור קובץ PDF';
    uploadSuccess.value = false;
    return;
  }

  uploading.value = true;
  uploadMessage.value = '';

  try {
    const formData = new FormData();
    formData.append('title', newSheet.value.title);
    formData.append('category_id', newSheet.value.category_id || '');
    formData.append('file', selectedFile.value);

    await sheetsStore.createSheet(formData);

    uploadMessage.value = 'דף המקורות הועלה בהצלחה!';
    uploadSuccess.value = true;

    // Reset form
    newSheet.value = { title: '', category_id: null };
    selectedFile.value = null;
    document.getElementById('file').value = '';
  } catch (error) {
    uploadMessage.value = error.response?.data?.message || 'העלאה נכשלה';
    uploadSuccess.value = false;
  } finally {
    uploading.value = false;
  }
};

const handleAddCategory = async () => {
  if (!newCategoryName.value.trim()) return;

  try {
    await categoriesStore.createCategory(newCategoryName.value.trim());
    newCategoryName.value = '';
  } catch (error) {
    alert(error.response?.data?.message || 'הוספת קטגוריה נכשלה');
  }
};

const handleDeleteCategory = async (id) => {
  if (!confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו?')) return;

  try {
    await categoriesStore.deleteCategory(id);
  } catch (error) {
    alert(error.response?.data?.message || 'מחיקת קטגוריה נכשלה');
  }
};

const handleDeleteSheet = async (id, title) => {
  if (!confirm(`האם אתה בטוח שברצונך למחוק את "${title}"?`)) return;

  try {
    await sheetsStore.deleteSheet(id);
  } catch (error) {
    alert(error.response?.data?.message || 'מחיקה נכשלה');
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('he-IL');
};

onMounted(async () => {
  await Promise.all([
    sheetsStore.fetchSheets(),
    categoriesStore.fetchCategories()
  ]);
});
</script>

<style scoped>
.admin-view {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
