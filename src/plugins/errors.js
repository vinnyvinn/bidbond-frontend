import Vue from 'vue';

export function Errors() {
    Vue.errors = {
        handle(error) {
            if (typeof (error) == 'string') {
                if (error.length > 0) {
                    return this._handle(error);
                }
            }

            if (error.status == 422) {
                return this._handle(error.data.error);
            }

            if (error.status == 401) {
                if (error.data.message) {
                    return this._handle(error.data.message);
                } else if (error.data.error) {
                    return this._handle(error.data.error);
                } else {
                    return this._handle(error.data);
                }
            }

            if (error.status == 400) {
                if (error.data.error) {
                    return this._handle(error.data.error);
                } else {
                    return this._handle(error.data);
                }
            }

            if (error.status == 403) {
                return this._handle('User Does not have proper permissions!');
            }

            if (error.status == 404) {
                if (error.data.error) {
                    return this._handle(error.data.error);
                } else {
                    return this._handle(error.data);
                }
            }

            if (error.status == 500) {
                return this._handle('There was a problem processing your request. Please try again later.');
            }
        },

        _handle(err) {
            if (typeof (err) == 'string') {
                return this.alert(err);
            }

            let str = '';
            Object.values(err).forEach(e => {
                str += '<p>' + e + '</p>';
            });

            return this.alert(str);
        },

        alert(str) {
            return '<div class="alert alert-warning">' + str + '</div>'
        }
    };

    Object.defineProperties(Vue.prototype, {
        $error: {
            get() {
                return Vue.errors;
            }
        }

    });
}
