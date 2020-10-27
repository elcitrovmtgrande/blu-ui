import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
// import Room from '../views/Room.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/room/:roomId',
    name: 'Room',
    component: () => import(/* webpackChunkName: "room" */ '../views/Room.vue'),
    // component: Room,
  },
  {
    path: '/waiting-room',
    name: 'WaitingRoom',
    component: () => import(/* webpackChunkName: "waitingRoom" */ '../views/WaitingRoom.vue'),
    // component: Room,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
