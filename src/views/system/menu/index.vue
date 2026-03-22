<script setup>
import { useRouteStore } from '@/stores/modules/route'
import { onMounted } from 'vue';

const routeStore = useRouteStore()
routeStore.getRoutes()
// onMounted(() => {
//   routeStore.getRoutes()
// })
</script>

<template>
  <h1>菜单管理</h1>
  <div v-for="item in routeStore.routes" class="route">
    <div><span>name:</span>{{ item.name }}</div>
    <div><span>path:</span>{{ item.path }}</div>
    <div><span>hidden:</span>{{ item.hidden }}</div>
    <div><span>redirect:</span>{{ item.redirect }}</div>
    <div><span>component:</span>{{ item.component }}</div>
    <div><span>alwaysShow:</span>{{ item.alwaysShow }}</div>
    <div><span>meta:</span>{{ item.meta }}</div>
    <div><span>children:</span>{{ item.children }} </div>
    <br>
  </div>
  <!-- "name": "System",
      "path": "/system",
      "hidden": false,
      "redirect": "noRedirect",
      "component": "Layout",
      "alwaysShow": true,
      "meta": {
        "title": "系统管理",
        "icon": "system",
        "noCache": false
      }, -->
</template>

<style>
.route span {
  color: red;
}
</style>