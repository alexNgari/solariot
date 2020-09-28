import Axios from 'axios';
import store from '../store';
import { empty, uppercase, load } from '../utils';

export default {
    data() {
        return {
            registering: false,
            remember: true,
            e: {
                un: '', pwd: '', re_pwd: '',
            },
            s: {},
        };
    },
    render() {
        return <div>
            <div class="py-5 text-center">
                <img class="d-block mx-auto mb-4" src="/assets/img/ujuzi_icon_128.png" alt="" width="72" height="72" />
                <h3>Create an Account</h3>
            </div>

            <div class="row">
                <div class="col-md-4 mr-auto ml-auto">
                    <h4 class="mb-3">Credentials</h4>
                    <form class="needs-validation" novalidate="">
                        <div class="mb-3">
                            <label for="username">Username</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">@</span>
                                </div>
                                <input type="text" class={`form-control ${empty(this.$data.e.un) ? '' : 'is-invalid'}`}
                                    id="username" placeholder="Username"
                                    onInput={e => this.onUpdate(e, this.checkUsername)} />
                                <div class="invalid-feedback" style="width: 100%;">
                                    {this.$data.e.un}
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="password">Password</label>
                            <input type="password" class={`form-control ${empty(this.$data.e.pwd) ? '' : 'is-invalid'}`}
                                id="password" placeholder="Password"
                                onInput={this.onUpdate} />
                            <div class="invalid-feedback">
                                {this.$data.e.pwd}
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="re_password">Retype Password</label>
                            <input type="password" class={`form-control ${empty(this.$data.e.re_pwd) ? '' : 'is-invalid'}`}
                                id="re_password" placeholder="Password"
                                onInput={this.onUpdate} />
                            <div class="invalid-feedback">
                                {this.$data.e.re_pwd}
                            </div>
                        </div>

                        <div class="custom-control custom-checkbox mb-3">
                            <input type="checkbox" class="custom-control-input" id="remember"
                                checked={this.$data.remember}
                                on-click={this.onUpdate} />
                            <label class="custom-control-label" for="remember">Remember me</label>
                        </div>

                        <div class={`btn btn-primary btn-lg btn-block mb-3 d-flex justify-content-center align-items-center ${this.$data.registering ? 'loading' : ''}`}
                            id="registering" on-click={e => load.bind(this)(e, this.onRegister)}>
                            <span>Register</span>
                            <div class="loader ml-2"></div>
                        </div>

                        <div class="text-center mb-3">
                            OR
                        </div>

                        <router-link to="/login">
                            <div class="btn btn-light btn-block">Sign in to my account</div>
                        </router-link>
                    </form>
                </div>
            </div>

        </div >;
    },
    beforeCreate() {
        store.showToolbar(false);
    },

    methods: {
        /**
         * @param {Event} e
         * @param {Function} then
         */
        onUpdate(e, then = null) {
            const { id, value } = e.target;
            this.$data[id] = value;
            console.log(`update ${value}`);
            if (then !== null) then();
        },

        onRegister() {
            // verify inputs
            console.log('test');

            const {
                username, password, re_password, remember,
            } = this.$data;

            let ok = true;
            this.$data.e.pwd = '';
            this.$data.e.re_pwd = '';

            if (empty(username)) { this.$data.e.un = 'Username is required'; ok = false; }
            if (empty(password)) { this.$data.e.pwd = 'Password is required'; ok = false; }
            if (empty(re_password)) { this.$data.e.re_pwd = 'Repeated password is required'; ok = false; }
            if (password !== re_password) { this.$data.e.re_pwd = "Passwords don't match"; ok = false; }

            if (this.$data.s.un !== true) { ok = false; }

            if (!ok) return;

            this.$data.e.un = '';

            console.log(name);

            const self = this;

            const data = new URLSearchParams();
            data.append('username', username);
            data.append('password', password);
            data.append('remember', remember);
            Axios.post('/auth/register', data)
                .then((resp) => {
                    if (empty(resp.data.username)) {
                        const err = { data: 'done' };
                        throw err;
                    }
                    store.setAuth(true, resp.data);
                    this.$router.replace('/');
                })
                .catch((err) => {
                    store.setAlert('Sorry! ', `An error occurred during registration. ${err.response.data}`, true);
                });
        },

        checkUsername() {
            this.$data.s.un = false;
            clearTimeout(this.$data.delaySearchTimer);
            this.$data.delaySearchTimer = setTimeout(() => {
                const { username } = this.$data;
                console.log(`check un ${username}`);
                Axios.get(`/auth/checkUsername/${username}`)
                    .then((response) => {
                        console.log(response.data);
                        if (!response.data.available) {
                            this.$data.e.un = 'Username already taken';
                            this.$data.s.un = false;
                        } else {
                            this.$data.e.un = '';
                            this.$data.s.un = true;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }, 1000);
        },
    },
};
