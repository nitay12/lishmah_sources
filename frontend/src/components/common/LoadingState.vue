<template>
  <div class="flex flex-col items-center justify-center p-10 text-center">
    <div class="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
    <p class="mt-5 text-lg text-gray-600 font-medium">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'טוען...'
  }
});
</script>
