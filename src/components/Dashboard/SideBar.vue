<template>
    <div class="side-bar">
        <div class="title">
            <a href="#" @click.prevent="$emit('toggle')" class="side-bar-toggle pull-right"><i
                    class="fa fa-arrow-left"></i></a>
            <div class="logo text-center">
                <router-link :to="{ name: 'dashboard' }"><img src="/defaults/logo.png" alt=""></router-link>
            </div>
            <div class="back" v-if="$route.name !== 'dashboard'">
                <a href="#" @click.prevent="$router.go(-1)"><i class="fa fa-arrow-left"></i> Back to previous</a>
            </div>
        </div>
        <div class="featured" v-if="$can.view($store.getters.getAuthUser, 'view-commission-balance')">
           <router-link :to="{ name: 'commission.index' }" class="btn btn-featured btn-block">Commission: <span
            style="color: #404040; font-weight: bold;">KES {{ $number.format($store.getters.getAuthUser.commision) }}</span></router-link>
        </div>

        <div class="featured" v-if="$can.view($store.getters.getAuthUser, 'view-wallet-balance')">
          <div v-if="show_wallet==true">
            <router-link :to="{ name: 'wallet.agent.topup' }" v-if="$store.getters.getAuthUser.role == 'agent'" class="btn btn-featured btn-block">Wallet: asqw<span
              style="color: #404040; font-weight: bold;">KES {{ $number.format(getAccountBalance) }}</span>
            </router-link>
             <router-link :to="{ name: 'wallet.topup' }" v-else class="btn btn-featured btn-block">Wallet: here  {{show_wallet}}<span
                 style="color: #404040; font-weight: bold;">KES {{ $number.format(getAccountBalance) }}</span>
             </router-link>
           </div>
           <div v-else>
             <button class="btn btn-featured btn-block">
               Wallet: <span
                 style="color: #404040; font-weight: bold;">KES {{ $number.format(getAccountBalance) }}</span>
             </button>
           </div>


<!--            <router-link :to="{ name: 'wallet.topup' }" v-else class="btn btn-featured btn-block">Wallet: <span-->
<!--                    style="color: #404040; font-weight: bold;">KES {{ $number.format($store.getters.getAuthUser.balance) }}</span>-->
<!--            </router-link>-->
        </div>
        <div class="menu">
            <ul>
                <li v-if="$can.view($store.getters.getAuthUser, 'list-companies')">
                    <router-link :to="{ name: 'companies.index' }">
                        <div class="icon"><i class="fa fa-circle-o"></i></div>
                        <div class="link">
                            <p class="title">Manage Companies</p>
                            <p class="small">Track your companies in real time</p>
                        </div>
                    </router-link>
                </li>
                <li v-if="list_bidbonds">
                    <router-link :to="{ name: 'bidbonds.index' }">
                        <div class="icon"><i class="fa fa-check"></i></div>
                        <div class="link">
                            <p class="title">Manage BidBonds</p>
                            <p class="small">Manage bidbonds dashboard</p>
                        </div>
                    </router-link>
                </li>
                <li v-if="list_payments">
                    <router-link :to="{ name: 'payments.index' }">
                        <div class="icon"><i class="fa fa-money"></i></div>
                        <div class="link">
                            <p class="title">Manage Payments</p>
                            <p class="small">Keep track of your wallet.</p>
                        </div>
                    </router-link>
                </li>
                <li v-if="$can.view($store.getters.getAuthUser, 'list-users')">
                    <router-link :to="{ name: 'users.index' }">
                        <div class="icon"><i class="fa fa-users"></i></div>
                        <div class="link">
                            <p class="title">Manage Users</p>
                            <p class="small">Manage system users.</p>
                        </div>
                    </router-link>
                </li>
                <li v-if="$can.view($store.getters.getAuthUser, 'list-agents')">
                    <router-link :to="{ name: 'agents.index' }">
                        <div class="icon"><i class="fa fa-users"></i></div>
                        <div class="link">
                            <p class="title">Manage Agents</p>
                            <p class="small">JBid Agents.</p>
                        </div>
                    </router-link>
                </li>
                <li v-if="$can.view($store.getters.getAuthUser, 'list-quotes')">
                    <router-link :to="{ name: 'quotes.index' }">
                        <div class="icon"><i class="fa fa-arrow-right"></i></div>
                        <div class="link">
                            <p class="title">Quotes</p>
                            <p class="small">Quotes Requested.</p>
                        </div>
                    </router-link>
                </li>
                <li v-if="$can.view($store.getters.getAuthUser, 'marketing')">
                    <router-link :to="{ name: 'marketing' }">
                        <div class="icon"><i class="fa fa-arrow-right"></i></div>
                        <div class="link">
                            <p class="title">Marketing</p>
                            <p class="small">Send messages to users.</p>
                        </div>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'reports.quotes' }">
                        <div class="icon"><i class="fa fa-bar-chart"></i></div>
                        <div class="link">
                            <p class="title">Reports center</p>
                            <p class="small">Generate reports</p>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="options">
            <ul>
                <li v-if="$can.view($store.getters.getAuthUser, 'manage-settings')">
                    <router-link :to="{ name: 'settings' }"><i class="fa fa-cog"></i>System Settings</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'whats-new' }"><i class="fa fa-question"></i>Whats new?</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'help' }"><i class="fa fa-user"></i>JBid Support</router-link>
                </li>
            </ul>
        </div>
        <div class="buttons">
            <router-link :to="{ name: 'whats-new' }" class="btn btn-sidebar">STATUS</router-link>
            <router-link :to="{ name: 'terms-conditions' }" class="btn btn-sidebar">TERMS</router-link>
        </div>
        <modal :showModal="show_terms" @close="show_terms=false">
            <template v-slot:header>
                <h5>Terms and Conditions</h5>
            </template>
            <terms/>
        </modal>
    </div>
</template>

<script>
    import Terms from "@/components/Guest/Terms.vue";
    import {mapGetters} from 'vuex';
    export default {
      data(){
        return {
          show_wallet:process.env.VUE_APP_SHOW_WALLET,
          show_terms: false,
        }
      },
        created() {
          this.$store.dispatch('setAccountBalance');
          },
        components: {
            Terms
        },
        watch:{
            getAccountBalance(){
            return this.getAccountBalance;
            }
        },
        computed: {
          ...mapGetters(['getAccountBalance']),
           list_bidbonds() {
              return this.$can.view(this.$store.getters.getAuthUser, 'list-companies') || this.$can.view(this.$store.getters.getAuthUser, 'list-companies-owned')
            },
            list_payments(){
                return this.$can.view(this.$store.getters.getAuthUser, 'list-payments') || this.$can.view(this.$store.getters.getAuthUser, 'list-payments-owned')
            },
        }
    }
</script>

<style lang="scss">
    @import "../../styles/variables";

    .side-bar {
        padding: 10px;
        .side-bar-toggle {
            display: none;

            @media (max-width: 480px) {
                display: block;
            }
        }

        .title {
            border-bottom: solid 1px #ddd;
            padding-bottom: 10px;

            .logo {
                height: 80px;

                img {
                    width: auto;
                    height: 100%;
                }
            }

            .back {
                padding-top: 20px;
                padding-left: 20px;

                a {
                    color: gray;
                }

                i {
                    margin-right: 10px;
                    color: $primary;
                }
            }
        }

        .featured {
            margin: 40px auto;
        }

        .menu {
            ul {
                list-style: none;
                padding: 0;

                li {
                    a {
                        display: block;
                        color: $black;

                        .icon {
                            display: inline-block;
                            width: 20%;
                            vertical-align: super;
                            text-align: center;
                            font-size: 24px;
                        }

                        .link {
                            display: inline-block;
                            width: 80%;

                            .title {
                                font-size: 14px;
                                padding: 0;
                                border-bottom: none;
                                margin-bottom: 0;
                                font-weight: bold;
                            }

                            .small {
                                font-size: 12px;
                                padding: 0;
                                border-bottom: none;
                                color: $gray;
                            }
                        }
                    }
                }
            }
        }

        .options {
            margin-top: 100px;

            ul {
                list-style: none;
                padding: 0;

                li {
                    a {
                        display: block;
                        color: $gray;
                        border-bottom: solid 1px #ddd;
                        padding: 10px;

                        i {
                            margin-right: 15px;
                        }
                    }
                }
            }
        }

        .buttons {
            .btn-sidebar {
                font-size: 10px;
                background: #eee;
                margin: 5px;
            }
        }
    }
</style>
