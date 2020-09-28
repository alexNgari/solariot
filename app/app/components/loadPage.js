import store from '../store';

export default {
    render() {
        return <div>
            <div class="py-5 text-center">
                <img class="d-block mx-auto mb-4" src="/assets/img/ic_logo.png?v=1.1" width="72" height="72" />
                <h2>Welcome to your IoT dashboard</h2>
            </div>

            <div class="row">
                <div class="mr-auto ml-auto d-flex">
                    <img class="mr-2" src="/assets/img/loading.gif" height="48px" width="48px" />
                    <h3>Loading</h3>
                </div>
            </div>
        </div>;
    },
    beforeCreate() {
        store.showToolbar(false);
    },
};
