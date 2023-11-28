<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <h1>/> Kuber_ Tasks</h1>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  text-align: center;
  background-color: greenyellow;
  padding: 10px;
}

</style>
