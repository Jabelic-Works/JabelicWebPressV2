<script lang="ts" setup></script>
<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium text-gray-900">Callout</h3>
      <p class="mt-1">
        This is a callout component. It's a simple box to draw attention to
        something.
      </p>
    </div>
  </div>
</template>
<style scoped>
.bg-white {
  background-color: #fff;
}
.shadow {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.overflow-hidden {
  overflow: hidden;
}
.sm\:rounded-lg {
  border-radius: 0.5rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.py-5 {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}
.sm\:px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.text-lg {
  font-size: 1.125rem;
}
.font-medium {
  font-weight: 500;
}
.text-gray-900 {
  color: #1a202c;
}
</style>
