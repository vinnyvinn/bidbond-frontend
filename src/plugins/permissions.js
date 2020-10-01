import Vue from 'vue';

export function Permissions() {
    Vue.permissions = {
        view(user, permission) {
            let user_permissions = user.permissions;

            if (user_permissions) {
                if (user_permissions.indexOf('*') > -1) {
                    return true;
                }

                if (user_permissions.indexOf(permission) > -1) {
                    return true;
                }

                return user_permissions.indexOf(permission + '-owned') > -1;


            }

            return false;
        }
    };

    Object.defineProperties(Vue.prototype, {
        $can: {
            get() {
                return Vue.permissions;
            }
        }

    });
}
