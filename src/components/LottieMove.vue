<template>
  <div ref="container" class="w-40 h-40 mx-auto"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import lottie from "lottie-web";
import animationData from "../assets/move.json"; // make sure the path is correct

const container = ref(null);

onMounted(() => {
  lottie.loadAnimation({
    container: container.value,
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData,
  });
});
</script>
