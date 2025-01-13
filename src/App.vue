<template>
  <div class="flex flex-col min-h-screen w-full bg-f6f6f6">
    <Header />
    <div class="flex-grow">
      <router-view></router-view>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style>
body {
  font-family: 'Nunito', sans-serif; /* 使用清新的字体 */
  background-color: #f6f6f6; /* 使用柔和的背景色 */
  color: #8785a2; /* 使用深灰色字体，增加可读性 */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

a {
  color: #8785a2; /* 使用清新的蓝色作为链接颜色 */
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>