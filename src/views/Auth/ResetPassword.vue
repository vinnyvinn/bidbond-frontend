<template>
    <auth>
        <div class="col-lg-12" v-if="is_loaded">
            <h4>Change Password</h4>
            <div class="form-container">
                <div v-html="$error.handle(error)"></div>
                <form @submit.prevent="submit" v-if="is_valid">
                    <div class="form-group">
                        <input type="password" class="form-control-input" :class="{'notEmpty': password.password}" v-model="password.password">
                        <label class="label-control" for="password">New Password</label>
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control-input" :class="{'notEmpty': password.password_confirmation}" v-model="password.password_confirmation">
                        <label class="label-control" for="password">Confirm New Password</label>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary">Set New Password</button>
                    </div>
                </form>
                <div class="alert alert-danger" v-else>
                    <p>Your account could not be found. Please contact support.</p>
                </div>
            </div>
        </div>
        <loading v-else/>
    </auth>
</template>

<script>
    import Auth from "@/components/Auth.vue";
    import toastr from 'toastr';
    import 'toastr/build/toastr.min.css';

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
                    code: this.$route.params.code,
                    password: '',
                    password_confirmation: '',
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
                axios.post('/api/password-set-new', this.password).then(() => {
                    this.is_loaded = true;
                    toastr.success('Your password has been updated', '');
                    this.$router.push({name: 'login'});
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

<style type="text/css">
    .alert-warning p {
        color: #fd0d39;
    }
</style>
