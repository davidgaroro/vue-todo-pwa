<template>
  <main class="container">
    <router-view />
  </main>
  <Footer />
</template>

<script>
import Footer from "@/components/Footer.vue";

export default {
  components: {
    Footer,
  },
};
</script>

<style lang="scss">
.container {
  max-width: 420px;
}
</style>
