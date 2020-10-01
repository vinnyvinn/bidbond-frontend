<template>
    <div>
        <fieldset>
            <legend>GENERATE BIDBOND</legend>
            <div v-html="$error.handle(error)"></div>
            <template v-if="step === 1">
                <step-one :companies="companies" @step1="step1" :current="bid_bond"/>
            </template>
            <template v-if="step === 2">
                <step-two @step2="step2" @back="step = 1" :counter_parties="counter_parties" :current="bid_bond"/>
            </template>
            <template v-if="step === 3">
                <step-three @step3="step3" @back="step = 2" :current="bid_bond"/>
            </template>
            <template v-if="step === 4">
                <template v-if="show_summary">
                    <step-four :bid_bond="bid_bond" :pricing="pricing" @back="step = 3" @step4="step4"/>
                </template>
                <template v-if="! show_summary">
                    <loading/>
                </template>
            </template>
            <template v-if="step === 5">
                <select-template :current="bid_bond" @selected="selectTemplate" @back="step = 4"/>
            </template>
        </fieldset>
    </div>
</template>

<script>
    import SelectTemplate from "@/components/Dashboard/BidBonds/SelectTemplate.vue";
    import StepOne from "@/components/Dashboard/BidBonds/StepOne.vue";
    import StepTwo from "@/components/Dashboard/BidBonds/StepTwo.vue";
    import StepThree from "@/components/Dashboard/BidBonds/StepThree.vue";
    import StepFour from "@/components/Dashboard/BidBonds/StepFour";
    import {mapGetters} from 'vuex';

    export default {
        components: {
            SelectTemplate, StepOne, StepTwo, StepThree, StepFour
        },
        mounted() {
            console.log(this.$route.params)
            if (this.$route.params.tender_no != undefined) {
                this.$store.dispatch('editBidbond', this.$route.params.tender_no);
            }
            this.fetch();
            this.fetchCounterParties();
        },
        data() {
            return {
                bid_bond: {
                    company: {
                        name: '',
                        company_unique_id: null,
                        balance: 0
                    }
                },
                step: 1,
                error: '',
                pricing: {},
                companies: [],
                show_summary: false
            }
        },
        methods: {
            isEmpty(obj) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key))
                        return false;
                }
                return true;
            },
            fetch() {
                const co_id = this.$route.params.company_id;
                this.bid_bond.tender_number = this.getTender;
                axios.get('/api/v1/approved-companies/options').then(response => {
                    this.companies = response.data;
                    if (co_id) {
                        this.fetchCompanyDetail(co_id);
                        this.step = 0;
                        this.searchTender();
                    }
                });
            },
            fetchCompanyDetail(co_id) {
                axios.get('/api/v1/companies/bid/' + co_id).then(response => {
                    this.bid_bond.company = response.data;
                    this.bid_bond.balance = response.data.balance;
                });
            },
            fetchCounterParties() {
                this.$store.dispatch("fetchCounterParties").then(() => {
                    this.loading = false;
                });
            },
            extend(obj, src) {
                for (let key in src) {
                    if (src.hasOwnProperty(key)) obj[key] = src[key];
                }
                return obj;
            },
            calculatePricing() {
                this.show_summary = false;
                axios.post('/api/v1/getpricing', {
                    amount: this.bid_bond.amount,
                    period: this.bid_bond.period,
                    company_id: this.bid_bond.company.company_unique_id
                }).then(response => {
                    this.pricing = response.data;
                    this.show_summary = true;
                });
            },
            searchTender() {
                axios.get('/api/v1/tender?tender_number=' + encodeURIComponent(this.getTender)).then(response => {
                    const data = response.data.data;
                    if (data) {
                        if (this.getTender) {
                            this.bid_bond.reference = data.reference;
                        }
                        this.bid_bond.amount = parseFloat(data.amount);
                        this.bid_bond.period = data.period;
                        this.bid_bond.tender_purpose = data.purpose;
                        this.bid_bond.addressee = data.addressee;
                        this.bid_bond.start_date = data.effective_date;
                        this.bid_bond.template = data.secret;
                        this.bid_bond.counter_party = data.counterparty;
                    }
                    this.step < 3 ? this.step++ : this.step;

                });
            },
            step1(bid_bond) {
                this.bid_bond = bid_bond;
                this.searchTender();
                this.fetchCompanyDetail(this.bid_bond.company.company_unique_id);
            },
            step2(bid_bond) {
                this.bid_bond = this.extend(this.bid_bond, bid_bond);
                this.step = 3;
            },
            step3(bid_bond) {
                this.bid_bond = this.extend(this.bid_bond, bid_bond);
                this.calculatePricing();
                this.step = 4;
            },
            step4() {
                this.step = 5;
            },
            selectTemplate(secret) {
                this.$route.params.tender_number ? this.update(secret) : this.save(secret);
            },
            save(secret) {
                this.bid_bond.template = secret;
                this.bid_bond.start_date = moment(this.bid_bond.start_date).format('YYYY-MM-DD');
                const bond = (({company, counter_party, ...o}) => o)(this.bid_bond); //remove counterparty,company from bidbond
                console.log(bond);
                bond.company = (!this.isEmpty(this.bidbond)) ? this.bidbond.company_id : this.getCompany.company_unique_id;
                bond.counter_party = this.bid_bond.counter_party.id;
                bond.tender_number = this.getTender;
                bond.currency = 'KES';

                axios.post('/api/v1/bid-bonds', bond).then(response => {
                    if (response.data.error) {
                        this.error = response.data.error;
                    }
                    this.$router.push({
                        name: 'bidbonds.payment',
                        params: {id: response.data.data.secret, co: bond.company}
                    })
                }).catch(error => {
                    this.error = error.response;
                });
            },
            update(secret) {
                this.bid_bond.template = secret;
                this.bid_bond.start_date = moment(this.bid_bond.start_date).format('YYYY-MM-DD');
                const bond = (({company, counter_party, ...o}) => o)(this.bid_bond); //remove counterparty,company from bidbond
                bond.company = (!this.isEmpty(this.bidbond)) ? this.bidbond.company_id : this.getCompany.company_unique_id;
                bond.counter_party = this.bid_bond.counter_party.id;
                bond.tender_number = this.getTender;
                bond.currency = 'KES';
                axios.put(`/api/v1/bid-bonds/${this.bidbond.id}`, bond).then(response => {
                    if (response.data.error) {
                        this.error = response.data.error;
                    } else {
                        toastr.success('The Bid Bond has been updated.', 'Saved');
                    }
                    this.$router.push({
                        name: 'bidbonds.payment',
                        params: {id: response.data.data.secret, co: bond.company}
                    })
                }).catch(error => {
                    this.error = error.response;
                });
            },
        },
        computed: {
            ...mapGetters({
                getCompany: 'getCompany',
                getTender: 'getTender',
                counter_parties: 'getCounterParties',
                bidbond: 'getBidbond'
            }),
        },
        watch: {
            bidbond() {
                this.bid_bond = this.bidbond;
                this.bid_bond.tender_purpose = this.bidbond.purpose;
                this.bid_bond.tender_number = this.bidbond.tender_no;
                this.bid_bond.template = this.bidbond.template_secret;
                this.bid_bond.start_date = this.bidbond.effective_date;
                this.bid_bond.end_date = this.bidbond.expiry_date;
                this.bid_bond.company = {
                    name: this.bidbond.bid_company.name,
                    company_unique_id: this.bidbond.company_id,
                    balance: this.bidbond.bid_company.balance,
                    limit: this.bidbond.bid_company.limit,
                }
            },
            getCompany() {
                return this.getCompany;
            },
            getTender() {
                this.fetch();
                return this.getTender;
            },
            counter_parties() {
                if (!this.isEmpty(this.bidbond)) {
                    this.bid_bond.counter_party = this.counter_parties.find(c => c.id == this.bidbond.counter_party_id)
                }
                return this.counter_parties;
            }
        }
    }
</script>
