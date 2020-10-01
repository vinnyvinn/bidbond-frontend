<template>
    <div class="dashboard">
        <template v-if="is_loaded">
            <h2>Dashboard</h2>
            <br>
            <div class="tiles">
                <div class="row">
                    <div class="col-md-3">
                        <div class="tile red">
                            <router-link :to="{ name: 'bidbonds.index' }">
                                <div class="tile-title">BidBonds</div>
                                <div class="tile-content">{{ $number.format(number_of_bidbonds) }}</div>
                            </router-link>
                        </div>
                    </div>
                    <div class="col-md-3" v-if="lists_quotes">
                        <div class="tile blue">
                            <router-link :to="{ name: 'quotes.index' }">
                                <div class="tile-title">Quotes</div>
                                <div class="tile-content">{{ $number.format(stats.quotes) }}</div>
                            </router-link>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="tile green">
                            <router-link :to="{ name: 'companies.index' }">
                                <div class="tile-title">Companies</div>
                                <div class="tile-content">{{ $number.format(number_of_companies) }}</div>
                            </router-link>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="tile yellow">
                            <router-link :to="{ name: 'counter-parties.index' }">
                                <div class="tile-title">CounterParties</div>
                                <div class="tile-content">{{ $number.format(stats.counter_parties) }}</div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="graphs" v-if="$can.view($store.getters.getAuthUser, 'view-graphs')">
                <div class="row">
                    <div class="col-md-6">
                        <div class="canvas">
                            <h4>Company Onboarding Report</h4>
                            <hr>
                            <line-graph :chartdata="companies_graph" :options="options"/>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="canvas">
                            <h4>BidBond Generation Report</h4>
                            <hr>
                            <line-graph :chartdata="bidbonds_graph" :options="options"/>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="row">
                <div class="col-md-6" v-if="lists_bidbonds">
                    <h5 class="mb-2">Latest bidbonds</h5>
                    <table class="table table-striped table-dash">
                        <thead>
                        <tr>
                            <th>BidBond Number</th>
                            <th>Company</th>
                            <th>Counter Party</th>
                            <th>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="bond in show_bidbonds">
                            <td>
                                <router-link v-if="bond.bidbond_paid"
                                             :to="{ name: 'bidbonds.show', params: { id: bond.bidbond_secret,co: bond.company_id }}">
                                    {{bond.bidbond_secret }}
                                </router-link>
                                <router-link v-else
                                             :to="{ name: 'bidbonds.create', params: { tender_no: bond.tender_number, company_id: bond.company_id }}">
                                    {{bond.bidbond_secret }}
                                </router-link>
                            </td>
                            <td>{{ bond.company_name }}</td>
                            <td>{{ bond.counter_party_name }}</td>
                            <td>{{ $number.format(bond.tender_amount) }}</td>
                        </tr>
                        <tr v-if="show_bidbonds.length == 0">
                            <td colspan="4">
                                <div class="alert alert-info">There are no bidbonds</div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-6">
                    <h5 class="mb-2">Companies</h5>
                    <table class="table table-striped table-dash">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Reg Number</th>
                            <template v-if="$store.getters.getAuthUser.role !== 'agent'">
                                <th>Approval Status</th>
                                <th>Payment Status</th>
                            </template>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="company in show_companies">
                            <td>
                                <router-link v-if="$store.getters.getAuthUser.role !== 'agent'"
                                             :to="{ name: 'companies.show', params: { id: company.company_unique_id  }}">
                                    {{ company.name }}
                                </router-link>
                                <template v-else> {{ company.name }}</template>
                            </td>
                            <td>{{ company.crp }}</td>
                            <template v-if="$store.getters.getAuthUser.role !== 'agent'">
                                <td>{{ company.approval_status }}</td>
                                <td>{{ company.paid ? 'Paid' : 'Unpaid' }}</td>
                            </template>
                        </tr>
                        <tr v-if="!show_companies.length">
                            <td colspan="4">
                                <div class="alert alert-info">There are no companies</div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
        <loading v-else/>
    </div>
</template>

<script>
    import LineGraph from "@/components/Dashboard/LineGraph";

    export default {
        components: {
            LineGraph
        },
        data() {
            return {
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                },
                companies_graph: {
                    labels: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
                    datasets: [
                        {
                            label: 'Companies',
                            backgroundColor: 'rgba(103, 58, 183, 0.5)',
                            data: [0, 0, 0, 0, 0, 0, 0]
                        }
                    ]
                },
                bidbonds_graph: {
                    labels: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
                    datasets: [
                        {
                            label: 'BidBonds',
                            backgroundColor: 'rgba(103, 58, 183, 0.5)',
                            data: [0, 0, 0, 0, 0, 0, 0]
                        }
                    ]
                },
                stats: {
                    quotes: 0,
                    counter_parties: 0
                },
                companies: [],
                bidbonds: [],
                is_loaded: false
            }
        },
        mounted() {
            this.fetch();
            this.fetchGraph();
        },
        methods: {
            fetch() {
                this.is_loaded = false;
                axios.get('/api/v1/dashboard-stats').then(response => {
                    this.stats.quotes = response.data.quotes;
                    this.stats.counter_parties = response.data.counter_parties;
                    this.companies = response.data.companies;
                    this.bidbonds = response.data.bidbonds;
                    this.is_loaded = true;
                });
            },
            fetchGraph() {
                if (!this.$can.view(this.$store.getters.getAuthUser, 'view-graphs')) {
                    return;
                }
                if (!bid_summary) {
                    this.$store.dispatch('fetchBidBondSummary', {
                        start: moment().add('week', '-1').toDate(),
                        end: moment().toDate()
                    });

                }
            },
            check_status() {
                if (this.user.id_number == null) {
                    this.$router.replace({name: 'verify.personal'});
                    return;
                }
                if (!this.user.verified_phone) {
                    this.$router.replace({name: 'verify.phone'});
                    return;
                }
            },
        },
        computed: {
            user() {
                return this.$store.getters.getAuthUser;
            },
            bid_summary() {
                return this.$store.getters.getBidbondSummary;
            },
            show_bidbonds() {
                return this.bidbonds.slice(0, 5);
            },
            show_companies() {
                return this.companies.slice(0, 5);
            },
            number_of_companies() {
                return this.companies.length;
            },
            number_of_bidbonds() {
                return this.bidbonds.length;
            },
            lists_bidbonds() {
                return this.$can.view(this.$store.getters.getAuthUser, 'list-bidbonds') || this.$can.view(this.$store.getters.getAuthUser, 'list-bidbonds-owned')
            },
            lists_quotes() {
                return this.$can.view(this.$store.getters.getAuthUser, 'list-quotes') || this.$can.view(this.$store.getters.getAuthUser, 'list-quotes-owned')
            }
        },
        watch: {
            bid_summary() {
                if (this.bid_summary.length) {
                    let dates = this.bid_summary.map(x => moment(x.date).format('ddd'));
                    this.bidbonds_graph.labels = dates;
                    this.bidbonds_graph.datasets[0].data = this.bid_summary.map(x => x.bidbonds);
                    this.companies_graph.labels = dates;
                    this.companies_graph.datasets[0].data = this.bid_summary.map(x => x.companies);
                }
            },
            user() {
                this.check_status();
            }
        }
    }
</script>

<style lang="scss">
    @import "../../styles/variables";

    .graphs {
        .canvas {
            box-shadow: 0 0 2px #aaa;
            padding: 20px;

            h4 {
                font-size: 14px;
            }
        }
    }
</style>
