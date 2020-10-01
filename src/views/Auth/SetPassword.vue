<template>
    <auth>
        <div v-if="is_loaded" class="col-12">
            <div class="form-container" v-if="is_valid">
                <div v-html="$error.handle(error)"></div>
                <form @submit.prevent="submit">
                    <div class="form-group">
                        <input type="password" :class="{'notEmpty': password.current_password}" class="form-control-input"
                               v-model="password.current_password">
                        <label class="label-control" for="password">Current Password</label>
                    </div>
                    <div class="form-group">
                        <input type="password" :class="{'notEmpty': password.new_password}" class="form-control-input"
                               v-model="password.new_password">
                        <label class="label-control" for="new_password">New Password</label>
                    </div>
                    <div class="form-group">
                        <input type="password" :class="{'notEmpty': password.new_password_confirmation}" class="form-control-input"
                               v-model="password.new_password_confirmation">
                        <label class="label-control" for="confirm_new_password">Confirm New Password</label>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary">Change Password</button>
                    </div>
                    <br>
                </form>
            </div>
            <div class="alert alert-danger" v-else>
                <p>Your account could not be found. Please contact support.</p>
            </div>
        </div>
        <loading v-else/>
    </auth>
</template>

<script>
    import Auth from "@/components/Auth.vue";

    export default {
        components: {
            Auth
        },

        mounted() {
            this.fetch()
        },

        data() {
            return {
                password: {
                    password: {
                        current_password: '',
                        new_password: '',
                        new_password_confirmation: ''
                    }
                },
                is_valid: false,
                is_loaded: false,
                error: ''
            }
        },

        methods: {
            fetch() {
                this.is_valid = true;
                this.is_loaded = true;
            },

            submit() {
                this.is_loaded = false;
                axios.post('/api/v1/update-password', this.password).then(() => {
                    this.$store.dispatch('initialize').then(() => {
                        this.is_loaded = true;
                        this.$router.replace({name: 'dashboard'});
                    });
                }).catch(error => {
                    if (error.response) {
                        this.error = error.response;
                    }
                    this.is_loaded = true;
                })
            }
        }
    }
</script>
<style lang="scss">
    .landing__width {
        margin: auto;
        max-width: 70%;
    }
</style>
