<template>
    <div class="card" id="company-payment">
        <nav>
            <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
               <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab"
                aria-controls="nav-home" aria-selected="false">Pay via MPesa</a>
            </div>
            <div v-html="$error.handle(error)"></div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade  show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                <div class="mpesa">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="stk-push">
                                <h6>Option One</h6>
                                <p>Enter your phone number (07XXXXXXXX) to receive a payment request on your phone. All
                                    you have to do is input your m-pesa pin.</p>
                                <form @submit.prevent="validateForm('form1')" data-vv-scope="form1">
                                    <div class="form-group">
                                        <label>Phone Number</label>
                                        <input type="number" class="form-control" name="phone"
                                               v-validate="'required|digits:10'"
                                               v-model="stk_phone_number" data-vv-scope="form1"
                                               :class="{'is-invalid': errors.has('form1.phone')}">
                                        <div :class="{'invalid-feedback': errors.has('form1.phone')}">
                                            {{errors.first('form1.phone')}}
                                        </div>
                                    </div>
                                    <div class="form-group" v-if="!exceeds_mpesa">
                                        <a href="#" v-if="confirming" @click.prevent="requestSTK"
                                           class="btn btn-primary pull-right btn-loading">
                                            <i class="fa fa-spin fa-spinner"></i>
                                            Waiting for payment...
                                        </a>
                                        <button v-else type="submit"
                                                class="btn btn-primary pull-right">Request Payment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="manual">
                                <h6>Option Two</h6>
                                <p>Follow the instructions below:</p>
                                <ul>
                                    <li>Go to m-pesa menu</li>
                                    <li>Select lipa na mpesa</li>
                                    <li>Select pay bill</li>
                                    <li>Enter paybill number <strong>{{ mpesa_paybill }}</strong></li>
                                    <li>Enter account number <strong>CP{{ account_number }}</strong></li>
                                    <li>Enter the amount <strong>{{ $number.format(amount) }}</strong></li>
                                    <li>Enter your pin and send</li>
                                </ul>
                                <p>Once you receive the confirmation SMS, enter the transaction code in the box
                                    below</p>
                                <form @submit.prevent="validateForm('form2')" data-vv-scope="form2">
                                    <div class="form-group">
                                        <label>Transaction Code</label>
                                        <input type="text" v-validate="'required'" name="transaction_code"
                                               v-model="transaction_code" placeholder="XXXXXX"
                                               class="form-control"
                                               :class="{'is-invalid': errors.has('form2.transaction_code')}">
                                        <div :class="{'invalid-feedback': errors.has('form2.transaction_code')}">
                                            {{errors.first('form2.transaction_code')}}
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <a href="#" v-if="confirming" @click.prevent="confirmTrx"
                                           class="btn btn-primary pull-right btn-loading"><i
                                                class="fa fa-spin fa-spinner"></i> Verifying payment</a>
                                        <button v-else type="submit" class="btn btn-primary pull-right">Verify
                                            Payment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('cool')
            this.fetch();
        },
        data() {
            return {
                stk_phone_number: '',
                amount: '',
                confirming: false,
                transaction_code: '',
                error: ''
            }
        },
        methods: {
            fetch() {
                axios.get('/api/v1/company-registration-details').then(response => {
                    this.amount = response.data.amount;
                });
            },
            validateForm(scope) {
                return this.$validator.validateAll(scope).then(result => {
                    if (result) {
                        if (scope === 'form1') this.requestSTK();

                        if (scope === 'form2') this.confirmTrx()
                    }
                });
            },
            requestSTK() {
                this.confirming = true;
                axios.post('/api/v1/initiate-stk', {
                    phone: this.stk_phone_number,
                    account: 'CP' + this.account_number,
                    real_account:'CP' + this.account_number,
                    amount: this.amount
                }).then(() => {
                    this.confirmPayment();
                });
            },

            confirmTrx() {
                this.error = '';
                this.confirming = true;
                axios.post('/api/v1/confirm-transaction', {
                    account: 'CP' + this.account_number,
                    transaction_code: this.transaction_code
                }).then(response => {
                    if (response.data.confirmed) {
                        this.companysearch();
                        this.confirming = false;
                    } else {
                        this.confirming = false;
                        toastr.error("Could not find this payment", "Payment not found");
                    }
                }).catch(err => {
                    this.confirming = false;
                    toastr.error(err.response.data.error.message);
                    this.error = err.response;
                });
            },

            confirmPayment() {
                const self = this;
                let attempts = 0;
                let interval = setInterval(function () {
                    axios.post('/api/v1/confirm-payment', {
                        account: 'CP' + self.account_number
                    }).then(response => {
                        if (response.data.confirmed) {
                            clearInterval(interval);
                            self.companysearch();
                        } else {
                            attempts += 1;
                            if (attempts === 10) {
                                clearInterval(interval);
                                attempts = 0;
                                self.confirming = false;
                                toastr.error("Took too long to perform payment.Retry confirm", "Timeout");
                            }
                        }
                    }).catch(err => {
                        clearInterval(interval);
                        toastr.error(err.response.data.error.message);
                    });
                }, 5000);
            },
            companysearch() {
                axios.get('/api/v1/companysearch/' + this.$route.params.id).then(response => {
                    if (response.data.remaining_directors === 0) {
                        toastr.success('The company search was successful.', 'Success');
                    } else {
                        toastr.success('The company search was successful. You may now add directors', 'Success');
                    }
                    this.$router.push({name: 'companies.directors.create', params: {id: this.$route.params.id}});
                }).catch(error => {
                    toastr.warning(error.response.data, 'Error');
                    if (error.response.data == "You have already performed this search before!") {
                        this.$router.push({name: 'companies.directors.create', params: {id: this.$route.params.id}});
                    }
                });
            }
        },
        computed: {
            account_number() {
                return this.$route.params.id;
            },
            exceeds_mpesa() {
                return this.amount > 70000;
            },
            mpesa_paybill() {
                return process.env.VUE_APP_MPESA_PAYBILL;
            }
        }
    }
</script>

<style lang="scss">
    #company-payment {
        .mpesa {
            padding: 20px 0;

            .manual {
                border-left: 1px dotted #aaa;
                padding-left: 20px;

                @media (max-width: 480px) {
                    border-top: solid 1px #ddd;
                    margin-top: 30px;
                    padding-top: 10px;
                    border-left: none;
                    padding-left: 0;
                }
            }
        }
    }
</style>
