<template>
    <div class="card" id="company-payment">
        <div v-html="$error.handle(error)"></div>
        <nav>
            <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                <a :class="['nav-item nav-link',{active:isActiveApply}]" id="nav-profile-tab" data-toggle="tab" href="#nav-profile"
                   role="tab" aria-controls="nav-profile" aria-selected="true">Apply
                  Bid Bond</a>
                <a  :class="['nav-item nav-link',{active:isActiveTopup}]" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab"
                   aria-controls="nav-home" aria-selected="false">TopUp Wallet via MPesa</a>
            </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                <div style="padding: 3rem;">
                    <h4>Available Balance: KES {{$number.format(getAccountBalance)}}</h4>
                    <p>Cost: KES {{ $number.format(amount) }} </p>
                    <template v-if="getAccountBalance >=amount  && ($store.getters.getAuthUser.role=='agent'|| $store.getters.getAuthUser.role=='customer')">
                        <a href="#" v-if="!loading" @click.prevent="applyBidbond" class="btn btn-primary">Apply
                            Bid Bond</a>
                        <a href="#" v-if="payment_waiting"
                           class="btn btn-primary btn-loading">Processing
                            Payment...</a>
                    </template>
                </div>
            </div>
            <div class="tab-pane fade" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                <div class="mpesa">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="stk-push">
                                <h6>Option One</h6>
                                <p>Enter amount and your phone number (07XXXXXXXX) to receive a payment request on your phone. All
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
                                  <div class="form-group">
                                        <label>Amount</label>
                                        <input type="number" class="form-control" name="amount"
                                               v-validate="'required'"
                                               v-model="expected_amount" data-vv-scope="form1"
                                               :class="{'is-invalid': errors.has('form1.expected_amount')}">
                                        <div :class="{'invalid-feedback': errors.has('form1.expected_amount')}">
                                            {{errors.first('form1.expected_amount')}}
                                        </div>
                                    </div>
                                    <div class="form-group" v-if="!exceeds_mpesa">
                                        <a href="#" v-if="stk_waiting" @click.prevent="requestSTK"
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
                                    <li>Enter account number <strong>{{ account_no }}</strong></li>
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
                                        <a href="#" v-if="loading" @click.prevent="confirmTrx"
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
    import {mapGetters} from 'vuex';
      export default {
        mounted() {
            this.fetch();
            this.fetchBalance();
        },
        data() {
            return {
                error: '',
                stk_phone_number: '',
                expected_amount: '',
                transaction_code: '',
                amount: '',
                balance: 0,
                stk_waiting: false,
                payment_waiting: false,
                loading: false,
                tender_no: '',
                account_no:'',
                isActiveApply:true,
                isActiveTopup:false
            }
        },
           methods: {
            applyBidbond(){
              var data = {company:this.$route.params.co,tender_no:this.tender_no,total:this.amount,
                user:this.$store.getters.getAuthUser.id,
                role:this.$store.getters.getAuthUser.role,
                bidbond:this.$route.params.id,
                currency:'KES'
              }
              this.payment_waiting = true;
              this.loading = true
               axios.post('/api/v1/initiate-wallet-payment-atm',data)
                    .then(response => {
                      if (response.data.status === 'success') {
                        toastr.success(response.data.message);
                        this.$store.dispatch('setAccountBalance');
                        this.payment_waiting = false;
                        this.loading = false
                        this.checkExists();
                      } else {
                        toastr.error(response.data.message);
                      }
                    }).catch(err => {
                  toastr.error(err.response.data.error.message);
                });

            },
            fetch() {
                axios.post('/api/v1/bidbond-cost', {
                    secret: this.$route.params.id
                }).then(response => {
                    this.account_no = response.data.account;
                    this.amount = response.data.pricing.total;
                    this.tender_no = response.data.tender;
                });
            },
            fetchBalance() {
              this.$store.dispatch('setAccountBalance');
                axios.post('/api/v1/wallet/balance', {
                    company: this.$route.params.co
                }).then(response => {
                    this.balance = response.data.balance;
                }).catch(err => {
                    this.error = err.response;
                });
            },
            payWithWallet() {
                const self = this;
                axios.post('/api/v1/initiate-wallet-payment', {
                    company: this.$route.params.co,
                    bidbond: this.$route.params.id,
                    amount: this.expected_amount
                }).then(response => {
                    if (response.data.status === 'success') {
                        toastr.success(response.data.message);
                        this.checkExists();
                    } else {
                        toastr.error(response.data.message);
                    }
                }).catch(err => {
                    toastr.error(err.response.data.error.message);
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
                this.error = "";
                this.stk_waiting = true;
                axios.post('/api/v1/initiate-stk', {
                    phone: this.stk_phone_number,
                    account: 'BP' + this.account,
                    real_account: this.account_no,
                    amount: this.expected_amount
                }).then(() => {
                    this.confirmPayment();
                });
            },
            confirmPayment() {
                const self = this;
                let attempts = 0;
                self.loading = true;
                let interval = setInterval(function () {
                    axios.post('/api/v1/confirm-payment', {
                        account: 'BP' + self.account,
                        real_account: self.account_no,
                        transaction_code: self.$route.params.id
                    }).then(response => {
                        if (response.data.confirmed) {
                            self.stopInterval(interval);
                            toastr.info("Bid bond payment successfully received! Please wait while your bid bond is being generated");
                            self.$router.push({
                                name: 'bidbonds.show',
                                params: {id: self.$route.params.id, co: self.$route.params.co}
                            });
                        } else {
                            attempts += 1;
                            if (attempts === 10) {
                                self.stopInterval(interval);
                                attempts = 0;
                                toastr.error("Took too long to perform payment.Retry confirm", "Timeout");
                            }
                        }
                    }).catch(err => {
                        self.stk_waiting = false;
                        self.loading = false;
                        clearInterval(interval);

                        toastr.error(err.response.data.error.message);
                        self.stopInterval(interval);
                        this.error = err.response;
                    });
                }, 5000);
            },
            stopInterval(interval) {
                this.stk_waiting = false;
                this.loading = false;
                clearInterval(interval);
            },
            confirmTrx() {
                this.error = "";
                this.loading = true;
                axios.post('/api/v1/confirm-transaction', {
                  account: 'BP' + this.account,
                   real_account: this.account_no,
                   transaction_code: this.transaction_code
                }).then(response => {
                    if (response.data.confirmed) {
                      toastr.info("Account Topup payment successfully received! Please proceed to apply Bid bond.");
                      this.$store.dispatch('setAccountBalance');
                        ///this.checkExists();
                    } else {
                        this.loading = false;
                        toastr.error("Could not find this payment", "Payment not found");
                    }
                }).catch(err => {
                    this.loading = false;
                    this.error = err.response;
                });
            },
            checkExists() {
                toastr.info("Bid Bond payment successfully received!");
                this.notifyChecking();
                const self = this;
                let attempts = 0;
                let interv = setInterval(function () {
                    axios.post('/api/v1/bid-bonds/exists', {
                        secret: self.account
                    }).then(response => {
                        if (response.data.exists) {
                            clearInterval(interv);
                            toastr.info("Bid bond generation successfully!");
                            self.$router.push({
                                name: 'bidbonds.show',
                                params: {id: self.$route.params.id, co: self.$route.params.co}
                            });
                        } else {
                            attempts += 1;
                            if (attempts === 10) {
                                clearInterval(interv);
                                attempts = 0;
                                toastr.error("Bid Bond processing took too long.If you do not receive the bid bond in your email in the next 5 minutes contact support", "Bidbond Delay");
                                self.$router.push({ name: 'bidbonds.index' });
                            } else {
                                self.notifyChecking();
                            }
                        }
                    }).catch(err => {
                        self.stopInterval(interv);
                        self.error = err.response;
                    });
                }, 6000);
            },
            notifyChecking() {
                this.$swal({
                    title: 'Bid Bond Processing',
                    text: "Waiting for bid bond to complete processing ...",
                    icon: 'info',
                    timer: 6000,
                    timerProgressBar: true,
                });
            }
        },
        watch:{
          getAccountBalance(){
            if (this.getAccountBalance >= this.account){
              this.isActiveApply=true;
              this.isActiveTopup=false;
            }else {
              this.isActiveApply=false;
              this.isActiveTopup=true;
            }
          return this.getAccountBalance;
          }
        },
        computed: {
          ...mapGetters(['getAccountBalance']),
             account() {
              return this.$route.params.id;
            },
            exceeds_mpesa() {
                return this.amount > 1000000;
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
