<template>
    <auth>
        <div class="col-md-12">
            <h1>Sign Up</h1>
            <p>Fill out the form below to sign up for JBid. Already signed up? Then just
                <router-link class="text-danger" :to="{name: 'login'}">Log In</router-link>
            </p>
            <!-- Sign Up Form -->
            <div class="form-container">
                <form @submit.prevent="register">
                    <div v-html="$error.handle(error)"></div>
                    <div class="form-group">
                        <input type="email" name="email" class="form-control-input" :class="{'notEmpty': user.email}"
                               v-model="user.email" id="semail" autofocus v-validate="'email|required'">
                        <label class="label-control" for="semail">Email</label>
                        <div class="help-block with-errors" v-if="errors.has('email')">
                            {{errors.first('email')}}
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="password" name="password" ref="password" class="form-control-input"
                               :class="{'notEmpty': user.password}"
                               id="spassword" v-validate="'required|min:6'" v-model="user.password">
                        <label class="label-control" for="spassword">Password</label>
                        <div class="help-block with-errors" v-if="errors.has('password')">
                            {{errors.first('password')}}
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control-input"
                               :class="{'notEmpty': user.password_confirmation}"
                               v-model="user.password_confirmation" id="sname" name="password_confirmation"
                               v-validate="'required|confirmed:password'">
                        <label class="label-control" for="sname">Confirm Password</label>
                        <div class="help-block with-errors" v-if="errors.has('password_confirmation')">
                            {{errors.first('password_confirmation')}}
                        </div>
                    </div>
                    <div class="form-group checkbox">
                        <input type="checkbox" id="sterms" value="Agreed-to-Terms" required>I agree with JBid's
                        <router-link :to="{ name: 'privacy' }">Privacy Policy</router-link>
                        and
                        <router-link :to="{name:'terms'}">Terms
                            Conditions
                        </router-link>
                        <div class="help-block with-errors"></div>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="form-control-submit-button">SIGN UP</button>
                    </div>
                </form>
                <g-signin-button
                        :params="googleSignInParams"
                        @success="onSignInSuccess"
                        @error="onSignInError">
                    <i class="fa fa-google"></i> Sign up with Google
                </g-signin-button>
            </div> <!-- end of form container -->
            <!-- end of sign up form -->

        </div> <!-- end of col -->
    </auth>
</template>

<script>
    import GSignInButton from 'vue-google-signin-button'
    import Auth from "@/components/Auth.vue";
    import Vue from 'vue';

    window.Vue = Vue;
    Vue.use(GSignInButton);

    export default {
        components: {
            Auth
        },
      updated(){
        if (localStorage.hasOwnProperty("bee_dee_app_verify_email") && localStorage.hasOwnProperty("bee_dee_app_token")) {
         // return this.$router.push('/dashboard');
        }
      },
        data() {
            return {
                user: {
                    email: '',
                    password: '',
                    access_token: ''
                },
                error: '',
                googleSignInParams: {
                    client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID
                }
            }
        },
     mounted() {
       if (localStorage.hasOwnProperty("bee_dee_app_verify_email") && localStorage.hasOwnProperty("bee_dee_app_token")) {
         //return this.$router.push('/dashboard');
       }
       },
      methods: {
            isLoggedIn() {
              //  return this.$auth.isAuthenticated();
            },
            register() {
                return this.$validator.validateAll().then(result => {
                    if (result) {
                        axios.post('/api/v1/register', this.user).then(() => {
                            this.$auth.setVerifyUser(this.user.email);
                            window.location.href = this.$router.resolve({name: 'register.confirm'}).href;
                        }).catch(error => {
                            this.error = error.response;
                        });
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
            onSignInError(error) {
                console.log("googleerror", error);
                this.error = {status: 401, data: {message: 'Google sign in failed'}};
            },
            googleLogin() {
                let self = this;
                axios.post("api/v1/auth/google", {
                    access_token: self.access_token
                })
                    .then((response) => {
                        this.navigateLogin(response.data);
                    })
                    .catch(() => {
                        this.error = {status: 401, data: {message: 'Could not register you in at this time'}};
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
        },
        computed: {
            loggeduser() {
                return this.$store.getters.getAuthUser;
            },
        }
    }
</script>
