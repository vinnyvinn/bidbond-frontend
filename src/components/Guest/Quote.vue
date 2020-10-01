<template>
    <div>
        <h4>BID QUOTE</h4>
        <div class="form-container">
            <form @submit.prevent="validateForm" v-if="step == 1">
                <div v-html="$error.handle(error)"></div>
                <br>
                <div class="form-group">
                    <select v-model="quote.tenure" class="form-control-input notEmpty"
                            name="tenure_duration" v-validate="'required'" autofocus>
                        <option value="0">Select Tenure Duration</option>
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                        <option value="90">90 Days</option>
                        <option value="120">120 Days</option>
                        <option value="150">150 Days</option>
                        <option value="180">180 Days</option>
                        <option value="210">210 Days</option>
                        <option value="365">365 Days</option>
                    </select>
                    <label class="label-control" for="tenure_duration">Tenure Duration</label>
                    <div class="help-block with-errors text-danger" v-if="errors.has('tenure_duration')">
                        {{errors.first('tenure_duration')}}
                    </div>
                </div>

                <div class="form-group">
                    <v-select :options="counter_parties" name="counterparty" label="name"
                              v-model="selected_counter_party"
                              placeholder="Select Counter Party" v-validate="'required'"></v-select>
                    <div class="help-block with-errors text-danger" v-if="errors.has('counterparty')">
                        {{errors.first('counterparty')}}
                    </div>
                </div>

                <div class="form-group">
                    <vue-numeric name="amount" class="form-control-input notEmpty" v-validate="'required'"
                                 v-model="quote.amount"/>
                    <label class="label-control" for="amount">Bid Amount (KSHS)</label>
                    <div class="help-block with-errors text-danger" v-if="errors.has('amount')">
                        {{errors.first('amount')}}
                    </div>
                </div>

                <div class="form-group">
                    <input type="email" name="email" autocomplete="email" v-validate="'required|email'"
                           :class="{'notEmpty': quote.email}" class="form-control-input" v-model="quote.email"/>
                    <label class="label-control" for="email">Email</label>
                    <div class="help-block with-errors text-danger" v-if="errors.has('email')">
                        {{errors.first('email')}}
                    </div>
                </div>

                <div class="form-group">
                    <input type="text" name="phone" class="form-control-input" autocomplete="tel-national"
                           v-validate="'required|min:10|max:15'"
                           :class="{'notEmpty': quote.phone}" v-model="quote.phone"/>
                    <label class="label-control" for="phone">Phone</label>
                    <div class="help-block with-errors text-danger" v-if="errors.has('phone')">
                        {{errors.first('phone')}}
                    </div>
                </div>

                <div class="form-group checkbox">
                    <input type="checkbox" name="terms" value="1" checked="checked" v-model="terms"
                           v-validate="'required'"/>
                    <label for="terms">I have Read and understood the <a href="#" @click.prevent="show_terms=true">Terms
                        & Conditions</a></label>
                    <div class="text-danger" v-if="errors.has('terms')">{{errors.first('terms')}}</div>
                </div>
                <div class="form-group">
                    <button class="form-control-submit-button" name="submit" type="submit">Submit</button>
                </div>
            </form>

            <template v-if="step == 2">
                <div class="sent">
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
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="#" @click.prevent="sendMail" class="btn btn-outline-success"><i
                                class="fa fa-envelope"></i> SEND
                            QUOTE TO MAIL</a>
                        <br>
                        <p style="margin: 20px 0;">OR</p>
                        <a href="#" @click.prevent="generateBid" class="btn btn-outline-info">GENERATE BIDBOND</a>
                    </div>
                </div>
            </template>

            <template v-if="step == 3">
                <div class="sent">
                    <h4>Success!</h4>
                    <p style="margin: 20px 0;">Your quote has been generated and sent to {{ quote.email }}</p>
                    <router-link :to="{ name: 'login' }" class="btn btn-primary">GENERATE BIDBOND</router-link>
                </div>
            </template>

            <modal :showModal="show_terms" @close="show_terms=false">
                <template v-slot:header>
                    <h5>Terms and Conditions</h5>
                </template>
                <terms-and-conditions/>
                <hr>
                <div class="form-group">
                    <a href="#" class="btn btn-primary" @click.prevent="show_terms = false; terms=1">Accept Terms and
                        Conditions</a>
                    <a href="#" class="btn btn-danger pull-right" @click.prevent="show_terms = false">Cancel</a>
                </div>
            </modal>
        </div>
    </div>
</template>

<script>
    import TermsAndConditions from "@/components/Guest/Terms.vue";

    export default {
        components: {
            TermsAndConditions
        },

        mounted() {
            this.fetch();
        },

        data() {
            return {
                quote: {
                    tenure: 0,
                    amount: '',
                    counterparty: '',
                    email: '',
                    phone: ''
                },
                terms: '',

                step: 1,
                price: {},
                show_terms: false,
                error: '',
                selected_counter_party: ''
            }
        },

        methods: {
            fetch() {
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
                if (this.selected_counter_party.id) {
                    this.quote.counterparty = this.selected_counter_party.id;
                    axios.post('/api/v1/quote', this.quote).then(response => {
                        this.price = response.data;
                        this.step = 2;
                        this.error = '';
                    }).catch(error => {
                        this.error = error.response;
                    });
                }
            },

            sendMail() {
                axios.post('/api/v1/send-quote', this.quote).then(response => {
                    this.price = response.data;
                    this.step = 3;
                }).catch(error => {
                    this.error = error.response;
                });
            },
            generateBid: function () {
                this.$swal({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Login to generate a bidbond',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    this.$router.replace({name: 'login'});
                });
            }
        },
        computed: {
            counter_parties() {
                return this.$store.getters.getCounterParties;
            },
        }
    }
</script>
