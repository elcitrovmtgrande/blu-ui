import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUserSecret, faMicrophone, faMicrophoneSlash,
  faVideo, faVideoSlash, faCommentAlt, faTimes,
  faPhoneAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VTooltip from 'v-tooltip';
import App from './App.vue';
import store from './store';
import router from './router';

library.add(
  faUserSecret, faMicrophone, faMicrophoneSlash,
  faVideoSlash, faVideo, faCommentAlt, faTimes,
  faPhoneAlt,
);

Vue.component('fa', FontAwesomeIcon);

Vue.use(VTooltip);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
