<template>
    <div>
        <h4 class="sub-heading">Bid Bond Expiry</h4>
        <bar-chart :bid_expiry="bid_expiry"></bar-chart>
        <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <div class="form-group" style="margin-right: 10px">
                <label class="fs">Start Date</label>
                <date-picker v-model="start.date" required format="yyyy-MM-dd" input-class="form-control bg-white"/>
            </div>
            <div class="form-group">
                <label class="fs">End Date</label>
                <date-picker v-model="to.date" required format="yyyy-MM-dd" input-class="form-control bg-white"/>
            </div>
            <div class="form-group">
                <download-excel
                        :data="bid_expiry"
                        :title="'BidBond Expiry'"
                        v-if="bid_expiry.length"
                        name="bidBondExpiry_summary.xlsx"
                        class="btn btn-primary pull-right export-btn">
                    <i class="fa fa-file-excel-o"></i> Export Excel
                </download-excel>
            </div>
        </v-card-title>
        <v-data-table
                :headers="headers"
                :items="bid_expiry"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :search="search"
                item-key="id"
                class="elevation-1">
        </v-data-table>
    </div>
</template>

<script>
    import DatePicker from 'vuejs-datepicker';
    import barChart from "./BarChart";
    import FieldDefs from "./FieldDefs";

    export default {
        components: {
            DatePicker,
            barChart
        },
        props: {
            bid_expiry: {
                type: Array
            }
        },
        data() {
            return {
                start: {
                    date: moment().add('month','-1').toDate()
                },
                to:{
                    date: moment().toDate()
                },
                search: '',
                sortBy: 'date',
                sortDesc: false,
                headers: FieldDefs
            }
        },
        mounted() {
            this.getBidBondExpiry();
        },
        methods: {
            getBidBondExpiry() {
                if (!this.bid_summary.length) {
                    this.fetch();
                }
            },
            fetch() {
                this.$store.dispatch('fetchBidBondExpiry', {start: this.start.date, end: this.to.date});
            }
        },
        computed: {
            bid_summary() {
                return this.$store.getters.getBidbondsSummary;
            },
            period() {
                return [this.start.date, this.to.date].join();
            }
        },
        watch: {
            period() {
                if (this.start.date && this.to.date) {
                    this.fetch();
                }
            },
        }
    }
</script>
