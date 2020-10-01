<template>
    <div class="verify">
    	<guest-header />

        <div class="landing">
            <div class="container">
                <template v-if="! is_loaded">
                    <loading />
                </template>
                <template v-if="is_loaded">
                    <div class="row" v-if="is_valid">
                        <div class="col-md-4 offset-md-4">
                            <form @submit.prevent="register" class="auth-card" style="background: #fff; padding: 20px;">
                                <div v-html="$error.handle(error)"></div>
                                <div class="alert alert-info">
                                    <p>Enter your Email and password to complete verification.</p>
                                </div>
                                <hr>
                                <div class="form-group">
                                    <label for="username">Email</label>
                                    <input type="text" class="form-control" id="username" v-model="user.email" required="">
                                </div>
                                <div class="form-group">
                                    <label for="password">Password</label>
                                    <input type="password" class="form-control" id="password" v-model="user.password" required="">
                                </div>
                                <div class="form-group">
                                    <label for="password_confirmation">Confirm Password</label>
                                    <input type="password" class="form-control" id="password_confirmation" v-model="user.password_confirmation" required="">
                                </div>
                                <div class="form-group">
                                    <button class="btn btn-primary">Confirm</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div v-if="! is_valid" class="row">
                        <div class="col-md-8 offset-md-2" style="margin-top: 40px;">
                            <div v-html="$error.handle(error)"></div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <guest-footer />
    </div>
</template>

<script>
    import "@/guest";
    import GuestHeader from "@/components/Guest/Header.vue";
    import GuestFooter from "@/components/Guest/Footer.vue";

    export default {
        components: {
            GuestHeader, GuestFooter
        },
        
        mounted() {
            if (this.$auth.isAuthenticated()) {
                window.location.href = this.$router.resolve({ name: 'dashboard' }).href;
            } else {
        		this.verify();
            }
    	},

    	data() {
    		return {
    			error: '',
                is_loaded: false,
                user: {},
                is_valid: false
    		}
    	},

        methods: {
            verify() {
                let data = {
                    code: this.$route.params.code
                };

                axios.post('/api/v1/verify/director', data).then(response => {
                    this.is_loaded = true;
                    this.is_valid = true;
                }).catch(error => {
                    this.is_loaded = true;
                    this.is_valid = false;

                    if (error.response) {
                        this.error = error.response;
                    } else {
                        this.error = 'The code could not be verified. Please contact support.'
                    }
                });
            },

            register() {
                let data = this.user;
                data.code = this.$route.params.code;

                axios.post('/api/v1/activate/director', data).then(response => {
                    this.$router.push({ name: 'login', query: { a: 1 }});
                }).catch(error => {
                    this.error = error.response;
                });
            }
        }
    }
</script>