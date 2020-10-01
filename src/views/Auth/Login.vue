<template>
    <auth>
        <div class="col-md-12">
            <h1>Log In </h1>
            <p>Don't have an account? Then please
                <router-link :to="{name: 'register'}" class="text-danger">Sign Up</router-link>
            </p>
            <!-- Sign Up Form -->
            <div class="form-container">
                <div v-html="$error.handle(error)"></div>
                <div v-if="show_verified" class="alert alert-success">
                    <p>Your account has been verified. You may now log in.</p>
                </div>
                <form @submit.prevent="login">
                    <div class="form-group">
                        <input type="email" :class="{'notEmpty': user.email}" name="email" class="form-control-input"
                               v-model="user.email" id="lemail" autofocus v-validate="'email|required'">
                        <label class="label-control" for="lemail">Email</label>
                        <div class="help-block with-errors" v-if="errors.has('email')">
                            {{errors.first('email')}}
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="password" v-model="user.password" class="form-control-input" name="password"
                               :class="{'notEmpty': user.password}" id="lpassword" v-validate="'required|min:6'">
                        <label class="label-control" for="lpassword">Password</label>
                        <div class="help-block with-errors" v-if="errors.has('password')">
                            {{errors.first('password')}}
                        </div>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="form-control-submit-button">LOG IN</button>
                    </div>
                </form>
                <g-signin-button
                        :params="googleSignInParams"
                        @success="onSignInSuccess"
                        @error="onSignInError">
                    <i class="fa fa-google"></i> Sign in with Google
                </g-signin-button>
                <router-link class="link" :to="{name: 'forgot-password'}">
                    Forgot your password?
                </router-link>
            </div> <!-- end of form container -->
            <!-- end of sign up form -->

        </div> <!-- end of col -->

    </auth>
</template>

<script>
    import GSignInButton from 'vue-google-signin-button'
    import Auth from "@/components/Auth.vue";
    import Vue from 'vue';
    import {mapGetters} from 'vuex';

    window.Vue = Vue;
    Vue.use(GSignInButton);

    export default {
        components: {
           Auth
        },
      updated(){
        if (localStorage.hasOwnProperty("jbid_app_token")) {
          localStorage.removeItem("jbid_app_token");
        }
      },
        mounted() {
          if (localStorage.hasOwnProperty("jbid_app_token")) {
            localStorage.removeItem("jbid_app_token");
          }
           const state = this.$route.query.a;
            if (state == 1) {
                this.$router.replace({name: 'login'});
                this.show_verified = 1;
            }
        },

        data() {
            return {
                user: {
                    email: process.env.VUE_GOOGLE_CLIENT_ID,
                    password: '',
                    access_token: ''
                },
                access_token: '',
                error: '',
                show_verified: false,
                googleSignInParams: {
                    client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID
                }
            }
        },
        methods: {
          isLoggedIn(){
            if (this.loggeduser !==undefined){
              if (this.loggeduser.verified_otp && this.loggeduser.verified_phone){
                return true;
              }
            }
           return false;
          },
            login() {
                this.error = '';
                return this.$validator.validateAll().then(result => {
                    if (result) {
                        axios.post('/api/v1/login', this.user).then(response => {
                            this.navigateLogin(response.data);
                        }).catch(err => {
                            this.show_verified = false;
                            this.error = {status: 401, data: {message: 'Invalid Credentials'}};
                            if (err.response.status === 403) {
                                this.error = {status: 401, data: {message: err.response.data}};
                            }
                        });
                    }
                });
            },
            navigateLogin(data) {
                this.$auth.setToken(data.access_token);
                axios.defaults.headers.Authorization = 'Bearer ' + this.$auth.getToken();
                window.axios = axios;
                this.$store.dispatch('setAuthUser', data).then(() => {
                    if (this.loggeduser.requires_password_change) {
                        this.$router.replace({name: 'set-password'});
                        return;
                    }

                    if (this.loggeduser.id_number == null && !this.loggeduser.create_by_admin) {
                        this.$router.replace({name: 'verify.personal'});
                        return;
                    }

                    if (!this.loggeduser.verified_phone && this.loggeduser.id_number !== null) {
                        this.$router.replace({name: 'verify.phone'});
                        return;
                    }

                    if (this.loggeduser.verified_phone) {
                        this.$router.replace({name: 'dashboard'});
                    }
                });

            },
            onSignInSuccess(googleUser) {
                const profile = googleUser.getBasicProfile();
                this.email = profile.getEmail();
                let auth = googleUser.getAuthResponse(true);
                this.access_token = auth.access_token;
                this.googleLogin();
            },
            onSignInError() {
                this.error = {status: 401, data: {message: 'Google sign in failed'}};
            },
            googleLogin() {
                axios.post("api/v1/auth/google", {
                    access_token: this.access_token
                }).then(response => {
                  //  this.navigateLogin(response.data);
                  this.$router.replace({name: 'verify.personal'});
                }).catch(err => {
                    this.error = {status: 401, data: {message: err.response.data}};
                });
            },
        },
        computed: {
          ...mapGetters(['getAuthUser']),
            loggeduser() {
                return this.$store.getters.getAuthUser;
            },
        }
    }
</script>
<style lang="scss">
    .g-signin-button {
        display: inline-block;
        padding: 10px;
        border-radius: 1.5rem;
        background-color: red;
        color: #fff;
        margin: 10px 0;
        width: 100%;

        i {
            margin-right: 10px;
        }

    }
</style>
