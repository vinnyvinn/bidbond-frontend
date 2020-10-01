<template>
    <fieldset>
        <legend class="text-info">Onboard an Agent</legend>
        <div v-html="$error.handle(the_error)"></div>
        <form @submit.prevent="validateForm()">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label>Select Agent Type</label>
                            <select class="form-control" v-model="agent.agent_type">
                                <option value="individual">Individual</option>
                                <option value="business">Business</option>
                            </select>
                        </div>
                    </div>
                </div>
                <h6>User Details</h6>
                <hr>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group"
                             :class="{ 'has-feedback has-error': errors.has('first_name')}">
                            <label>First Name</label>
                            <input type="text" v-model="individual.first_name" name="first_name"
                                   v-validate="'required'" class="form-control">
                            <small class="help-block" v-if="errors.has('first_name')">
                                {{errors.first('first_name')}}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group"
                             :class="{ 'has-feedback has-error': errors.has('last_name')}">
                            <label>Last Name</label>
                            <input type="text" v-model="individual.last_name" name="last_name"
                                   v-validate="'required'" class="form-control">
                            <small class="help-block" v-if="errors.has('last_name')">
                                {{errors.first('last_name')}}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="form-group"
                             :class="{ 'has-feedback has-error': errors.has('email')}">
                            <label>Email</label>
                            <input type="text" v-model="individual.email" name="email" autocomplete="email"
                                   v-validate="'required|email'" class="form-control">
                            <small class="help-block" v-if="errors.has('email')">
                                {{errors.first('email')}}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group"
                             :class="{ 'has-feedback has-error': errors.has('phone_number')}">
                            <label>Phone Number</label>
                            <phone-number v-model="individual.phone_number" name="phone_number" autocomplete="tel"
                                          v-validate="'required|numeric|min:10|max:15'"/>
                            <small class="help-block" v-if="errors.has('phone_number')">
                                {{errors.first('phone_number')}}
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
                    <template v-if="this.agent.agent_type  === 'individual'">
                        <div class="col-md-12">
                            <div class="form-group"
                                 :class="{ 'has-feedback has-error': errors.has('physical_address')}">
                                <label>Physical Address</label>
                                <input type="text" v-model="individual.physical_address"
                                       name="physical_address" v-validate="'required'" class="form-control">
                                <small class="help-block" v-if="errors.has('physical_address')">
                                    {{errors.first('physical_address')}}
                                </small>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label>Postal Code</label>
                                <v-select :options="postal_codes" label="code" v-model="individual.postal_code"
                                          name="postal_code" v-validate="'required'"
                                          placeholder="Postal Code"></v-select>
                                <small class="help-block" v-if="errors.has('postal_code')">
                                    {{errors.first('postal_code')}}
                                </small>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label>Postal Name</label>
                                <input type="text" class="form-control" v-model="individual.postal_code.name" readonly>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group"
                                 :class="{ 'has-feedback has-error': errors.has('postal_address')}">
                                <label>Postal Address</label>
                                <input type="text" v-model="individual.postal_address" name="postal_address"
                                       v-validate="'required|numeric'" placeholder="Postal Address eg. 635"
                                       class="form-control">
                                <small class="help-block" v-if="errors.has('postal_address')">
                                    {{errors.first('postal_address')}}
                                </small>
                            </div>
                        </div>
                    </template>
                </div>
                <template v-if="this.agent.agent_type  === 'business'">
                    <h6>Business Details</h6>
                    <hr>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group"
                                 :class="{ 'has-feedback has-error': errors.has('business_name')}">
                                <label class="control-label">
                                    Business Name
                                </label>
                                <input type="text" v-model="company.business_name" name="business_name"
                                       v-validate="'required'" class="form-control">
                                <small class="help-block" v-if="errors.has('business_name')">
                                    {{errors.first('business_name')}}
                                </small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group"
                                 :class="{ 'has-feedback has-error': errors.has('business_email')}">
                                <label class="control-label">
                                    Business Email
                                </label>
                                <input type="text" v-model="company.business_email" name="business_email"
                                       v-validate="'required|email'" class="form-control">
                                <small class="help-block" v-if="errors.has('business_email')">
                                    {{errors.first('business_email')}}
                                </small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group"
                                 :class="{ 'has-feedback has-error': errors.has('business_phone')}">
                                <label class="control-label">
                                    Business Phone
                                </label>
                                <input type="text" v-model="company.business_phone" class="form-control"
                                       name="business_phone"
                                       v-validate="'required|numeric|min:10|max:15'">
                                <small class="help-block" v-if="errors.has('business_phone')">
                                    {{errors.first('business_phone')}}
                                </small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group"
                                 :class="{ 'has-feedback has-error': errors.has('registration_pin')}">
                                <label class="control-label">
                                    CPR Number
                                </label>
                                <input type="text" v-model="company.registration_pin" name="registration_pin"
                                       v-validate="'required'" class="form-control"
                                       placeholder="CPR/123/2019 | PVT/123/2019">
                                <small class="help-block" v-if="errors.has('registration_pin')">
                                    {{errors.first('registration_pin')}}
                                </small>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-group"
                                 :class="{ 'has-feedback has-error': errors.has('physical_address')}">
                                <label class="control-label">
                                    Physical Address
                                </label>
                                <input type="text" v-model="company.physical_address" name="physical_address"
                                       v-validate="'required'" class="form-control">
                                <small class="help-block" v-if="errors.has('physical_address')">
                                    {{errors.first('physical_address')}}
                                </small>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group"
                                 :class="{ 'has-feedback has-error': errors.has('postal_code')}">
                                <label>Postal Code</label>
                                <v-select :options="postal_codes" label="code" v-model="postal_code" name="postal_code"
                                          v-validate="'required'" placeholder="Postal Code"></v-select>
                                <small class="help-block" v-if="errors.has('postal_code')">
                                    {{errors.first('postal_code')}}
                                </small>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label>Postal Name</label>
                                <input type="text" class="form-control" v-model="postal_code.name" readonly>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group"
                                 :class="{ 'has-feedback has-error': errors.has('postal_address')}">
                                <label>Postal Address</label>
                                <input type="text" v-model="company.postal_address" name="postal_address"
                                       v-validate="'required|numeric'" placeholder="Postal Address eg. 635"
                                       class="form-control">
                                <small class="help-block" v-if="errors.has('postal_address')">
                                    {{errors.first('postal_address')}}
                                </small>
                            </div>
                        </div>
                    </div>
                </template>
                <hr>
                <div class="row">
                    <div class="col-md-6 form-group" :class="{ 'has-feedback has-error': errors.has('limit')}">
                        <label>Limit</label>
                        <vue-numeric v-model="limit" name="limit" v-validate="'required|numeric|min:1'"
                                     class="form-control"/>
                        <small class="help-block" v-if="errors.has('limit')">
                            {{errors.first('limit')}}
                        </small>
                    </div>
                    <div class="col-md-6 form-group" :class="{ 'has-feedback has-error': errors.has('price_group')}">
                        <label>Price Group</label>
                        <v-select :options="groups" label="name" v-model="group_id"
                                  name="price_group" :reduce="g => g.id" v-validate="'required'"
                                  placeholder="Price Group"></v-select>
                        <small class="help-block" v-if="errors.has('price_group')">
                            {{errors.first('price_group')}}
                        </small>
                    </div>
                    <div class="col-md-6 form-group" :class="{ 'has-feedback has-error': errors.has('customerid')}">
                        <label>Customer ID</label>
                        <input type="text" v-model="customerid" name="customerid" v-validate="'required'"
                               class="form-control"/>
                        <small class="help-block" v-if="errors.has('customerid')">
                            {{errors.first('customerid')}}
                        </small>
                    </div>
                    <div class="col-md-6 form-group" :class="{ 'has-feedback has-error': errors.has('account')}">
                        <label>Account </label>
                        <input type="text" v-model="account" name="account" v-validate="'required'"
                               class="form-control"/>
                        <small class="help-block" v-if="errors.has('account')">
                            {{errors.first('account')}}
                        </small>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 form-group">
                        <button class="btn btn-primary pull-right" type="submit">Submit</button>
                    </div>
                </div>
            </div>
        </form>
    </fieldset>
</template>

<script>
    export default {
        mounted() {
            this.fetch();
        },
        data() {
            return {
                agent: {
                    agent_type: 'business',
                },
                individual: {
                    first_name: "",
                    last_name: "",
                    phone_number: null,
                    id_number: null,
                    county: "",
                    physical_address: "",
                    postal_address: "",
                    email: "",
                    postal_code: {
                        id: '',
                        code: '',
                        name: ''
                    },
                },
                company: {
                    business_name: "",
                    business_email: "",
                    business_phone: null,
                    registration_pin: "",
                    physical_address: "",
                    postal_address: ""
                },
                limit: 0,
                customerid:'',
                account:'',
                group_id: null,
                postal_code: {
                    id: '',
                    code: '',
                    name: ''
                },
                error: '',
                the_error: ''
            }
        },
        methods: {
            fetch() {
                if (!this.postal_codes.length) {
                    this.$store.dispatch("fetchPostalCodes").then(() => {
                        this.loading = false;
                    });
                }
                if (!this.groups.length) {
                    this.$store.dispatch("fetchGroups").then(() => {
                        this.loading = false;
                    });
                }
            },
            register() {
                this.loading = true;

                let data = {
                    "firstname": this.individual.first_name,
                    "lastname": this.individual.last_name,
                    "email": this.individual.email,
                    "phone": this.individual.phone_number,
                    "id_number": this.individual.id_number,
                    "agent_type": this.agent.agent_type,
                    "limit": this.limit,
                    "group_id": this.group_id,
                    "account" : this.account,
                    "customerid": this.customerid
                };

                if (this.agent.agent_type === 'individual') {
                    const individual = {
                        "postal_code_id": this.individual.postal_code.id,
                        "physical_address": this.individual.physical_address,
                        "postal_address": this.individual.postal_address,
                    };
                    data = {...data, ...individual};
                }

                if (this.agent.agent_type === 'business') {
                    const business = {
                        "business_name": this.company.business_name,
                        "business_email": this.company.business_email,
                        "business_phone": this.company.business_phone,
                        "business_physical_address": this.company.physical_address,
                        "business_postal_address": this.company.postal_address,
                        "business_postal_code_id": this.postal_code.id,
                        "crp": this.company.registration_pin,
                    };
                    data = {...data, ...business};
                }

                axios.post("/api/v1/agents", data).then(() => {
                    this.loading = false;
                    toastr.success('Agent created successfully');
                    this.$router.push({name: "agents.index"});
                }).catch(err => {
                    this.loading = false;
                    if (err.response) {
                        this.the_error = err.response;
                    }
                });

            },
            validateForm(scope) {
                return this.$validator.validateAll(scope).then(result => {
                    if (result) {
                        this.register();
                    }
                });
            },
        },
        computed: {
            postal_codes() {
                return this.$store.getters.getPostalCodes;
            },
            groups() {
                return this.$store.getters.getGroups;
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
        }
    }
</script>
