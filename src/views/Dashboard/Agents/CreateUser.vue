<template>
    <div>
        <div v-html="$error.handle(error)"></div>
        <form @submit.prevent="validateForm()">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group"
                         :class="{ 'has-feedback has-error': errors.has('firstname')}">
                        <label>First Name</label>
                        <input type="text" v-model="individual.firstname" name="firstname"
                               v-validate="'required'" class="form-control">
                        <small class="help-block" v-if="errors.has('firstname')">
                            {{errors.first('firstname')}}
                        </small>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group"
                         :class="{ 'has-feedback has-error': errors.has('lastname')}">
                        <label>Last Name</label>
                        <input type="text" v-model="individual.lastname" name="lastname"
                               v-validate="'required'" class="form-control">
                        <small class="help-block" v-if="errors.has('lastname')">
                            {{errors.first('lastname')}}
                        </small>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group"
                         :class="{ 'has-feedback has-error': errors.has('email')}">
                        <label>Email</label>
                        <input type="text" v-model="individual.email" name="email"
                               v-validate="'required|email'" class="form-control">
                        <small class="help-block" v-if="errors.has('email')">
                            {{errors.first('email')}}
                        </small>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group"
                         :class="{ 'has-feedback has-error': errors.has('phone')}">
                        <label>Phone Number</label>
                        <phone-number v-model="individual.phone" name="phone"
                                      v-validate="'required|digits:12'"/>
                        <small class="help-block" v-if="errors.has('phone')">
                            {{errors.first('phone')}}
                        </small>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group"
                         :class="{ 'has-feedback has-error': errors.has('id_number')}">
                        <label>ID number</label>
                        <input type="text" v-model="individual.id_number" name="id_number"
                               v-validate="'required'" class="form-control">
                        <small class="help-block" v-if="errors.has('id_number')">
                            {{errors.first('id_number')}}
                        </small>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 form-group">
                    <button class="btn btn-primary pull-right" type="submit">Submit</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        props: ['agentid'],
        data() {
            return {
                individual: {
                    first_name: "",
                    last_name: "",
                    phone: null,
                    id_number: null,
                    email: "",
                },
                error: ''
            }
        },
        methods: {
            linkUser() {
                this.loading = true;
                axios.post("/api/v1/agent/" + this.agentid + "/linkUser", this.individual).then(() => {
                    this.loading = false;
                    toastr.success('Agent updated successfully');
                    this.$router.push({name: "agents.index"});
                }).catch(err => {
                    this.loading = false;
                    if (err.response) {
                        this.error = err.response;
                    }
                });

            },
            validateForm() {
                return this.$validator.validateAll().then(result => {
                    if (result) {
                        this.linkUser();
                    }
                });
            },
        }
    }
</script>

