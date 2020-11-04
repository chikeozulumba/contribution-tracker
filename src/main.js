import Vue from 'vue';
import VCalendar from 'v-calendar';
import notie from 'notie';
import chartjs from 'chart.js';
import 'notie/dist/notie.min.css';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { auth } from './utils/firebase';

window.notie = notie;
window.ChartJS = chartjs;

Vue.config.productionTip = false;
Vue.use(VCalendar);

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount('#app');
  }
});
