<template>
    <div v-if="!loading">
        <h4>Edit Bid bond</h4>
        <div v-html="$error.handle(error)"></div>
        <form class="row" @submit.prevent="validateForm('step1')" data-vv-scope="step1" v-if="step === 1">
            <div class="form-group col-md-6">
                <label>Company Name</label>
                <input type="text" class="form-control" placeholder="Company Name" v-model="bid_bond.company" readonly/>
            </div>
            <div class="form-group col-md-6">
                <label>Procuring Entity</label>
                <v-select :options="counter_parties" label="name" data-vv-name="procuring_entity" data-vv-scope="step1"
                          name="procuring_entity" v-model="bid_bond.counter_party_id" :reduce="c =>c.id"
                          placeholder="Select Company Tendering From" v-validate="'required'"></v-select>
                <small class="help-block" v-if="errors.has('step1.procuring_entity')">
                    {{errors.first('step1.procuring_entity')}}
                </small>
            </div>
            <div class="form-group col-md-6">
                <label>Tender Number</label>
                <input type="text" class="form-control" placeholder="eg Kenha/2259/2020" name="tender_number"
                       v-model="bid_bond.tender_no" v-validate="'required'" data-vv-scope="step1">
                <small class="help-block" v-if="errors.has('step1.tender_number')">
                    {{errors.first('step1.tender_number')}}
                </small>
            </div>
            <div class="form-group col-md-6">
                <label>Tender Amount</label>
                <vue-numeric class="form-control" name="tender_amount" data-vv-scope="step1"
                             v-model="bid_bond.amount" v-validate="'required'"/>
                <small class="help-block" v-if="errors.has('step1.tender_amount')">
                    {{errors.first('step1.tender_amount')}}
                </small>
            </div>
            <div class="form-group col-md-6">
                <label>Start Date</label>
                <date-picker v-model="bid_bond.effective_date" data-vv-scope="step1" v-validate="'required'"
                             format="yyyy-MM-dd" name="bid_bond_start_date" input-class="form-control bg-white"/>
                <small class="help-block" v-if="errors.has('step1.bid_bond_start_date')">
                    {{errors.first('step1.bid_bond_start_date')}}
                </small>
            </div>
            <div class="form-group col-md-6">
                <label>Tender Period</label>
                <select class="form-control" v-model="bid_bond.period" v-validate="'required'" data-vv-scope="step1"
                        name="tender_period">
                    <option value="30">30 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                    <option value="120">120 Days</option>
                    <option value="180">180 Days</option>
                    <option value="210">210 Days</option>
                    <option value="365">365 Days</option>
                </select>
                <small class="help-block" v-if="errors.has('step1.tender_period')">
                    {{errors.first('step1.tender_period')}}
                </small>
            </div>
            <div class="form-group col-md-6">
                <label>Tender Purpose</label>
                <textarea rows="3" name="tender_purpose" class="form-control" data-vv-scope="step1"
                          placeholder="eg. Tender for provision of auctioneering services"
                          v-model="bid_bond.purpose" v-validate="'required'"></textarea>
                <small class="help-block" v-if="errors.has('step1.tender_purpose')">
                    {{errors.first('step1.tender_purpose')}}
                </small>
            </div>
            <div class="form-group col-md-6">
                <label>Addressee</label>
                <textarea rows="3" placeholder="eg. Procurement Officer" class="form-control"
                          v-validate="'required'" name="addressee" data-vv-scope="step1"
                          v-model="bid_bond.addressee"></textarea>
                <small class="help-block" v-if="errors.has('step1.addressee')">{{errors.first('step1.addressee')}}
                </small>
            </div>
            <div class="form-group col-md-12">
                <button class="btn btn-primary btn-sm" type="submit">Next</button>
            </div>
        </form>
        <form v-if="step === 2" @submit.prevent="validateForm('step2')" data-vv-scope="step2">
            <div class="form-group">
                <label>Select Template</label>
                <v-select :options="templates" label="name" name="template" :reduce="c => c.secret"
                          v-model="bid_bond.template_secret"
                          placeholder="Select Template" data-vv-scope="step2" v-validate="'required'"/>
                <small class="help-block" v-if="errors.has('step2.template')">{{errors.first('step2.template')}}</small>
            </div>
            <div class="form-group">
                <label for="terms" class="checkbox">
                    <input type="checkbox" name="terms" v-validate="'required'" data-vv-scope="step2">
                    I have read the <a href="#" @click.prevent="show_terms=true">terms
                    and conditions.</a>
                </label>
                <br>
                <small class="help-block" v-if="errors.has('step2.terms')">{{errors.first('step2.terms')}}</small>
            </div>
            <hr>
            <div class="form-group">
                <div class="preview" id="bid-bond-template"
                     style="background: #fff url(/img/sample.png) no-repeat; background-size: contain; background-position-x: center;">
                    <div v-html="preview"></div>
                </div>
            </div>
            <hr>
            <div class="form-group px-5 text-right">
                <button class="btn btn-primary btn-sm" type="submit">Update</button>
                <a href="#" class="btn btn-info pull-left btn-sm" @click.prevent="step=1">Previous</a>
            </div>
        </form>
    </div>
    <loading v-else/>
</template>

<script>
    import DatePicker from 'vuejs-datepicker';

    export default {
        components: {
            DatePicker
        },
        mounted() {
            this.fetchBidbond();
            this.fetchTemplates();
            this.fetchCounterParties();
        },
        data() {
            return {
                bid_bond: {
                    company_id: null,
                    purpose: '',
                    counter_party_id: '',
                    addressee: '',
                    template_secret: '',
                    charge: null,
                    bidbond_secret: ''
                },
                step: 1,
                error: '',
                templates: [],
                selected_template: {},
                preview: '',
                loading: false,
                terms: false,
                show_terms: false
            }
        },
        methods: {
            fetchTemplates() {
                this.loading = true;
                axios.get('/api/v1/bid-bond-templates').then(response => {
                    this.templates = response.data.data;
                    this.loading = false;
                });
            },
            fetchCounterParties() {
                if (!this.counter_parties.length) {
                    this.$store.dispatch("fetchCounterParties").then(() => {
                        this.loading = false;
                    });
                }
            },
            fetchBidbond() {
                this.loading = true;
                axios.get('/api/v1/bid-bonds/id/' + this.$route.params.id).then(response => {
                    this.bid_bond = response.data.data;
                    this.loading = false;
                }).catch(error => {
                    this.error = error.response;
                    this.loading = false;
                });
            },
            calculatePricing() {
                this.loading = true;
                axios.post('/api/v1/getpricing', {
                    amount: this.bid_bond.amount,
                    period: this.bid_bond.period,
                    secret: this.bid_bond.bidbond_secret,
                    company_id: this.bid_bond.company_id
                }).then(response => {
                    this.loading = false;
                    this.bid_bond.charge = response.data.total;
                });
            },
            validateForm(scope) {
                return this.$validator.validateAll(scope).then(result => {
                    if (result) {
                        if (scope === 'step1') {
                            this.bid_bond.end_date = moment(this.bid_bond.effective_date).add(parseInt(this.bid_bond.period), 'days').format('YYYY-MM-DD');
                            this.step = 2;
                            this.bid_bond.effective_date = moment(this.bid_bond.effective_date).format('YYYY-MM-DD');
                            this.calculatePricing();
                            this.fetchPreview();
                        }
                        if (scope === 'step2') {
                            this.postBidbond();
                        }
                    }
                });
            },
            postBidbond() {
                this.loading = true;
                axios.put('/api/v1/bid-bonds/' + this.bid_bond.id, this.bid_bond).then(() => {
                    console.log('posting')
                    this.loading = false;
                    toastr.success('Bidbond updated successfully!If you have changed the bid period an additional payment will be required!');
                    this.$router.push({name: "bidbonds.index"});
                }).catch(err => {
                    this.loading = false;
                    if (err.response) {
                        this.the_error = err.response;
                    }
                });
            },
            fetchPreview() {
                axios.post('/api/v1/bid-bonds/preview', this.bid_bond).then(response => {
                    this.preview = response.data;
                });
            }
        },
        watch: {
            'bid_bond.template_secret': function (n) {
                this.fetchPreview();
            },
        },
        computed: {
            counter_parties() {
                return this.$store.getters.getCounterParties;
            },
        }
    }
</script>


