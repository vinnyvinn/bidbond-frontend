<template>
    <div>
        <h4>Security Settings</h4>
        <hr>
        <fieldset>
            <legend class="text-info">Change your password</legend>
            <div v-html="$error.handle(error)"></div>
            <form @submit.prevent="submit">
                <div class="form-group">
                    <label>Current Password</label>
                    <input type="password" class="form-control" v-model="password.current_password">
                </div>
                <div class="form-group">
                    <label>New Password</label>
                    <input type="password" class="form-control" v-model="password.new_password">
                </div>
                <div class="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" class="form-control" v-model="password.new_password_confirmation">
                </div>
                <div class="form-group">
                    <button class="btn btn-primary">Change Password</button>
                </div>
            </form>
        </fieldset>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                password: {
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: ''
                },
                error: ''
            }
        },

        methods: {
            submit() {
                axios.post('/api/v1/update-password', this.password).then(response => {
                    toastr.success('Your password has been updated', 'Saved');
                }).catch(error => {
                    if (error.response) {
                        this.error = error.response;
                    }
                })
            }
        }
    }
</script>