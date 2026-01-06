import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Toast, {POSITION} from "vue-toastification";
import "vue-toastification/dist/index.css";
const options = {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
};

createApp(App).use(store).use(router).use(Toast, options).mount('#app')
