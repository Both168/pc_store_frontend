<template>
  <div class="min-h-screen relative" style="background-color: #e0e5ec;">
    <Navbar />
    <div class="pt-20 px-4 sm:px-6 lg:px-8 py-12">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-[#5a6c7d] mb-4">
          VR Page: VR
        </h1>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'
</script>

