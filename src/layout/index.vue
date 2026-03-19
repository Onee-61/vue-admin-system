<script setup>

</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <header>后台管理系统</header>
      <nav>
        <ul>
          <li><router-link to="/index">首页</router-link></li>
          <li><router-link to="/">用户管理</router-link></li>
          <li><router-link to="/">角色管理</router-link></li>
          <li><router-link to="/">权限管理</router-link></li>
        </ul>
      </nav>
    </aside>
    <div class="content-wrapper">
      <header>
        <h1>欢迎来到后台管理系统</h1>
      </header>
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

header {
  background-color: #333;
  color: white;
  padding: 10px 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.sidebar {
  width: 200px;
  background-color: #f4f4f4;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
}

.sidebar nav ul li {
  margin-bottom: 10px;
}

.sidebar nav ul li a {
  text-decoration: none;
  color: #333;
  display: block;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.sidebar nav ul li a:hover {
  background-color: #e0e0e0;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>