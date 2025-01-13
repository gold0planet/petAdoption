<template>
    <div class="banner">
      <img src="/banner.gif" alt="Banner" class="w-full h-auto" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'Banner'
  }
  </script>
  
  <style scoped>
  .banner {
    width: 75%;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    display: block;
    line-height: 0;
  }

  .banner img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
    margin: 0;
    padding: 0;
  }
  </style>