<template>
    <div>
        <div v-html="$error.handle(error)"></div>
        <form @submit.prevent="validateForm">
            <div class="container">
                <div class="row">
                    <div class="col-md-6 form-group" :class="{ 'has-feedback has-error': errors.has('company_name')}">
                        <label>Company Name</label>
                        <input type="text" class="form-control" v-validate="'required'" name="company_name"
                               v-model="company.name">
                        <small class="help-block" v-if="errors.has('company_name')">
                            {{errors.first('company_name')}}
                        </small>
                    </div>
                    <div class="col-md-6 form-group"
                         :class="{ 'has-feedback has-error': errors.has('registration_number')}">
                        <label>Registration Number</label>
                        <input type="text" class="form-control" v-validate="'required'" v-model="company.crp"
                               placeholder="e.g CPR/2001/2650" name="registration_number">
                        <small class="help-block" v-if="errors.has('registration_number')">
                            {{errors.first('registration_number')}}
                        </small>

                    </div>
                    <template v-if="current_user.role !== 'agent'">
                        <div class="col-md-6 form-group" :class="{ 'has-feedback has-error': errors.has('kra_pin')}">
                            <label>Company KRA PIN</label>
                            <input type="text" class="form-control" v-validate="'required'" name="kra_pin"
                                   v-model="company.kra_pin">
                            <small class="help-block" v-if="errors.has('kra_pin')">
                                {{errors.first('kra_pin')}}
                            </small>
                        </div>
                        <div class="col-md-6 form-group" :class="{ 'has-feedback has-error': errors.has('email')}">
                            <label>Company Email</label>
                            <input type="email" class="form-control" name="email" v-validate="'required|email'"
                                   v-model="company.email">
                            <small class="help-block" v-if="errors.has('email')">
                                {{errors.first('email')}}
                            </small>
                        </div>
                        <div class="col-md-6 form-group" :class="{ 'has-feedback has-error': errors.has('phone')}">
                            <label>Company Phone Number</label>
                            <input type="text" v-model="company.phone_number" placeholder="254****" class="form-control"
                                   v-validate="'required|numeric'" name="phone"/>
                            <small class="help-block" v-if="errors.has('phone')">
                                {{errors.first('phone')}}
                            </small>
                        </div>
                        <div class="col-md-6 form-group"
                             :class="{ 'has-feedback has-error': errors.has('physical_address')}">
                            <label>Company Physical Address</label>
                            <input type="text" class="form-control" name="physical_address"
                                   v-validate="'required'"
                                   v-model="company.physical_address">
                            <small class="help-block" v-if="errors.has('physical_address')">
                                {{errors.first('physical_address')}}
                            </small>
                        </div>
                    </template>

                    <div class="col-md-6 form-group" :class="{ 'has-feedback has-error': errors.has('postal_address')}">
                        <label>Company Postal Address</label>
                        <input type="text" placeholder="eg 123" class="form-control" name="postal_address"
                               v-validate="'required|numeric'" v-model="company.postal_address">
                        <small class="help-block" v-if="errors.has('postal_address')">
                            {{errors.first('postal_address')}}
                        </small>
                    </div>
                    <div class="col-md-6 form-group" :class="{ 'has-feedback has-error': errors.has('postal_code')}">
                        <label>Postal Code</label>
                        <v-select :options="postal_codes" label="code" v-model="company.postal_code_id"
                                  name="postal_code"
                                  :reduce="c => c.id" v-validate="'required'" placeholder="Postal Code"></v-select>
                        <small class="help-block" v-if="errors.has('postal_code')">
                            {{errors.first('postal_code')}}
                        </small>
                    </div>
                    <div class="col-md-6 form-group">
                        <label>Price Group</label>
                        <v-select :options="groups" label="name" v-model="company.group_id"
                                  name="price_group" :reduce="g => g.id" v-validate="'required'"
                                  placeholder="Price Group"></v-select>
                        <small class="help-block" v-if="errors.has('step1.price_group')">
                            {{errors.first('step1.price_group')}}
                        </small>
                    </div>
                    <div class="form-group col-md-6">
                        <label>Relationship Manager
                            <small class="text-muted">(Optional)</small>
                        </label>
                        <v-select :options="rms" v-model="company.relationship_manager_id" :reduce="c => c.id"
                                  name="relationship_manager" label="fullname"
                                  placeholder="Relationship Manager"></v-select>
                    </div>
                    <div class="col-md-12 form-group">
                        <button class="btn btn-primary pull-right">Submit</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        mounted() {
            this.fetch();
        },
        props: ['company'],
        data() {
            return {
                error: ''
            }
        },

        methods: {
            fetch() {
                if (!this.groups.length) {
                    this.$store.dispatch("fetchGroups");
                }
                if (!this.postal_codes.length) {
                    this.$store.dispatch("fetchPostalCodes").then(() => {
                        this.loading = false;
                    });
                }
                if (!this.rms.length) {
                    this.$store.dispatch("fetchRelationshipManagers");
                }
            },
            validateForm() {
                return this.$validator.validateAll().then(result => {
                    if (result) {
                        this.update();
                    }
                });
            },
            update() {
                const company = (({name, crp, kra_pin, email, phone_number, physical_address, postal_address, group_id, postal_code_id, relationship_manager_id}) =>
                    ({
                        name,
                        crp,
                        kra_pin,
                        email,
                        phone_number,
                        physical_address,
                        postal_address,
                        group_id,
                        postal_code_id,
                        relationship_manager_id
                    }))(this.company);
                axios.put('/api/v1/companies/' + this.company.id, company).then(() => {
                    toastr.success("Company updated successfully");
                    this.$router.push({name: 'companies.index'});
                }).catch(err => {
                    if (err.response) {
                        this.error = err.response;
                    }
                });
            }
        },
        computed: {
            ...mapGetters({
                groups: 'getGroups',
                postal_codes: 'getPostalCodes',
                current_user: 'getAuthUser',
                rms: 'getRelationshipManagers'
            })
        }
    }
</script>
