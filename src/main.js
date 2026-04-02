import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "./router/guards";

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import '@/assets/styles/index.css'
import SvgIcon from '@/components/SvgIcon/index.vue'
import 'virtual:svg-icons-register'
import directive from './directive/index.js'

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('SvgIcon', SvgIcon)
app.use(ElementPlus, {
  locale: zhCn
})

app.use(createPinia());
app.use(router);

directive(app)

app.mount("#app");
