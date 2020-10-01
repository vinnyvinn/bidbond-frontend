<template>
    <auth v-if="is_loaded">
        <div class="col-md-12">
            <div class="form-container">
                <h4>Enter your personal information</h4>
                <div v-html="$error.handle(error)"></div>
                <form @submit.prevent="send">
                       <div class="form-group">
                        <input type="text" class="form-control-input" name="firstname"
                               v-validate="'required'" :class="{'notEmpty': personal.firstname}"
                               v-model="personal.firstname">
                        <label class="label-control" for="firstname">First Name</label>
                        <div class="help-block with-errors" v-if="errors.has('firstname')">
                            {{errors.first('firstname')}}
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="text" name="middlename" class="form-control-input" v-model="personal.middlename" :class="{'notEmpty': personal.middlename}">
                        <label class="label-control" for="middlename">Middle Name</label>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control-input" name="lastname" v-model="personal.lastname"
                               v-validate="'required'" :class="{'notEmpty': personal.lastname}">
                        <label class="label-control" for="lastname">Last Name</label>
                        <div class="help-block with-errors" v-if="errors.has('lastname')">
                            {{errors.first('lastname')}}
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="text" name="id_number" class="form-control-input" v-model="personal.id_number"
                               v-validate="'required'" :class="{'notEmpty': personal.id_number}">
                        <label class="label-control" for="id_number">ID Number</label>
                        <div class="help-block with-errors" v-if="errors.has('id_number')">
                            {{errors.first('id_number')}}
                        </div>
                    </div>
                    <div class="form-group">
                        <select class="form-control-input notEmpty" id="citizenship" name="citizenship" v-model="personal.citizenship"
                                v-validate="'required'" :class="{'notEmpty': personal.citizenship}">
                            <option value="kenyan">Kenyan</option>
                            <option value="foreigner">Foreigner</option>
                        </select>
                        <label class="label-control" for="citizenship">Citizenship</label>
                        <div class="help-block with-errors" v-if="errors.has('citizenship')">
                            {{errors.first('citizenship')}}
                        </div>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="form-control-submit-button">Validate</button>
                    </div>
                </form>

            </div>
        </div>
    </auth>
    <loading v-else/>
</template>

<script>
    import Auth from "@/components/Auth.vue";

    export default {
        components: {
            Auth
        },
        data() {
            return {
                personal: {
                    firstname: '',
                    middlename: '',
                    lastname: '',
                    id_number: '',
                    citizenship: 'kenyan'
                },
                error: '',
                is_loaded: true
            }
        },
        mounted() {
            this.initiate();
        },
        methods: {
            send() {
                return this.$validator.validateAll().then(result => {
                    if (result) {
                        this.is_loaded = false;
                        axios.post('/api/v1/verify/personal', this.personal).then(() => {
                            this.is_loaded = true;
                            this.$store.dispatch('initialize');
                        }).catch(error => {
                            this.is_loaded = true;
                            this.error = error.response;
                        })
                    }
                });
            },
            initiate() {

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
                    return;
                }

                if (!this.user.verified_phone && this.user.id_number !== null) {
                    this.$router.replace({name: 'verify.phone'});
                }
            },
        },
        computed: {
            user() {
                return this.$store.getters.getAuthUser;
            },
        },
        watch: {
            'user': {
                handler(oldval, newval) {
                    if (oldval !== newval) {
                        this.initiate();
                    }
                }
            }
        }
    }
</script>
