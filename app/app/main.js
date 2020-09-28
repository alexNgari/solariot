import 'jquery';
import 'bootstrap';
import 'popper.js';
import Axios from 'axios';
import SocketIO from 'socket.io-client'

import Vue from 'vue';
import VueRouter from 'vue-router';

import store from './store';
import toolbar from './components/toolbar';
import loginPage from './components/loginPage';
import homePage from './components/homePage';
import loadPage from './components/loadPage';
import registerPage from './components/registerPage';
import alert from './components/alert';
import topModal from './components/topModal';

import { empty } from './utils';

Vue.use(VueRouter);

const routes = [
    {
        path: '/login',
        name: 'login',
        component: loginPage,
    },
    {
        path: '/register',
        name: 'register',
        component: registerPage,
    },
    {
        path: '/',
        name: 'home',
        component: homePage,
    },
    {
        path: '/s',
        name: 'wait',
        component: loadPage,
    },
];

const router = new VueRouter({
    mode: 'history',
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        return { x: 0, y: 0 };
    },
});

(() => new Vue({
    el: '#app',
    data() {
        return {
            shared: store,
        };
    },
    render() {
        return <div>
            {this.$data.shared.toolbar.visible
                ? <toolbar></toolbar>
                : ''}
            <div class="container">
                <router-view></router-view>
            </div>
            <footer class="my-5 pt-5 text-muted text-center text-small">
                <p class="mb-1">© 2019 Company
                </p>
                <ul class="list-inline">
                    <li class="list-inline-item"><a href="#">Privacy</a></li>
                    <li class="list-inline-item"><a href="#">Terms</a></li>
                    <li class="list-inline-item"><a href="#">Support</a></li>
                </ul>
            </footer>
            <alert></alert>
            <topModal></topModal>
        </div>;
    },
    router,
    components: {
        toolbar,
        alert,
        topModal,
    },
    created() {
        store.socketio = SocketIO()

        Axios.defaults.headers.common['X-REQUESTED-WITH'] = 'XMLHttpRequest';
        Axios.defaults.baseURL = '/api';

        store.socketio.on('connect', () => {
            console.log('connected');
        })

        store.socketio.on('error', (error) => {
            console.log('socketio error: ' + error);
        })
        store.socketio.on('disconnect', (reason) => {
            console.log('socketio disconnect:' + reason);
        })

        setInterval(() => {
            store.socketio.emit('update_stats', JSON.stringify({cID: 'ax'}), (resp) => {
                console.log(resp);
                const data = JSON.parse(resp);
                console.log(data);
                store.updateStats(data.message);
            })
        }, 10000)

        // const csrf = $('#app.CSRF').value;
        const csrf = document.getElementById('app.CSRF').value;
        if (csrf !== null || csrf !== undefined) {
            console.log(`csrf: ${csrf}`);
            Axios.defaults.headers.common['X-CSRF-Token'] = csrf;
        }

        // attempt sign in
        if (!store.auth.isAuth) {
            let { path } = this.$route;
            console.log(`path: ${path}`);

            this.$router.push({ name: 'wait' });
            Axios
                .get('/auth/remember')
                .then((response) => {
                    console.log(`status: ${response.status}, response: ${response.data} `);
                    if (empty(response.data.username)) {
                        const err = { data: 'done' };
                        throw err;
                    }
                    store.setAuth(true, response.data);
                    if (path === '/login' || path === '/register') path = '/';
                    this.$router.replace(path);
                })
                .catch((err) => {
                    console.log(`err: ${err}`);
                    if (path === '/register') this.$router.replace('/register');
                    else this.$router.replace('/login');
                });
        }
    },
}))();
