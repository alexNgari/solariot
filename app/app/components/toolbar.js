import Axios from 'axios';
import store from '../store';

export default {
    data() {
        return {
            profile: store.auth.profile,
            modal: '',
        };
    },
    render() {
        return <div class="toolbar">
            <nav class="navbar navbar-expand-md fixed-top navbar-dark bg-dark shadow-sm">
                <router-link to="/" class="navbar-brand mr-3 mr-lg-4">
                    <img src="/assets/img/logo.png" height="36px" width="36px" />
                    <span class="align-text-top">Monitor</span>
                </router-link>
                <button class="navbar-toggler p-0 border-0" type="button"
                    data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <router-link to="/" class="nav-item" tag="li" exact-active-class="active" exact>
                            <a href="#" class="nav-link">Home <span class="sr-only">(current)</span></a>
                        </router-link>
                    </ul>
                    <ul class="navbar-nav ml-md-auto">
                        <li class="nav-item dropdown">
                            <div class="nav-link cursor-pointer d-flex" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="/assets/img/ic_smiley_trans.png" class="mr-2" style="background:grey; border-radius:5px" width="32px" height="32px" />
                                <div class="mt-auto mb-auto">
                                    <h6 class="my-0">@{this.$data.profile.username}</h6>
                                </div>
                            </div>
                            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
                                <a class="dropdown-item" href="#">Profile</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#" on-click={this.logout}>Sign out</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>;
    },
    methods: {
        /**
         * @param {Event} e
         */
        showModal(e) {
            e.preventDefault();
            const title = e.target.id;
            this.$data.modal = title;
            this.$root.$emit('showTopModal', title);
        },
        logout(e) {
            e.preventDefault();
            Axios.get('/auth/logout')
                .then(() => window.location.replace('/'))
                .catch(() => store.setAlert('Error! ', 'Something went wrong when logging you out.'));
        },
    },
};
