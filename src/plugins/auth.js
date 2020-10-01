import Vue from 'vue';

export function Auth(options = {}) {
    Vue.auth = {
        storagePrefix: 'jbid_app_',
        getStorageKey(part) {
            return this.storagePrefix + part;
        },

        setToken(token) {
            return localStorage.setItem(this.getStorageKey('token'), token);
        },
        getToken() {
            return localStorage.getItem(this.getStorageKey('token'));
        },

        logout(){
            this.removeToken();
            return localStorage.removeItem(this.getVerifyUser());
        },

        removeToken() {
            return localStorage.removeItem(this.getStorageKey('token'));
        },

        isAuthenticated() {

            return this.getToken() != null;
        },

        setVerifyUser(email) {

            return localStorage.setItem(this.getStorageKey('verify_email'), email);
        },

        getVerifyUser() {
            return localStorage.getItem(this.getStorageKey('verify_email'));
        },


    };
    Object.defineProperties(Vue.prototype, {
        $auth: {
            get() {
                return Vue.auth;
            }
        }

    });
}

