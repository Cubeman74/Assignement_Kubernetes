<!------------------------------------------------------------>
<!------------- /> Kuber_ Tasks (Front v1.0) ----------------->
<!------------- /> By: Yanis Bellahcene ---------------------->
<!------------------------------------------------------------>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <h1>/> Kuber_ Tasks</h1>
  </header>
  <RouterView />
  <footer>
    <p>© 2023 - Yanis Bellahcene</p>
  </footer>
</template>

<style scoped>
header {
  text-align: center;
  background-color: greenyellow;
  padding: 10px;
}

footer {
  position: fixed;
  bottom: 0;
  text-align: center;
  background-color: black;
  color: greenyellow;
  padding: 10px;
  border-radius: 0 20px 0 0 ;
  font-size: 1.5em;
}
</style>
