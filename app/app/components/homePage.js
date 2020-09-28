import store from '../store';
import { onUpdate } from '../utils';
import Axios from 'axios';

export default {
    data() {
        return {
            search: '',
            updates: store.updates,
        };
    },
    render() {
        return <div>
            <div class="row">

                <div class="col-sm-4">
                    <div class="card mt-4">
                        <div class="card-body">
                            <h5 class="card-title">Temperature</h5>
                            <p class="card-text metric-value">{this.$data.updates.stats.Temp}C</p>
                            <a href="#" class="btn btn-primary">View history</a>
                            <div on-click={this.onHeaterToggle} class="btn btn-secondary">
                            Turn {this.$data.updates.heater ? 'Off' : 'On'} Heater
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-sm-4">
                    <div class="card mt-4">
                        <div class="card-body">
                            <h5 class="card-title">Water Flow</h5>
                            <p class="card-text metric-value">{this.$data.updates.stats.Flow}L in the last 5min</p>
                            <a href="#" class="btn btn-primary">View history</a>
                        </div>
                    </div>
                </div>

                <div class="col-sm-4">
                    <div class="card mt-4">
                        <div class="card-body">
                            <h5 class="card-title">Voltage</h5>
                            <p class="card-text metric-value">{this.$data.updates.stats.V}V</p>
                            <a href="#" class="btn btn-primary">View history</a>
                        </div>
                    </div>
                </div>

                <div class="col-sm-4">
                    <div class="card mt-4">
                        <div class="card-body">
                            <h5 class="card-title">Current</h5>
                            <p class="card-text metric-value">{this.$data.updates.stats.I}A</p>
                            <a href="#" class="btn btn-primary">View history</a>
                        </div>
                    </div>
                </div>

                <div class="col-sm-4">
                    <div class="card mt-4">
                        <div class="card-body">
                            <h5 class="card-title">Ampere hours</h5>
                            <p class="card-text metric-value">{this.$data.updates.stats.AmpH}Ah</p>
                            <a href="#" class="btn btn-primary">View history</a>
                        </div>
                    </div>
                </div>

                <div class="col-sm-4">
                    <div class="card mt-4">
                        <div class="card-body">
                            <h5 class="card-title">Power</h5>
                            <p class="card-text metric-value">{this.$data.updates.stats.P}W</p>
                            <a href="#" class="btn btn-primary">View history</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    },
    methods: {
        onHeaterToggle() {
            store.toggleHeater(!this.$data.updates.heater);
            Axios
            .get('/ctrl/heater')
            .then((response) => {
                console.log(response);
            })
        }
    },
    beforeCreate() {
        store.showToolbar(true);
    },
};
