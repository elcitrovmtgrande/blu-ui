import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUserSecret, faMicrophone, faMicrophoneSlash,
  faVideo, faVideoSlash, faCommentAlt, faTimes,
  faPhoneAlt,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VTooltip from 'v-tooltip';
import VueSocketIO from 'vue-socket.io';
import config from '@/config';
import App from './App.vue';
import store from './store';
import router from './router';

library.add(
  faUserSecret, faMicrophone, faMicrophoneSlash,
  faVideoSlash, faVideo, faCommentAlt, faTimes,
  faPhoneAlt, faPaperPlane,
);

Vue.component('fa', FontAwesomeIcon);

Vue.use(VTooltip);

Vue.use(new VueSocketIO({
  debug: true,
  // connection: 'http://metinseylan.com:1992',
  connection: config.socketAddress,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
  // options: { path: '/room' }, // Optional options
}));

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
