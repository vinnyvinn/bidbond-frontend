<template>
    <auth>
        <div v-if="is_loaded" class="col-lg-12">
            <div class="form-container">
                <div v-html="$error.handle(error)"></div>
                <template v-if="this.$store.getters.getAuthUser.phone_number !== null">
                    <form @submit.prevent="verify">
                        <div class="form-group">
                            <label>Enter the phone number:
                                {{this.$store.getters.getAuthUser.phone_number}}</label>
                            <phone-number v-model="phone_number" placeholder="Phone Number"/>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary btn-sm">Add Number</button>
                        </div>
                    </form>
                </template>
                <template v-else>
                    <h4>Verify your phone number</h4>
                    <hr>
                    <template v-if="step == 1">
                        <form @submit.prevent="request" class="login">
                            <div class="form-group">
                                <label for="phone_number">Phone Number</label>

                                <phone-number v-model="phone_number" id="phone_number" required=""/>

                            </div>
                            <div class="form-group">
                                <button class="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </template>
                    <template v-if="step == 2">
                        <div class="requesting">
                            <p>Requesting for PIN</p>
                        </div>
                    </template>
                    <template v-if="step == 3">
                        <form @submit.prevent="verify">
                            <div class="form-group">
                                <label>Enter the PIN we sent to {{ phone_number }}</label>
                                <input type="text" class="form-control" v-model="code">
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-sm btn-primary"> Verify</button>
                                <button @click.prevent="changePhone" class="btn btn-sm btn-success ml-2" type="button">
                                    <i class="fa fa-mobile"></i> Change Number
                                </button>
                            </div>
                        </form>
                    </template>
                </template>
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

        data() {
            return {
                phone_number: '',
                step: 1,
                code: '',
                error: '',
                is_loaded: true,
            }
        },
        mounted() {
            this.initialize();
        },
        methods: {
            initialize() {
                if (!this.user.email) {
                    this.$store.dispatch('initialize');
                    return;
                }

                if (this.user.requires_password_change) {
                    this.$router.replace({name: 'set-password'});
                    return;
                }
                if (this.user.verified_phone) {
                    this.$router.replace({name: 'dashboard'});
                }

                if (this.user.id_number == null && !this.user.create_by_admin) {
                    this.$router.replace({name: 'verify.personal'});
                    return;
                }
            },
            request() {
                this.error = '';
                this.step = 2;
                this.is_loaded = false;
                axios.post('/api/v1/user/getotp', {phone_number: this.phone_number}).then(() => {
                    this.is_loaded = true;
                    this.step = 3;
                    this.error = '';
                }).catch(error => {
                    this.is_loaded = true;
                    this.step = 1;
                    if (error.response) {
                        this.error = error.response;
                        return false;
                    }
                    this.error = 'There was an error sending the SMS. Please try again later';
                });
            },
            verify() {
                this.error = '';
                let data = {code: this.code, phone_number: this.phone_number};
                this.is_loaded = false;
                axios.post('/api/v1/verify/phone', data).then(() => {
                  console.log('success-')
                    this.$store.dispatch('initialize').then(() => {
                        this.is_loaded = true;
                       this.$router.replace({name: 'dashboard'});
                    });

                }).catch(error => {
                    this.is_loaded = true;
                    this.error = error.response;
                    console.log('error')
                    console.log(this.error)
                });
            },
            changePhone() {
                this.step = 1;
            }
        },

        computed: {
            user() {
                return this.$store.getters.getAuthUser;
            },
            all_errors() {
                if (typeof (this.error) == 'string') {
                    return this.error;
                }

                let str = '';
                this.error.forEach(err => {
                    str += '<p>' + err + '</p>';
                });

                return str;
            }
        },
        watch: {
            'user': {
                handler(oldval, newval) {
                    if (oldval !== newval) {
                        this.initialize();
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    .alert.alert-warning {
        color: #ca0000;
        padding: 5px 7px;
        border-left: 3px solid #ca0000;
        margin-bottom: 4px;
        background: #ca000017;
        font-size: 14px;
    }

    .btn-change {
        font-size: 13px;
        position: relative;
        margin: 3px 0 0;
    }
</style>
