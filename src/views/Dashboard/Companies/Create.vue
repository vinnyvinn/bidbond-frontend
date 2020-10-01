<template>
    <fieldset>
        <legend class="text-info">Onboard a Company</legend>
        <div v-html="$error.handle(error)"></div>
        <form @submit.prevent="validateForm" class="row">
            <div class="form-group col-md-6"
                 :class="{ 'has-feedback has-error': errors.has('company_name')}">
                <label>Company Name</label>
                <input type="text" class="form-control" v-validate="'required'" name="company_name"
                       v-model="name">
                <small class="help-block" v-if="errors.has('company_name')">
                    {{errors.first('company_name')}}
                </small>
            </div>
            <div class="col-md-6">
                <div class="form-group"
                     :class="{ 'has-feedback has-error': errors.has('registration_number')}">
                    <label>Registration Number</label>
                    <input type="text" class="form-control" v-validate="'required'" v-model="crp"
                           placeholder="e.g CPR/2001/2650" name="registration_number">
                    <small class="help-block" v-if="errors.has('registration_number')">
                        {{errors.first('registration_number')}}
                    </small>
                </div>
            </div>
            <template v-if="current_user.role !== 'agent'">
                <div class="form-group col-md-4" :class="{ 'has-feedback has-error': errors.has('email')}">
                    <label>Company Email</label>
                    <input type="email" class="form-control" name="email" v-validate="'required|email'"
                           v-model="email">
                    <small class="help-block" v-if="errors.has('email')">
                        {{errors.first('email')}}
                    </small>
                </div>
                <div class="form-group col-md-4"
                     :class="{ 'has-feedback has-error': errors.has('kra_pin')}">
                    <label>Company KRA PIN</label>
                    <input type="text" class="form-control" v-validate="'required'" name="kra_pin"
                           v-model="kra_pin">
                    <small class="help-block" v-if="errors.has('kra_pin')">
                        {{errors.first('kra_pin')}}
                    </small>
                </div>
                <div class="form-group col-md-4" :class="{ 'has-feedback has-error': errors.has('phone')}">
                    <label>Phone Number</label>
                    <phone-number v-model="phone_number" v-validate="'required'" name="phone"/>
                    <small class="help-block" v-if="errors.has('phone')">
                        {{errors.first('phone')}}
                    </small>
                </div>
            </template>

            <div class="form-group col-md-4"
                 :class="{ 'has-feedback has-error': errors.has('postal_address')}">
                <label>Postal Address</label>
                <input type="text" placeholder="eg 123" class="form-control" name="postal_address"
                       v-validate="'required|numeric'" v-model="postal_address">
                <small class="help-block" v-if="errors.has('postal_address')">
                    {{errors.first('postal_address')}}
                </small>
            </div>

            <div class="form-group col-md-4"
                 :class="{ 'has-feedback has-error': errors.has('postal_code')}">
                <label>Postal Code</label>
                <v-select :options="postal_codes" label="code" v-model="postal_code" name="postal_code"
                          v-validate="'required'" placeholder="Postal Code"></v-select>
                <small class="help-block" v-if="errors.has('postal_code')">
                    {{errors.first('postal_code')}}
                </small>
            </div>

            <div class="form-group col-md-4" v-if="postal_code">
                <label>Postal Name</label>
                <input type="text" class="form-control" v-model="postal_code.name" readonly>
            </div>


<!--                <template v-if="$store.getters.getAuthUser.kyc_status">-->
<!--                    <div class="form-group col-md-4">-->
<!--                        <label>Company Resolution</label>-->
<!--                        <input type="file" class="form-control" ref="company_resolution"-->
<!--                               id="company_resolution_file">-->
<!--                    </div>-->
<!--                    <div class="form-group col-md-4">-->
<!--                        <a href="#" class="btn btn-info btn-sm" @click.prevent="downloadResolution"><i-->
<!--                                class="fa fa-download" aria-hidden="true" style="margin-right: 10px;"></i>Download-->
<!--                            Company Resolution Template</a>-->
<!--                    </div>-->
<!--                </template>-->
                   <div class="form-group col-md-4" v-if="current_user.role !== 'agent'"
                 :class="{ 'has-feedback has-error': errors.has('physical_address')}">
                <label>Physical Address</label>
                <input type="text" class="form-control" name="physical_address"
                       v-validate="'required'"
                       v-model="physical_address">
                <small class="help-block" v-if="errors.has('physical_address')">
                    {{errors.first('physical_address')}}
                </small>
            </div>
            <div class="form-group col-md-4" v-if="current_user.role !== 'agent'">
                <label>Relationship Manager
                    <small class="text-muted">(Optional)</small>
                </label>
                <v-select :options="rms" v-model="relationship_manager"
                          name="relationship_manager"
                          label="fullname" placeholder="Relationship Manager"></v-select>
            </div>
            <div class="form-group col-md-12">
                <button class="btn btn-primary pull-right">Submit</button>
            </div>
        </form>
    </fieldset>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        mounted() {
            this.fetch();
            console.log(this.relationship_manager)
        },
        data() {
            return {
                name: '',
                crp: '',
                kra_pin: '',
                email: '',
                phone_number: '',
                physical_address: '',
                postal_address: '',
                relationship_manager: null,
                postal_code: null,
                error: ''
            }
        },
      methods: {
        fetch() {
          if (!this.postal_codes.length) {
            this.$store.dispatch("fetchPostalCodes")
          }
          if (!this.rms.length) {
            this.$store.dispatch("fetchRelationshipManagers");
          }
        },
        validateForm() {
          return this.$validator.validateAll().then(result => {
            if (result) {
              this.save();
            }
          });
        },
        agentSave() {
          axios.post('/api/v1/companies/agent', {
            'name': this.name,
            'postal_address': this.postal_address,
            'postal_code_id': this.postal_code.id,
            'crp': this.crp
          }).then(() => {
            this.$router.push({name: 'companies.index'});
          }).catch(err => {
            if (err.response) {
              this.error = err.response;
            }
          });
        },
        save() {
          if (this.$store.getters.getAuthUser.role === 'agent') {
            this.agentSave();
            return;
          }
          const data = {
            'name': this.name,
            'crp': this.crp,
            'kra_pin': this.kra_pin,
            'email': this.email,
            'phone_number': this.phone_number,
            'physical_address': this.physical_address,
            'postal_address': this.postal_address,
            'postal_code_id': this.postal_code.id
          };

          if (this.relationship_manager)
            data.relationship_manager_id = this.relationship_manager.id;
          axios.post('/api/v1/companies', data).then(resp => {
            if (resp.data.kyc_status === 1) {
              this.$router.push({name: 'companies.payment', params: {id: resp.data.company_unique_id}});
            } else {
              toastr.success("Company created successfully! Finalizing registration process...");
              this.$router.push({name: 'companies.index'});
            }
          }).catch(err => {
            if (err.response) {
              this.error = err.response;
            }
          });
        }
      },
      computed: {
            ...mapGetters({
                current_user: 'getAuthUser',
                postal_codes: 'getPostalCodes',
                rms: 'getRelationshipManagers'
            }),
        }
    }
</script>
