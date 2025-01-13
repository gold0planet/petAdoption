<template>
    <footer class="footer bg-white text-gray-700 py-6">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div class="footer-links flex space-x-4">
          <a href="#" class="hover:underline">关于我们</a>
          <a href="#" class="hover:underline">隐私政策</a>
          <a href="#" class="hover:underline">服务条款</a>
          <a href="#" class="hover:underline">联系我们</a>
        </div>
        <div class="social-links flex space-x-4 mt-4 md:mt-0">
          <a href="#" class="hover:underline"><i class="fab fa-weixin"></i></a>
          <a href="#" class="hover:underline"><i class="fab fa-weibo"></i></a>
          <a href="#" class="hover:underline"><i class="fab fa-bilibili"></i></a>
          <a href="#" class="hover:underline"><i class="fab fa-xiaohongshu"></i></a>
        </div>
      </div>
      <div class="text-center text-sm mt-4">
        © 2024 流浪动物领养平台. 保留所有权利.
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'Footer'
  }
  </script>
  
  <style scoped>
  .footer {
    background-color: #ffffff; /* 白色背景 */
    color: #4a4a4a; /* 深灰色字体 */
  }
  
  .footer-links a,
  .social-links a {
    color: #4a4a4a;
    text-decoration: none;
  }
  
  .footer-links a:hover,
  .social-links a:hover {
    text-decoration: underline; /* 悬停时添加下划线 */
  }
  
  .social-links i {
    font-size: 1.5rem; /* 调整图标大小 */
  }
  </style>