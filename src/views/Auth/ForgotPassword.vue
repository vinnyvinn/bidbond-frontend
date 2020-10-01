<template>
    <auth>
        <div class="col-lg-12" v-if="step==1">
            <h4>Recover your account.</h4>
            <div class="form-container">
                <form @submit.prevent="recover" class="login">
                    <div class="form-group">
                        <input type="text" class="form-control-input" :class="{'notEmpty': user.email}" id="username" v-model="user.email"
                               required>
                        <label class="label-control" for="username">Email</label>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary">Send Recovery Email</button>
                    </div>
                </form>
                <br>
                <router-link class="link" :to="{name: 'login'}">Have an account? Log In</router-link>
            </div>
        </div>
        <div v-if="step == 2" class="col-lg-12">
            <div class="alert alert-info">
                <h4>Email Sent.</h4>
                <p>We have sent an email to {{ user.email }}. Click on the link on the email to
                    recover your account.</p>
            </div>
        </div>
    </auth>
</template>

<script>
    import Auth from "@/components/Auth.vue";

    export default {
        components: {
            Auth
        },

        data() {
            return {
                user: {
                    email: '',
                },
                error: '',
                step: 1
            }
        },

        methods: {
            recover() {

                axios.post('/api/password-reset-email', this.user).then(() => {
                    this.step = 2
                }).catch(error => {
                    this.error = error.response.data;
                });
            }
        }
    }
</script>
