<template>
    <div class="quote">
        <fieldset>
            <legend class="text-info">Request a Quote</legend>
            <div v-html="$error.handle(error)"></div>
            <form @submit.prevent="validateForm" v-if="step == 1">
                <div class="form-group">
                    <label>Procuring Entity</label>
                    <v-select :options="counter_parties" name="counterparty" label="name" v-model="quote.counterparty"
                              :reduce="c => c.id" :class="{'is-invalid': errors.has('counterparty') }"
                              placeholder="Select Counter Party" v-validate="'required'"></v-select>
                    <div :class="{'invalid-feedback': errors.has('counterparty')}">
                        {{errors.first('counterparty')}}
                    </div>
                </div>
                <div class="form-group">
                    <label>Bid Amount</label>
                    <vue-numeric v-model="quote.amount" name="amount" class="form-control" :class="{'is-invalid': errors.has('amount') }" v-validate="'required'"/>
                    <div :class="{'invalid-feedback': errors.has('amount')}">
                        {{errors.first('amount')}}
                    </div>
                </div>
                <div class="form-group">
                    <label for="tenure_duration">Tenure Period</label>
                    <select class="form-control" :class="{'is-invalid': errors.has('tenure_duration') }" name="tenure_duration" v-model="quote.tenure" v-validate="'required'">
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                        <option value="90">90 Days</option>
                        <option value="120">120 Days</option>
                        <option value="180">180 Days</option>
                        <option value="210">210 Days</option>
                        <option value="365">365 Days</option>
                    </select>
                    <div :class="{'invalid-feedback': errors.has('tenure_duration')}">
                        {{errors.first('tenure_duration')}}
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-check">
                        <input class="form-check-input" :class="{'is-invalid': errors.has('terms') }"
                               type="checkbox" v-model="terms" value="1" name="terms"
                               v-validate="'required'">
                        <label class="form-check-label" for="terms">
                            I have read the <a href="#" @click.prevent="show_terms=true">terms
                            and conditions.</a>
                        </label>
                        <div :class="{'invalid-feedback': errors.has('terms') }">
                            {{errors.first('terms')}}
                        </div>
                    </div>
                </div>

                <div class="form-group" style="text-align: right;">
                    <a class="btn btn-info pull-left" v-if="step>1" href="#" @click.prevent="step=1">Back</a>
                    <button type="submit" class="btn btn-primary">Request Quote</button>
                </div>
            </form>
            <div class="container">
                <template v-if="step == 2">
                    <h4>Success!</h4>
                    <p>The quotation of KES {{ $number.format(quote.amount) }} is:</p>
                    <table class="table">
                        <tbody>
                        <tr>
                            <td>Bidbond charge</td>
                            <td>{{ $number.format(price.bid_bond_charge) }}</td>
                        </tr>
                        <tr>
                            <td>Excise duty</td>
                            <td>{{ $number.format(price.excise_duty) }}</td>
                        </tr>
                        <tr>
                            <td>Indemnity charge</td>
                            <td>{{ $number.format(price.indemnity_cost) }}</td>
                        </tr>
                        <tr>
                            <td><strong>Total</strong></td>
                            <td><strong>KES {{ $number.format(price.total) }}</strong></td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="col">
                        <a href="#" @click.prevent="sendMail" class="btn btn-outline-primary mr-2"><i
                                class="fa fa-envelope"></i>
                            SEND QUOTE TO MAIL</a>
                        OR
                        <router-link :to="{ name: 'bidbonds.create' }"
                                     class="btn btn-outline-info ml-2"><i class="fa fa-hand-o-up"></i> GENERATE BIDBOND
                        </router-link>
                    </div>
                </template>
                <template v-if="step == 3">
                    <h4>Success!</h4>
                    <p>Your quote has been generated and sent to {{ quote.email }}</p>
                    <router-link :to="{ name: 'bidbonds.create' }"
                                 class="btn btn-primary">GENERATE BIDBOND
                    </router-link>
                </template>
            </div>
        </fieldset>
        <modal :showModal="show_terms" @close="show_terms=false">
            <template v-slot:header>
                <h5>Terms and Conditions</h5>
            </template>
            <div>
                <terms/>
            </div>
            <hr>
            <div class="form-group">
                <a href="#" class="btn btn-primary" @click.prevent="show_terms = false; terms=1">Accept Terms and
                    Conditions</a>
                <a href="#" class="btn btn-danger pull-right" @click.prevent="show_terms = false">Cancel</a>
            </div>
        </modal>
    </div>
</template>

<script>
    import Terms from "../../../views/Terms.vue";

    export default {
        components: {
            Terms
        },
        mounted() {
            this.fetchCounterParties();
        },

        data() {
            return {
                quote: {
                    tenure: '',
                    amount: '',
                    counterparty: '',
                    email: '',
                    phone: '',
                    country: 'kenya'
                },
                terms: '',
                step: 1,
                price: {},
                show_terms: false,
                error: ''
            }
        },

        methods: {
            fetchCounterParties() {
                if (!this.counter_parties.length) {
                    this.$store.dispatch("fetchCounterParties").then(() => {
                        this.loading = false;
                    });
                }
            },
            validateForm() {
                return this.$validator.validateAll().then(result => {
                    if (result) {
                        this.request();
                    }
                });
            },
            request() {
                this.quote.email = this.$store.getters.getAuthUser.email;
                this.quote.phone = this.$store.getters.getAuthUser.phone_number;
                axios.post('/api/v1/quote', this.quote).then(response => {
                    this.price = response.data;
                    this.step = 2;
                    this.error = '';
                }).catch(error => {
                    this.error = error.response;
                });
            },

            sendMail() {
                axios.post('/api/v1/send-quote', this.quote).then(response => {
                    this.price = response.data;
                    this.step = 3;
                }).catch(error => {
                    this.error = error.response;
                });
            }
        },
        computed: {
            counter_parties() {
                return this.$store.getters.getCounterParties;
            },
        },
    }
</script>
