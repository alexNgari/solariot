import store from '../store';

export default {
    data() {
        return {
            alert: store.alert,
        };
    },
    render() {
        return <div class="fixed-top pt-3" style="z-index:30000">
            <div class="row">
                <div class="col-md-6 ml-auto mr-auto">
                    <span class="d-none">{this.$data.alert.count}</span>
                    {Object.keys(this.$data.alert.alerts).map((k) => {
                        const { strong, message } = this.$data.alert.alerts[k];
                        return <div class="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong>{strong}</strong>
                            {message}
                            <button type="button" class="close" aria-label="Close"
                                on-click={() => store.clearAlert(k)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>;
                    })}
                </div>
            </div>
        </div>;
    },
};
