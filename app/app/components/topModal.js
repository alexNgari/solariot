import Axios from 'axios';
import $ from 'jquery';
import store from '../store';
import { uppercase } from '../utils';

export default {
    data() {
        return {
            lists: store.lists,
            loading: false,
            title: '',
        };
    },
    render() {
        let items = '';
        let actions = '';
        switch (this.$data.title) {
            case 'notifications':
                items = this.$data.lists.notifications.map((v) => {
                    if (!v.is_read) {
                        return <a href="#" class="list-group-item list-group-item-action">
                            <strong>{v.title}.</strong> {v.desc}
                        </a>;
                    }
                    return '';
                });
                actions = <button type="button" class="btn btn-outline-primary btn">Mark all as read</button>;
                break;
            case 'projects':
                items = this.$data.lists.projects.map(
                    v => <a href="#"
                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        <span>{v.Title} (<strong>{v.PID}</strong>)</span>
                        <span class="badge badge-secondary">{v.Version}</span>
                    </a>,
                );
                actions = <button type="button" class="btn btn-primary" on-click={this.newProject}>New Project</button>;
                break;
            case 'teams':
                items = this.$data.lists.teams.map(
                    v => <a href="#"
                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        <span>{v.Title}</span>
                        <span class="badge badge-secondary">{v.Saved === 'true' ? '' : 'not saved'}</span>
                    </a>,
                );
                actions = <button type="button" class="btn btn-primary">New Team</button>;
                break;
            default:
                break;
        }
        const title = uppercase(this.$data.title);
        return <div class="modal fade" id="topModal" ref="topModal" tabindex="-1" role="dialog" aria-labelledby="topModalTitle" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="topModalTitle">{title}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="list-group">
                            {this.$data.loading
                                ? <div class="list-group-item d-flex justify-content-center">
                                    <img class="mr-2" src="/assets/img/loading.gif" height="24px" width="24px" />
                                    <span class="align-middle">Loading</span>
                                </div>
                                : ''}
                            {items}
                        </div>
                    </div>
                    <div class="modal-footer">
                        {actions}
                    </div>
                </div>
            </div>
        </div>;
    },
    methods: {
        showTopModal(title) {
            $(this.$refs.topModal).modal('show');
            this.$data.title = title;
            console.log(title);

            if (this.$data.lists[title].length === 0) {
                this.$data.loading = true;
                Axios.get(`/${title}`)
                    .then((response) => {
                        store.setTopbarList(title, response.data);

                        this.$data.loading = false;
                    })
                    .catch((err) => {
                        store.setAlert('Sorry! ', `Could not update ${title}. ${err.response.data}`);
                        this.$data.loading = false;
                    });
            }
        },
        hideTopModal() {
            $(this.$refs.topModal).modal('hide');
        },
        newProject(e) {
            e.preventDefault();
            this.hideTopModal();
            this.$router.push('/projects/create');
        },
    },
    mounted() {
        this.$root.$on('showTopModal', this.showTopModal);
    },
};
