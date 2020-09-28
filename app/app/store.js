
export default {
    debug: true,
    auth: {
        isAuth: false,
        profile: {},
    },
    toolbar: {
        visible: false,
    },
    sidebar: {
        visible: false,
    },
    theme: {
        dark: false,
    },
    alert: {
        count: 0,
        alerts: {},
    },
    lists: {
        notifications: [],
        projects: [],
        teams: [],
    },
    updates: {
        stats: {
            V: 0, I: 0, P: 0, AmpH: 0, Temp: 0, Flow: 0,
        },
        heater: true,
    },
    setAuth(isAuth, profile) {
        this.auth.isAuth = isAuth;
        this.auth.profile = profile;
    },
    showToolbar(show) {
        this.toolbar.visible = show;
    },
    showSidebar(show) {
        this.sidebar.visible = show;
    },
    showDarkBg(bg) {
        this.theme.dark = bg;
    },
    setAlert(strong, message, autoDismiss = true) {
        const key = this.alert.count;
        this.alert.alerts[key] = { strong, message };
        if (autoDismiss) {
            setTimeout(() => this.clearAlert(key), 5000);
        }
        this.alert.count += 1;
    },
    clearAlert(key) {
        delete this.alert.alerts[key];
        this.alert.count += 1;
    },
    setTopbarList(title, list) {
        this.lists[title] = list;
    },
    updateStats(stats) {
        this.updates.stats = stats;
    },
    toggleHeater(status) {
        this.updates.heater = status;
    },
    socketio: {},
};
