<script setup>
import { ref } from "vue";

const config = useRuntimeConfig();

const form = ref({
  name: "",
  age: "",
  alcohol: "",
  vat: "",
  distillery: "",
});

const imageFile = ref(null);
const imagePreview = ref(null);
const loading = ref(false);
const error = ref(null);
const success = ref(false);

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

const submitForm = async () => {
  error.value = null;
  success.value = false;
  loading.value = true;

  try {
    const formData = new FormData();

    formData.append("name", form.value.name);
    formData.append("age", form.value.age);
    formData.append("alcohol", form.value.alcohol);
    formData.append("vat", form.value.vat);
    formData.append("distillery", form.value.distillery);

    if (imageFile.value) {
      formData.append("image", imageFile.value);
    }

    await $fetch("http://localhost:8000/api/whiskies", {
      method: "POST",
      body: formData,
    });

    success.value = true;

    // Reset form
    form.value = {
      name: "",
      age: "",
      alcohol: "",
      vat: "",
      distillery: "",
    };
    imageFile.value = null;
    imagePreview.value = null;
  } catch (err) {
    error.value = err.data?.message || "Something went wrong";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto py-16 px-6">
    <h1 class="text-3xl font-bold mb-8">Add New Whisky</h1>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Name -->
      <div>
        <label class="block mb-2 font-medium text-gold">Name</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
      </div>

      <!-- Age -->
      <div>
        <label class="block mb-2 font-medium text-gold">Age</label>
        <input
          v-model="form.age"
          type="number"
          class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
      </div>

      <!-- Alcohol -->
      <div>
        <label class="block mb-2 font-medium text-gold">Alcohol %</label>
        <input
          v-model="form.alcohol"
          type="number"
          step="0.1"
          class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
      </div>

      <!-- Vat -->
      <div>
        <label class="block mb-2 font-medium text-gold">Vat</label>
        <input
          v-model="form.vat"
          type="text"
          class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
      </div>

      <!-- Distillery -->
      <div>
        <label class="block mb-2 font-medium text-gold">Distillery</label>
        <input
          v-model="form.distillery"
          type="text"
          class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
      </div>

      <!-- Image Upload -->
      <div>
        <label class="block mb-2 font-medium text-gold">Image</label>

        <input
          type="file"
          accept="image/*"
          @change="handleImageChange"
          class="w-full"
        />

        <!-- Preview -->
        <div v-if="imagePreview" class="mt-4">
          <img
            :src="imagePreview"
            class="h-64 object-cover rounded-lg border"
          />
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-100 text-red-700 p-3 rounded">
        {{ error }}
      </div>

      <!-- Success -->
      <div v-if="success" class="bg-green-100 text-green-700 p-3 rounded">
        Whisky created successfully!
      </div>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
      >
        <span v-if="loading">Saving...</span>
        <span v-else>Save Whisky</span>
      </button>
    </form>
  </div>
</template>
