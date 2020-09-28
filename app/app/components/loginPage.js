import Axios from 'axios';
import store from '../store';
import { onUpdate, empty, load } from '../utils';

export default {
    data() {
        return {
            loging: false,
            remember: true,
            e: { un: '', pwd: '' },
        };
    },
    render() {
        const update = onUpdate.bind(this);
        return <div>
            <div class="py-5 text-center">
                <img class="d-block mx-auto mb-4" src="/assets/img/ujuzi_icon_128.png?v=1.1" alt="" width="72" height="72" />
                <h2>Welcome</h2>
                <p class="lead">Login to continue</p>
            </div>

            <div class="row">
                <div class="col-md-4 order-md-1 ml-auto mr-auto">
                    <h4 class="mb-3">Sign in</h4>
                    <form class="needs-validation" novalidate="">
                        <div class="mb-3">
                            <label for="username">Username</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">@</span>
                                </div>
                                <input type="text" class={`form-control ${empty(this.$data.e.un) ? '' : 'is-invalid'}`}
                                    id="username" placeholder="Username"
                                    onInput={update} />
                                <div class="invalid-feedback" style="width: 100%;">
                                    {this.$data.e.un}
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="password">Password</label>
                            <input type="password" class={`form-control ${empty(this.$data.e.pwd) ? '' : 'is-invalid'}`}
                                id="password" placeholder="Password"
                                onInput={update} />
                            <div class="invalid-feedback">{this.$data.e.pwd}</div>
                        </div>

                        <div class="custom-control custom-checkbox mb-3">
                            <input type="checkbox" class="custom-control-input" id="remember"
                                checked={this.$data.remember}
                                on-click={update} />
                            <label class="custom-control-label" for="remember">Remember me</label>
                        </div>

                        <div class={`btn btn-primary btn-lg btn-block mb-3 d-flex justify-content-center align-items-center ${this.$data.loging ? 'loading' : ''}`}
                            id="loging" on-click={e => load.bind(this)(e, this.onLogin)}>
                            <span>Sign In</span>
                            <div class="loader ml-2"></div>
                        </div>

                        <div class="text-center mb-3">
                            OR
                        </div>

                        <router-link to="/register">
                            <div class="btn btn-light btn-block">Register a new account</div>
                        </router-link>
                    </form>
                </div>
            </div>

        </div>;
    },
    beforeCreate() {
        store.showToolbar(false);
    },
    methods: {
        onLogin() {
            console.log('login');

            const { username, password, remember } = this.$data;

            let ok = true;
            this.$data.e.un = '';
            this.$data.e.pwd = '';
            if (empty(username)) { this.$data.e.un = 'Please enter your username'; ok = false; }
            if (empty(password)) { this.$data.e.pwd = 'Please enter your password'; ok = false; }

            if (!ok) return;

            const data = new URLSearchParams();
            data.append('username', username);
            data.append('password', password);
            data.append('remember', remember);

            Axios.post('/auth/login', data)
                .then((resp) => {
                    if (empty(resp.data.username)) {
                        const err = { data: 'done' };
                        throw err;
                    }
                    store.setAuth(true, resp.data);
                    this.$router.replace('/');
                })
                .catch((err) => {
                    let message = 'Something broke when attempting to sign you in.';
                    switch (err.response.data.trim()) {
                        case 'no_user':
                            message = `Could not find user '${username}'.`;
                            break;
                        case 'wrong_password':
                            message = 'Wrong password.';
                            break;
                        default:
                            break;
                    }
                    store.setAlert('Error! ', message, true);
                });
        },
    },
};
